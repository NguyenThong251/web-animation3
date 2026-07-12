"use client";

import {
  createElement,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTitleProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  innerClassName?: string;
  delay?: number;
  split?: "words" | "chars";
  stagger?: number;
  duration?: number;
  ease?: string;
  scroll?: boolean;
  scrollStart?: string;
  once?: boolean;
  [key: string]: unknown;
}

/**
 * Word/char "pop" reveal (original module 59598). Each token is wrapped in a
 * [data-pop] span, hidden until played, then popped in with a springy
 * back.out ease from a random y offset / rotation.
 */
export default function AnimatedTitle({
  children,
  as = "span",
  className = "",
  innerClassName = "",
  delay = 0,
  split = "words",
  stagger = 0.055,
  duration = 0.72,
  ease = "back.out(2.35)",
  scroll = true,
  scrollStart = "top 88%",
  once = true,
  ...rest
}: AnimatedTitleProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [played, setPlayed] = useState(false);
  const text = typeof children === "string" ? children : "";

  const tokens = useMemo(
    () =>
      text
        ? split === "chars"
          ? [...text]
          : text.split(/(\s+)/).filter((t) => t.length > 0)
        : [],
    [text, split]
  );

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || !tokens.length) return;

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
          const pops = el.querySelectorAll("[data-pop]");
          if (!pops.length) return;

          const play = () => {
            setPlayed(true);
            if (reduceMotion) {
              gsap.fromTo(
                pops,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.4,
                  delay,
                  ease: "power1.out",
                  stagger: 0.02,
                  overwrite: "auto",
                }
              );
            } else {
              gsap.set(pops, {
                opacity: 0,
                scale: 0,
                y: 0,
                rotation: 0,
                transformOrigin: "50% 90%",
                force3D: true,
              });
              gsap.fromTo(
                pops,
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
                }
              );
            }
          };

          if (scroll) {
            ScrollTrigger.create({
              trigger: el,
              start: scrollStart,
              once,
              onEnter: play,
            });
          } else {
            play();
          }
        },
        el
      );

      let raf = 0;
      let timer = 0;
      const onResize = () => {
        if (raf) cancelAnimationFrame(raf);
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          raf = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        }, 120);
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        if (raf) cancelAnimationFrame(raf);
        if (timer) clearTimeout(timer);
        mm.revert();
      };
    },
    {
      scope: rootRef,
      dependencies: [tokens, text, split, scroll, scrollStart, once, duration, ease, stagger, delay],
    }
  );

  if (!text) {
    return createElement(as, { ref: rootRef, className, ...rest }, children);
  }

  return createElement(
    as,
    { ref: rootRef, className, ...rest },
    <span className="sr-only">{text}</span>,
    <span
      aria-hidden={true}
      className={innerClassName}
      style={{ visibility: played ? "visible" : "hidden" }}
    >
      {tokens.map((token, i) =>
        token === "\n" ? (
          <br key={`${i}-br`} />
        ) : /^\s+$/.test(token) ? (
          <span key={`${i}-ws`}>{token}</span>
        ) : (
          <span
            key={`${i}-${token}`}
            data-pop={true}
            className="inline-block will-change-transform"
          >
            {token}
          </span>
        )
      )}
    </span>
  );
}
