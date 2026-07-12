"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useAnimation } from "./AnimationProvider";

type Stage = "none" | "leaving" | "entering";

const HIDDEN_D = "M -1 101 L 101 101 L 101 101 Q 50 101 -1 101 Z";
const COVER_D = "M -1 -1 L 101 -1 L 101 101 Q 50 101 -1 101 Z";

/**
 * Route-change curtain (module 82148 in the original bundle). Renders the
 * page inside the original wrapper div, intercepts internal link clicks,
 * covers the viewport with three swipe-up layers + "Craving..." wordmark,
 * navigates, then reveals the new page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTransitionFinished } = useAnimation();

  const [stage, setStage] = useState<Stage>("none");
  const stageRef = useRef<Stage>("none");
  stageRef.current = stage;

  const mustardPathRef = useRef<SVGPathElement>(null);
  const orangePathRef = useRef<SVGPathElement>(null);
  const redPathRef = useRef<SVGPathElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const flickerRef = useRef<gsap.core.Timeline | null>(null);
  const firstRenderRef = useRef(true);

  const playLeave = useCallback(
    (onDone: () => void) => {
      setTransitionFinished(false);
      const tl = gsap.timeline({ onComplete: onDone });
      const mustard = { yLeft: 101, yRight: 101, yCenter: 101 };
      const orange = { yLeft: 101, yRight: 101, yCenter: 101 };
      const red = { yLeft: 101, yRight: 101, yCenter: 101 };

      gsap.set(
        [mustardPathRef.current, orangePathRef.current, redPathRef.current],
        { attr: { d: HIDDEN_D } },
      );

      const rise = (
        state: { yLeft: number; yRight: number; yCenter: number },
        path: SVGPathElement | null,
        at: number,
      ) => {
        const update = () => {
          path &&
            path.setAttribute(
              "d",
              `M -1 101 L 101 101 L 101 ${state.yRight} Q 50 ${state.yCenter} -1 ${state.yLeft} Z`,
            );
        };
        tl.to(
          state,
          { yCenter: -1, duration: 0.65, ease: "power2.out", onUpdate: update },
          at,
        ).to(
          state,
          {
            yLeft: -1,
            yRight: -1,
            duration: 0.85,
            ease: "power3.inOut",
            onUpdate: update,
          },
          at,
        );
      };

      rise(red, redPathRef.current, 0);
      rise(orange, orangePathRef.current, 0.1);
      rise(mustard, mustardPathRef.current, 0.2);

      tl.fromTo(
        textWrapRef.current,
        { scale: 0.7, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(2)",
          onComplete: () => {
            if (textRef.current) {
              flickerRef.current = gsap
                .timeline({ repeat: -1 })
                .to(textRef.current, {
                  opacity: 0.3,
                  duration: 0.4,
                  yoyo: true,
                  repeat: 1,
                  ease: "sine.inOut",
                });
            }
          },
        },
        "-=0.4",
      );
    },
    [setTransitionFinished],
  );

  const playEnter = useCallback(
    (onDone: () => void) => {
      const tl = gsap.timeline({
        onComplete: () => {
          onDone();
          setTransitionFinished(true);
        },
      });
      const mustard = { yLeft: 101, yRight: 101, yCenter: 101 };
      const orange = { yLeft: 101, yRight: 101, yCenter: 101 };
      const red = { yLeft: 101, yRight: 101, yCenter: 101 };

      gsap.set(
        [mustardPathRef.current, orangePathRef.current, redPathRef.current],
        { attr: { d: COVER_D } },
      );

      const exit = (
        state: { yLeft: number; yRight: number; yCenter: number },
        path: SVGPathElement | null,
        at: number,
      ) => {
        tl.to(
          state,
          { yLeft: -1, yRight: -1, duration: 0.75, ease: "power2.inOut" },
          at,
        ).to(
          state,
          {
            yCenter: -1,
            duration: 1.05,
            ease: "power4.inOut",
            onUpdate: () => {
              path &&
                path.setAttribute(
                  "d",
                  `M -1 -1 L 101 -1 L 101 ${state.yRight} Q 50 ${state.yCenter} -1 ${state.yLeft} Z`,
                );
            },
          },
          at,
        );
      };

      exit(mustard, mustardPathRef.current, 0);
      exit(orange, orangePathRef.current, 0.1);
      exit(red, redPathRef.current, 0.2);

      tl.fromTo(
        textWrapRef.current,
        { scale: 1, opacity: 1 },
        {
          scale: 1.3,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onStart: () => {
            flickerRef.current?.kill();
            flickerRef.current = null;
          },
        },
        0,
      );
    },
    [setTransitionFinished],
  );

  const navigate = useCallback(
    (href: string | null) => {
      if (stageRef.current === "leaving") return;
      if (!href || href.startsWith("#")) {
        if (href) router.push(href);
        return;
      }
      // Rendered hrefs include basePath, but router.push re-prepends it.
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      if (base && href.startsWith(base)) {
        href = href.slice(base.length) || "/";
      }
      let current: URL;
      let next: URL;
      try {
        current = new URL(window.location.href);
        next = new URL(href, current);
      } catch {
        router.push(href);
        return;
      }
      const isSame =
        next.pathname === current.pathname &&
        next.search === current.search &&
        next.hash === current.hash;
      const isHashOrQueryOnly =
        next.pathname === current.pathname &&
        (next.search !== current.search || next.hash !== current.hash);
      if (next.origin !== current.origin || isSame || isHashOrQueryOnly) {
        router.push(href);
        return;
      }
      setStage("leaving");
      playLeave(() => {
        router.push(href);
      });
    },
    [router, playLeave],
  );

  // Intercept internal link clicks (delegated, like the original).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        anchor.getAttribute("data-transition-ignore") ||
        anchor.target === "_blank" ||
        anchor.origin !== window.location.origin ||
        anchor.rel === "external" ||
        anchor.download ||
        (anchor.getAttribute("target") && anchor.getAttribute("target") !== "_self") ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.which === 2 ||
        event.defaultPrevented
      ) {
        return;
      }
      event.preventDefault();
      navigate(href);
    };
    // Attach to <html> (like the original delegate util) so this runs BEFORE
    // React's root-level handlers -- next/link then bails on defaultPrevented
    // and the curtain timeline drives the navigation instead.
    const root = document.documentElement;
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [navigate]);

  // When the new route mounts while covered, reveal it.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (stageRef.current === "leaving") {
      setTransitionFinished(false);
      setStage("entering");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (stage === "entering") {
      playEnter(() => setStage("none"));
    }
  }, [stage, playEnter]);

  return (
    <>
      <div className="relative w-full h-full">{children}</div>
      <div className="fixed inset-0 w-full h-dvh pointer-events-none z-9999 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path ref={redPathRef} fill="#f91814" d={HIDDEN_D} />
        </svg>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path ref={orangePathRef} fill="#EF6F2E" d={HIDDEN_D} />
        </svg>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path ref={mustardPathRef} fill="#F4A804" d={HIDDEN_D} />
        </svg>
        <div
          ref={textWrapRef}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span ref={textRef} className="font-modak text-[#4C0016] heading180 uppercase ">
            Craving...
          </span>
        </div>
      </div>
    </>
  );
}
