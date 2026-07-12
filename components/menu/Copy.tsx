"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CopyProps {
  children: ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

/**
 * Masked line reveal (original module 63168). Splits its content into lines
 * (SplitText, masked) and slides each line up from y:100% with a power4.out
 * ease. Content stays at opacity 0 until the split is ready.
 */
export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
}: CopyProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };

        if (reduceMotion) {
          el.setAttribute("aria-label", el.innerText);
          setReady(true);
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
            setReady(true);
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
    };
  }, [animateOnScroll, delay]);

  return (
    <span ref={ref} className="inline-block" style={{ opacity: ready ? 1 : 0 }}>
      {children}
    </span>
  );
}
