"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useLenis } from "lenis/react";
import HoverText from "./HoverText";
import { useAnimation } from "./AnimationProvider";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Our Spices", href: "/spices" },
  { label: "Locations", href: "#map" },
  { label: "Contact", href: "/contact" },
];

function resolveHashTarget(hash: string): Element | null {
  if (!hash?.startsWith("#")) return null;
  if (hash === "#map") {
    const isMobile = window.matchMedia("(max-width: 1025px)").matches;
    return document.querySelector(isMobile ? "#map-mobile" : "#map-desktop");
  }
  return document.querySelector(hash);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const topLineRef = useRef<HTMLSpanElement>(null);
  const midLineRef = useRef<HTMLSpanElement>(null);
  const botLineRef = useRef<HTMLSpanElement>(null);
  const iconTlRef = useRef<gsap.core.Timeline | null>(null);
  const lastScrollRef = useRef(0);
  const navVisibleRef = useRef(true);

  const pathname = usePathname();
  const { setScrollTarget, scrollTarget, isPageReady } = useAnimation();

  // Hide navbar when scrolling down, reveal when scrolling up.
  const lenis = useLenis(
    ({ scroll }: { scroll: number }) => {
      const nav = navRef.current;
      if (!nav) return;
      if (lastScrollRef.current === 0 && window.scrollY > 0) {
        lastScrollRef.current = window.scrollY;
      }
      gsap.set(nav, { willChange: "transform" });
      const showNav = () => {
        if (!navVisibleRef.current) {
          navVisibleRef.current = true;
          gsap.to(nav, {
            y: 0,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };
      if (open) {
        showNav();
        lastScrollRef.current = scroll;
        return;
      }
      const delta = scroll - lastScrollRef.current;
      if (scroll < 10) {
        showNav();
      } else if (delta > 6) {
        if (navVisibleRef.current) {
          navVisibleRef.current = false;
          const height = nav.offsetHeight || 0;
          gsap.to(nav, {
            y: -(height + 12),
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      } else if (delta < -6) {
        showNav();
      }
      lastScrollRef.current = scroll;
    },
    [open],
  );

  // Flip nav colors while dark sections ([data-nav-dark="true"]) are in view.
  useEffect(() => {
    setDark(false);
    const sections = document.querySelectorAll('[data-nav-dark="true"]');
    const triggers: ScrollTrigger[] = [];
    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top 5%",
        end: "bottom 5%",
        onEnter: () => setDark(true),
        onEnterBack: () => setDark(true),
        onLeave: () => setDark(false),
        onLeaveBack: () => setDark(false),
      });
      triggers.push(trigger);
    });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  const scrollToHash = (hash?: string) => {
    if (!hash?.startsWith("#")) return;
    const target = resolveHashTarget(hash);
    if (!target) return;
    const offsetY = navRef.current?.offsetHeight ?? 0;
    gsap.to(window, {
      duration: 0.9,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: offsetY + 12 },
    });
  };

  // Dropdown menu open/close timeline.
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = menuPanelRef.current;
    if (backdrop && panel) {
      if (!menuTlRef.current) {
        gsap.set(backdrop, { opacity: 0, pointerEvents: "none" });
        gsap.set(panel, { opacity: 0, scale: 0.3, transformOrigin: "top right" });
        const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
        tl.add(() => gsap.set(backdrop, { pointerEvents: "auto" }), 0)
          .to(backdrop, { opacity: 1, duration: 0.28, ease: "power2.out" }, 0)
          .to(
            panel,
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" },
            0.3,
          )
          .fromTo(
            () => menuItemsRef.current?.children || [],
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.38, stagger: 0.06, ease: "power3.out" },
            0.14,
          );
        tl.eventCallback("onReverseComplete", () => {
          gsap.set(backdrop, { pointerEvents: "none" });
        });
        menuTlRef.current = tl;
      }
      if (open) {
        menuTlRef.current.play();
      } else {
        menuTlRef.current.reverse();
      }
    }
  }, [open]);

  // Burger icon -> X morph timeline (rebuilt on resize for vw units).
  useEffect(() => {
    const top = topLineRef.current;
    const mid = midLineRef.current;
    const bot = botLineRef.current;
    if (!top || !mid || !bot) return;

    const build = () => {
      iconTlRef.current?.kill();
      gsap.set([top, mid, bot], {
        clearProps: "transform,top,bottom,opacity,scaleX",
      });
      gsap.set(top, { top: 0, bottom: "auto" });
      gsap.set(mid, { opacity: 1, scaleX: 1 });
      gsap.set(bot, { top: "auto", bottom: 0 });
      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.35, ease: "power3.inOut" },
      });
      tl.to(
        top,
        { top: "50%", yPercent: -50, rotation: 45, transformOrigin: "50% 50%" },
        0,
      )
        .to(
          bot,
          {
            top: "50%",
            bottom: "auto",
            yPercent: -50,
            rotation: -45,
            transformOrigin: "50% 50%",
          },
          0,
        )
        .to(mid, { opacity: 0, scaleX: 0, transformOrigin: "50% 50%" }, 0);
      return tl;
    };

    iconTlRef.current = build();
    if (open) iconTlRef.current.progress(1);

    let timeout = 0;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        const progress = iconTlRef.current?.progress() ?? 0;
        iconTlRef.current = build();
        iconTlRef.current.progress(progress);
      }, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", onResize);
      iconTlRef.current?.kill();
      iconTlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (iconTlRef.current) {
      if (open) {
        iconTlRef.current.play();
      } else {
        iconTlRef.current.reverse();
      }
    }
  }, [open]);

  // Freeze page scroll while the menu is open.
  useEffect(() => {
    if (!lenis) return;
    if (open) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => {
      lenis.start();
    };
  }, [lenis, open]);

  // Click outside closes the menu.
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // Cross-page hash targets (e.g. Locations clicked on /menu -> scroll on /).
  useEffect(() => {
    if (scrollTarget && pathname === "/" && isPageReady) {
      const timeout = setTimeout(() => {
        scrollToHash(`#${scrollTarget}`);
        setScrollTarget(null);
      }, 100);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTarget, pathname, isPageReady]);

  const onMenuLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      const target = href.substring(1);
      if (pathname === "/") {
        event.preventDefault();
        setOpen(false);
        scrollToHash(href);
      } else {
        setScrollTarget(target);
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <div
        ref={backdropRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-998 bg-red/30 backdrop-blur-md"
        style={{ opacity: 0, pointerEvents: "none" }}
        aria-hidden={true}
      />
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-999 flex items-center justify-between px-[2.5vw] max-md:px-[4vw] py-[1vw] max-md:py-[4vw]"
      >
        <Link
          href="/"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              scrollToHash("#hero");
            }
          }}
          className="font-modak hover:scale-105 transition-all duration-300 text-red text-stroke-small text-[4vw] max-md:text-[10vw] leading-none"
        >
          CRAV
        </Link>
        <div className="flex items-center gap-[1vw] max-md:gap-[3vw]">
          <Link
            className="font-mouse-memoirs hover:scale-105 transition-all duration-300 flex items-center justify-center text-[1.3vw] max-md:text-[4vw] uppercase tracking-wide text-beige bg-red px-[1.6vw] py-[.5vw] max-md:px-[5vw] max-md:py-[1.8vw] group rounded-full hover:bg-black"
            data-cursor-hide="true"
            href="/menu"
          >
            <HoverText>Burgers</HoverText>
          </Link>
          <div className="relative">
            <button
              data-cursor-hide="true"
              onClick={(event) => {
                event.stopPropagation();
                setOpen(!open);
              }}
              className={`hover:scale-105 flex items-center gap-[.6vw] max-md:gap-[2vw] px-[1.4vw] py-[.5vw] max-md:px-[4vw] group max-md:py-[1.8vw] rounded-full cursor-pointer transition-all duration-400 border-[.15vw] max-md:border-[.4vw] ${
                open
                  ? "bg-red border-red"
                  : dark
                    ? "bg-transparent border-white/20 hover:border-white"
                    : "bg-transparent border-black/20 hover:border-black"
              }`}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="main-menu"
            >
              <span
                className={`font-mouse-memoirs flex items-center justify-center uppercase text-[1.3vw] max-md:text-[4vw] tracking-wide transition-colors duration-300 ${
                  open ? "text-beige" : dark ? "text-white" : "text-black"
                }`}
              >
                {open ? "Close" : <HoverText>Menu</HoverText>}
              </span>
              <div
                className="relative shrink-0 w-[1.2vw] h-[1.2vw] max-md:w-[3.5vw] max-md:h-[3.5vw]"
                aria-hidden="true"
              >
                <span
                  ref={topLineRef}
                  className={`${
                    open ? "bg-beige" : dark ? "bg-white" : "bg-black"
                  } absolute left-0 top-0 block w-full h-[.15vw] max-md:h-[.5vw] rounded-full origin-center`}
                />
                <span
                  ref={midLineRef}
                  className={`${
                    open ? "bg-beige" : dark ? "bg-white" : "bg-black"
                  } absolute left-0 top-1/2 block w-[70%] h-[.15vw] max-md:h-[.5vw] rounded-full origin-center -translate-y-1/2`}
                />
                <span
                  ref={botLineRef}
                  className={`${
                    open ? "bg-beige" : dark ? "bg-white" : "bg-black"
                  } absolute left-0 bottom-0 block w-full h-[.15vw] max-md:h-[.5vw] rounded-full origin-center`}
                />
              </div>
            </button>
            <div
              ref={menuPanelRef}
              id="main-menu"
              role="menu"
              className="absolute top-[calc(100%+1vw)] right-0 w-[18vw] max-md:w-[91vw] bg-red rounded-[1.2vw] max-md:rounded-[4vw] p-[2vw] max-md:mt-[5vw] max-md:p-[6vw] shadow-[0_1vw_3vw_rgba(27,27,27,.25)]"
              style={{
                opacity: 0,
                scale: 0.3,
                transformOrigin: "top right",
                pointerEvents: open ? "auto" : "none",
              }}
            >
              <div
                ref={menuItemsRef}
                className="flex flex-col gap-[.6vw] max-md:gap-[2vw]"
              >
                {MENU_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    role="menuitem"
                    href={link.href.startsWith("#") ? "/" : link.href}
                    onClick={(event) => onMenuLinkClick(event, link.href)}
                    className="font-modak text-[2.4vw] max-md:text-[8vw] text-beige leading-[1.1] uppercase hover:text-mustard hover:scale-105 transition-transform duration-300  transform inline-block"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-[1.5vw] max-md:mt-[4vw] pt-[1vw] max-md:pt-[3vw] border-t border-beige/20">
                <p className="font-mouse-memoirs text-[.9vw] max-md:text-[3.5vw] text-beige/85 uppercase tracking-[.2em]">
                  Est. 1997 — Navarra, España
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
