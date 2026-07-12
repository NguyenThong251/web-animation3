"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * Masked line-reveal for copy blocks (1:1 rebuild of the original site's
 * component — module 63168 in the original client bundle).
 *
 * SplitText type:"lines" mask:"lines", then lines animate
 * y:"100%" -> "0%", duration 1.4, stagger .15, ease "power4.out",
 * ScrollTrigger start "top 95%", once.
 */
export default function FadeIn({
  children,
  animateOnScroll = true,
  delay = 0,
}: {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
          onSplit: (self: SplitText) => {
            const textIndent = window.getComputedStyle(el).textIndent;
            if (textIndent && textIndent !== "0px" && self.lines.length > 0) {
              (self.lines[0] as HTMLElement).style.paddingLeft = textIndent;
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
  }, [animateOnScroll, delay]);

  return (
    <span ref={ref} className="inline-block" style={{ opacity: revealed ? 1 : 0 }}>
      {children}
    </span>
  );
}
