"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

type TextRevealProps = {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
};

/**
 * SplitText line-mask reveal. 1:1 port of the original component
 * (module 63168 in _reference/_original/_next/static/chunks).
 */
export default function TextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
}: TextRevealProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const mmRef = useRef<gsap.MatchMedia | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          el.setAttribute("aria-label", el.innerText);
          setRevealed(true);
          const vars = { opacity: 1, duration: 0.4, ease: "power1.out", delay };
          if (animateOnScroll) {
            gsap.fromTo(
              el,
              { opacity: 0 },
              {
                ...vars,
                scrollTrigger: { trigger: el, start: "top 95%", once: true },
              }
            );
          } else {
            gsap.fromTo(el, { opacity: 0 }, vars);
          }
          return;
        }

        const splitInstance = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          lineThreshold: 0.1,
          autoSplit: true,
          aria: "auto",
          onSplit: (self) => {
            const indent = window.getComputedStyle(el).textIndent;
            if (indent && indent !== "0px" && self.lines.length > 0) {
              (self.lines[0] as HTMLElement).style.paddingLeft = indent;
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
            return animateOnScroll
              ? gsap.fromTo(
                  self.lines,
                  { y: "100%" },
                  {
                    ...vars,
                    scrollTrigger: { trigger: el, start: "top 95%", once: true },
                  }
                )
              : gsap.fromTo(self.lines, { y: "100%" }, vars);
          },
        });

        return () => {
          splitInstance.revert();
        };
      },
      el
    );
    mmRef.current = mm;

    let raf = 0;
    let timer = 0;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        raf = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      mm.revert();
      mmRef.current = null;
    };
  }, [animateOnScroll, delay]);

  return (
    <span ref={rootRef} className="inline-block" style={{ opacity: revealed ? 1 : 0 }}>
      {children}
    </span>
  );
}
