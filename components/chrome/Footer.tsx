"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverText from "./HoverText";
import { GrowLine, PopText, TextReveal } from "./text-effects";

gsap.registerPlugin(ScrollTrigger);

const INGREDIENTS = [
  { src: "/img-webp/lettuce.webp", alt: "lettuce", size: 11, lane: 12 },
  { src: "/img-webp/tomato.webp", alt: "tomato", size: 9, lane: 34 },
  { src: "/img-webp/cheese-logo.webp", alt: "cheese", size: 12, lane: 56 },
  { src: "/img-webp/meat.webp", alt: "patty", size: 13, lane: 80 },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Burgers", href: "/menu" },
  { label: "Spices", href: "/spices" },
  { label: "Contact", href: "/contact" },
];

const DESKTOP_JUGGLE = {
  restVH: 22,
  apex: [38, 60] as [number, number],
  driftStart: [2, 7] as [number, number],
  driftEnd: [8, 24] as [number, number],
  upDur: [0.9, 1.3] as [number, number],
  gravityRatio: [1.15, 1.5] as [number, number],
  spin: [220, 600] as [number, number],
  repeatDelay: [0.2, 0.9] as [number, number],
  staggerStart: 0.55,
  sizeScale: 1,
};

const MOBILE_JUGGLE = {
  restVH: 8,
  apex: [12, 18] as [number, number],
  driftStart: [1, 3] as [number, number],
  driftEnd: [5, 10] as [number, number],
  upDur: [0.7, 0.95] as [number, number],
  gravityRatio: [1.08, 1.18] as [number, number],
  spin: [80, 180] as [number, number],
  repeatDelay: [0.12, 0.38] as [number, number],
  staggerStart: 0.4,
  sizeScale: 1.29,
};

const DESKTOP_STATIC_POSES = [
  { y: -14, x: -2, rotation: -10 },
  { y: -10, x: 1, rotation: 8 },
  { y: -16, x: -1, rotation: -4 },
  { y: -12, x: 2, rotation: 12 },
];

const MOBILE_STATIC_POSES = [
  { y: -7, x: -1, rotation: -8 },
  { y: -5, x: 1, rotation: 6 },
  { y: -8, x: 0, rotation: -3 },
  { y: -6, x: 1, rotation: 9 },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const mm = gsap.matchMedia(footer);
    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, reduceMotion } = context.conditions as {
          isMobile: boolean;
          reduceMotion: boolean;
        };
        const config = isMobile ? MOBILE_JUGGLE : DESKTOP_JUGGLE;
        gsap.set(footer, { "--juggle-scale": config.sizeScale });

        const imgs = imgRefs.current.filter(Boolean) as HTMLImageElement[];
        if (!imgs.length) return;
        const active = new Set<gsap.core.Timeline>();

        gsap.set(imgs, {
          xPercent: -50,
          x: 0,
          y: `${config.restVH}vh`,
          rotation: 0,
          opacity: 0,
          scale: 0.9,
          transformOrigin: "50% 50%",
          force3D: true,
        });

        if (reduceMotion) {
          const poses = isMobile ? MOBILE_STATIC_POSES : DESKTOP_STATIC_POSES;
          imgs.forEach((img, i) => {
            const pose = poses[i] || poses[poses.length - 1];
            gsap.fromTo(
              img,
              {
                x: `${pose.x}vw`,
                y: `${0.5 * pose.y}vh`,
                rotation: pose.rotation,
                opacity: 0,
                scale: 0.85,
              },
              {
                x: `${pose.x}vw`,
                y: `${pose.y}vh`,
                rotation: pose.rotation,
                opacity: 1,
                scale: 1,
                duration: 0.7,
                delay: 0.12 * i,
                ease: "power2.out",
              },
            );
          });
          return;
        }

        const juggle = (img: HTMLImageElement) => {
          const apex = gsap.utils.random(...config.apex);
          const direction = Math.random() > 0.5 ? 1 : -1;
          const startX = -(gsap.utils.random(...config.driftStart) * direction);
          const endX = gsap.utils.random(...config.driftEnd) * direction;
          const upDuration = gsap.utils.random(...config.upDur);
          const downDuration =
            upDuration * gsap.utils.random(...config.gravityRatio);
          const totalDuration = upDuration + downDuration;
          const spin =
            gsap.utils.random(...config.spin) * (Math.random() > 0.5 ? 1 : -1);
          const restDelay = gsap.utils.random(...config.repeatDelay);

          gsap.set(img, {
            x: `${startX}vw`,
            y: `${config.restVH}vh`,
            rotation: 0,
            opacity: 0,
            scale: 0.9,
          });

          const tl = gsap.timeline({
            defaults: { overwrite: "auto" },
            onComplete: () => {
              active.delete(tl);
              gsap.delayedCall(restDelay, () => juggle(img));
            },
          });
          active.add(tl);
          tl.to(img, { opacity: 1, scale: 1, duration: 0.18, ease: "power1.out" }, 0)
            .to(img, { y: `${-apex}vh`, duration: upDuration, ease: "power2.out" }, 0)
            .to(
              img,
              { y: `${config.restVH}vh`, duration: downDuration, ease: "power2.in" },
              upDuration,
            )
            .to(img, { x: `${endX}vw`, duration: totalDuration, ease: "sine.inOut" }, 0)
            .to(img, { rotation: spin, duration: totalDuration, ease: "none" }, 0)
            .to(
              img,
              { opacity: 0, duration: 0.25, ease: "power1.in" },
              totalDuration - 0.25,
            );
        };

        imgs.forEach((img, i) => {
          const startDelay =
            i * config.staggerStart + gsap.utils.random(0, 0.4);
          gsap.delayedCall(startDelay, () => juggle(img));
        });

        const onVisibility = () => {
          if (document.hidden) {
            active.forEach((tl) => tl.pause());
          } else {
            active.forEach((tl) => tl.play());
          }
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
          document.removeEventListener("visibilitychange", onVisibility);
          active.forEach((tl) => tl.kill());
          active.clear();
        };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <footer ref={footerRef} className="h-fit w-full  overflow-hidden self relative">
      <div className="relative z-30 flex items-center justify-between gap-[2vw] pb-[1vw] max-md:flex-col max-md:items-center max-md:gap-[4vw] max-md:pb-[6vw]">
        <nav
          className="flex flex-wrap items-center gap-x-[2vw] gap-y-[.6vw] max-md:gap-x-[5vw] max-md:gap-y-[2vw]"
          aria-label="Footer navigation"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text40 uppercase font-mouse-memoirs hover:text-red transition-colors"
              aria-label={link.label}
            >
              <div aria-hidden="true">
                <TextReveal>
                  <HoverText>{link.label}</HoverText>
                </TextReveal>
              </div>
            </Link>
          ))}
        </nav>
        <TextReveal delay={0.25}>
          <p className="text40 max-md:hidden uppercase opacity-80 font-mouse-memoirs">
            © {new Date().getFullYear()} CRAV — All rights reserved
          </p>
        </TextReveal>
      </div>
      <GrowLine
        delay={0.25}
        className="relative z-30 max-md:hidden"
        lineClassName="h-[2px]  w-full bg-black/20"
        start="top 92%"
        once={true}
      />
      <div className="relative z-30 max-md:hidden pt-[1vw] opacity-80 max-md:pt-[4vw]">
        <TextReveal delay={0.25}>
          <p className="text40 uppercase font-mouse-memoirs">
            Smashed patties · toasted buns · est. 1997
          </p>
        </TextReveal>
      </div>
      <div className="mt-[10vw]  relative min-h-[18vw] max-md:mt-[5vw]">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0 z-20"
          aria-hidden="true"
        >
          {INGREDIENTS.map((ingredient, i) => (
            <img
              key={ingredient.src}
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              src={ingredient.src}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                bottom: 0,
                left: `${ingredient.lane}%`,
                width: `calc(${ingredient.size}vw * var(--juggle-scale, 1))`,
                opacity: 0,
                userSelect: "none",
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
        <PopText
          as="h2"
          className="heading600 leading-[.5] translate-y-[5vw] max-md:translate-y-0 text-center text-red text-stroke z-10 relative"
          split="chars"
          stagger={0.03}
          duration={0.75}
          ease="back.out(2.6)"
          scrollStart="top 92%"
        >
          CRAV
        </PopText>
        <div className="relative hidden max-md:block z-30 mt-[10vw]">
          <GrowLine
            className="relative"
            origin="center center"
            lineClassName="h-[2px] w-full bg-black/20"
            start="top 92%"
            once={true}
          />
        </div>
        <div className="relative z-30 pt-[1vw] max-md:pt-[4vw]">
          <p className="text40 uppercase font-mouse-memoirs opacity-80 text-center">
            <TextReveal>
              <span className="hidden max-md:block">
                Smashed patties · toasted buns · est. 1997
              </span>
            </TextReveal>
            <TextReveal delay={0.25}>
              <span className="md:hidden block">
                © {new Date().getFullYear()} CRAV — All rights reserved
              </span>
            </TextReveal>
          </p>
        </div>
      </div>
    </footer>
  );
}
