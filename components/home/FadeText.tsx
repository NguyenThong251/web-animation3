"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePageReady } from "./usePageReady";

gsap.registerPlugin(SplitText, ScrollTrigger);

type FadeTextProps = {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
};

export default function FadeText({
  children,
  animateOnScroll = true,
  delay = 0,
}: FadeTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isPageReady = usePageReady();
  const [visible, setVisible] = useState(false);
  const mmRef = useRef<gsap.MatchMedia | null>(null);

  useEffect(() => {
    if (!ref.current || !isPageReady) return;
    const el = ref.current;

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
          setVisible(true);
          const vars: gsap.TweenVars = {
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
          autoSplit: true,
          aria: "auto",
          onSplit: (self: SplitText) => {
            const textIndent = window.getComputedStyle(el).textIndent;
            if (
              textIndent &&
              textIndent !== "0px" &&
              self.lines.length > 0
            ) {
              (self.lines[0] as HTMLElement).style.paddingLeft = textIndent;
              el.style.textIndent = "0";
            }
            setVisible(true);
            const vars: gsap.TweenVars = {
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
                    scrollTrigger: {
                      trigger: el,
                      start: "top 95%",
                      once: true,
                    },
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
  }, [animateOnScroll, delay, isPageReady]);

  return (
    <span ref={ref} className="inline-block" style={{ opacity: visible ? 1 : 0 }}>
      {children}
    </span>
  );
}
