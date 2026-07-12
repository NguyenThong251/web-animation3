"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Word/char pop-in headline animation (1:1 rebuild of the original site's
 * TextPop component — module 59598 in the original client bundle).
 *
 * gsap.fromTo([data-pop], { opacity:0, scale:0, y:random(18,40), rotation:random(-16,16) },
 *   { opacity:1, scale:1, y:0, rotation:0, duration:.72, ease:"back.out(2.35)", stagger:.055 })
 */
type TextPopProps = {
  children: React.ReactNode;
  as?: React.ElementType;
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
} & Record<string, unknown>;

export default function TextPop({
  children,
  as: Tag = "span",
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
}: TextPopProps) {
  const rootRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !tokens.length) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean };
        const targets = el.querySelectorAll("[data-pop]");
        if (!targets.length) return;

        const play = () => {
          setPlayed(true);
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
              }
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
    };
  }, [tokens, text, split, scroll, scrollStart, once, duration, ease, stagger, delay]);

  if (!text) {
    return (
      <Tag ref={rootRef} className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={rootRef} className={className} {...rest}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={innerClassName}
        style={{ visibility: played ? "visible" : "hidden" }}
      >
        {tokens.map((t, i) =>
          t === "\n" ? (
            <br key={`${i}-br`} />
          ) : /^\s+$/.test(t) ? (
            <span key={`${i}-ws`}>{t}</span>
          ) : (
            <span
              key={`${i}-${t}`}
              data-pop={true}
              className="inline-block will-change-transform"
            >
              {t}
            </span>
          )
        )}
      </span>
    </Tag>
  );
}
