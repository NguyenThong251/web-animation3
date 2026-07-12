"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  createElement,
  type ElementType,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useAnimation } from "./AnimationProvider";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Line-mask reveal (module 63168 in the original bundle). Wraps children in
 * an inline-block span, splits into masked lines with SplitText and slides
 * them up on scroll.
 */
export function TextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
}: {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { isPageReady } = useAnimation();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current || !isPageReady) return;
    const el = ref.current;
    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as {
          reduceMotion: boolean;
        };
        if (reduceMotion) {
          el.setAttribute("aria-label", el.innerText);
          setRevealed(true);
          const vars = {
            opacity: 1,
            duration: 0.4,
            ease: "power1.out",
            delay,
          };
          if (animateOnScroll) {
            gsap.fromTo(
              el,
              { opacity: 0 },
              {
                ...vars,
                scrollTrigger: { trigger: el, start: "top 95%", once: true },
              },
            );
          } else {
            gsap.fromTo(el, { opacity: 0 }, vars);
          }
          return;
        }
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          lineThreshold: 0.1,
          autoSplit: true,
          aria: "auto",
          onSplit: (instance) => {
            const textIndent = window.getComputedStyle(el).textIndent;
            if (textIndent && textIndent !== "0px" && instance.lines.length > 0) {
              (instance.lines[0] as HTMLElement).style.paddingLeft = textIndent;
              el.style.textIndent = "0";
            }
            setRevealed(true);
            const vars = {
              y: "0%",
              duration: 1.4,
              stagger: 0.15,
              ease: "power4.out",
              delay,
            };
            if (animateOnScroll) {
              return gsap.fromTo(
                instance.lines,
                { y: "100%" },
                {
                  ...vars,
                  scrollTrigger: { trigger: el, start: "top 95%", once: true },
                },
              );
            }
            return gsap.fromTo(instance.lines, { y: "100%" }, vars);
          },
        });
        return () => {
          split.revert();
        };
      },
      el,
    );

    let raf = 0;
    let timeout = 0;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        raf = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
      mm.revert();
    };
  }, [animateOnScroll, delay, isPageReady]);

  return (
    <span ref={ref} className="inline-block" style={{ opacity: revealed ? 1 : 0 }}>
      {children}
    </span>
  );
}

/**
 * Char/word pop-in text (module 59598 in the original bundle). Renders an
 * sr-only copy plus aria-hidden spans that scale/rotate into place.
 */
export function PopText({
  children,
  as = "span",
  className = "",
  delay = 0,
  innerClassName = "",
  split = "words",
  stagger = 0.055,
  duration = 0.72,
  ease = "back.out(2.35)",
  scroll = true,
  scrollStart = "top 88%",
  once = true,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  innerClassName?: string;
  split?: "words" | "chars";
  stagger?: number;
  duration?: number;
  ease?: string;
  scroll?: boolean;
  scrollStart?: string;
  once?: boolean;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const { isPageReady } = useAnimation();
  const mmRef = useRef<gsap.MatchMedia | null>(null);
  const text = typeof children === "string" ? children : "";
  const [started, setStarted] = useState(false);

  const parts = useMemo(
    () =>
      text
        ? split === "chars"
          ? [...text]
          : text.split(/(\s+)/).filter((part) => part.length > 0)
        : [],
    [text, split],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !parts.length || !isPageReady) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as {
          reduceMotion: boolean;
        };
        const targets = el.querySelectorAll("[data-pop]");
        if (!targets.length) return;
        const animate = () => {
          setStarted(true);
          if (reduceMotion) {
            gsap.fromTo(
              targets,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.4,
                delay,
                ease: "power1.out",
                stagger: 0.02,
                overwrite: "auto",
              },
            );
          } else {
            gsap.set(targets, {
              opacity: 0,
              scale: 0,
              y: 0,
              rotation: 0,
              transformOrigin: "50% 90%",
              force3D: true,
            });
            gsap.fromTo(
              targets,
              {
                opacity: 0,
                scale: 0,
                y: () => gsap.utils.random(18, 40),
                rotation: () => gsap.utils.random(-16, 16),
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                delay,
                rotation: 0,
                duration,
                ease,
                stagger,
                overwrite: "auto",
              },
            );
          }
        };
        if (scroll) {
          ScrollTrigger.create({
            trigger: el,
            start: scrollStart,
            once,
            onEnter: animate,
          });
        } else {
          animate();
        }
      },
      el,
    );
    mmRef.current = mm;

    let raf = 0;
    let timeout = 0;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        raf = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
      mm.revert();
      mmRef.current = null;
    };
  }, [
    parts,
    text,
    split,
    scroll,
    scrollStart,
    once,
    duration,
    ease,
    stagger,
    delay,
    isPageReady,
  ]);

  if (!text) {
    return createElement(as, { ref, className, ...rest }, children);
  }

  return createElement(
    as,
    { ref, className, ...rest },
    <span className="sr-only">{text}</span>,
    <span
      aria-hidden={true}
      className={innerClassName}
      style={{ visibility: started ? "visible" : "hidden" }}
    >
      {parts.map((part, i) =>
        part === "\n" ? (
          <br key={`${i}-br`} />
        ) : /^\s+$/.test(part) ? (
          <span key={`${i}-ws`}>{part}</span>
        ) : (
          <span
            key={`${i}-${part}`}
            data-pop={true}
            className="inline-block will-change-transform"
          >
            {part}
          </span>
        ),
      )}
    </span>,
  );
}

/**
 * Scroll-triggered horizontal line grow (footer separators).
 */
export function GrowLine({
  className = "",
  lineClassName = "",
  start = "top 92%",
  delay = 0,
  once = true,
  duration = 0.9,
  ease = "power3.out",
  origin = "0% 50%",
}: {
  className?: string;
  lineClassName?: string;
  start?: string;
  delay?: number;
  once?: boolean;
  duration?: number;
  ease?: string;
  origin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      gsap.set(el, { scaleX: 1, transformOrigin: origin });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: origin });
      gsap.to(el, {
        scaleX: 1,
        delay,
        duration,
        ease,
        scrollTrigger: { trigger: el, start, once },
      });
    }, el);
    return () => ctx.revert();
  }, [start, once, duration, ease, origin, delay]);

  return (
    <div className={className}>
      <div ref={ref} className={lineClassName} />
    </div>
  );
}
