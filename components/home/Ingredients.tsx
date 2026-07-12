"use client";

import React, { useEffect, useRef } from "react";
import FadeText from "./FadeText";

type ParallaxTarget = {
  ref: React.RefObject<HTMLDivElement | null>;
  factor: number;
};

/**
 * Mirrors the original ParallaxSection which subscribed to Lenis scroll
 * updates. Lenis animates the native scroll position, so a passive scroll
 * listener produces the identical `translateY((scroll - top + vh) * factor)`
 * behavior with or without a Lenis provider.
 */
function ParallaxSection({
  children,
  className = "",
  targets = [],
  sectionId,
}: {
  children: React.ReactNode;
  className?: string;
  targets?: ParallaxTarget[];
  sectionId?: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      const list = targetsRef.current;
      if (!section || !list.length) return;
      const scroll = window.scrollY;
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const progress = scroll - top + window.innerHeight;
      if (progress > 0 && scroll < top + height) {
        for (const target of list) {
          if (target?.ref?.current) {
            target.ref.current.style.transform = `translateY(${
              progress * target.factor
            }px)`;
          }
        }
      }
    };
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id={sectionId} ref={sectionRef} className={className}>
      {children}
    </section>
  );
}

const INGREDIENTS = [
  {
    src: "/img-webp/tomato.webp",
    alt: "Fresh organic tomato slice",
    style:
      "w-[18vw] max-md:w-[26vw] h-auto absolute right-[15vw] max-md:right-[5vw] top-[18vw] max-md:top-[25vw] z-10",
    factor: -0.07,
  },
  {
    src: "/img-webp/cheese.webp",
    alt: "Premium cheddar cheese slice",
    style:
      "w-[23vw] max-md:w-[32vw] h-auto absolute left-[14vw] max-md:left-[5vw] top-[37vw] max-md:top-[65vw] z-20",
    factor: -0.05,
  },
  {
    src: "/img-webp/meat.webp",
    alt: "Smashed artisan beef patty",
    style:
      "w-[20vw] max-md:w-[28vw] h-auto absolute right-[16vw] max-md:right-[5vw] bottom-[-4vw] max-md:bottom-[-10vw] z-30",
    factor: -0.09,
  },
  {
    src: "/img-webp/lettuce.webp",
    alt: "Crispy garden lettuce leaf",
    style:
      "w-[24vw] max-md:w-[36vw] h-auto absolute left-[15vw] max-md:left-[5vw] top-[5vw] max-md:top-[20vw] z-40",
    factor: -0.06,
  },
];

const HEADLINES = ["Every Layer", "Packed With", "Signature", "Flavor"];

export default function Ingredients() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>(
    INGREDIENTS.map(() => ({ current: null }))
  );
  const targets = INGREDIENTS.map((item, i) => ({
    ref: imageRefs.current[i],
    factor: item.factor,
  }));

  return (
    <ParallaxSection
      sectionId="ingredients"
      className="h-fit max-md:h-fit max-md:py-[14vw] w-full px-[2.5vw] relative"
      targets={targets}
    >
      <div
        ref={contentRef}
        className="h-fit pt-[2vw] relative z-100 space-y-[3vw] w-full max-md:space-y-[6vw]"
      >
        <p className="text-red -rotate-7 max-md:rotate-0 mx-auto uppercase text-stroke-180 text-center text-[2.8vw] max-md:text-[8vw] font-modak leading-[.9]!">
          Pure quality
        </p>
        <div className="max-md:mt-[10vw] flex flex-col gap-[1vw] w-full items-center justify-center">
          {HEADLINES.map((line) => (
            <p
              key={line}
              className="heading300 mx-auto text-center w-[60vw] max-md:w-full leading-[.75] uppercase text-stroke-180 text-red"
            >
              <FadeText>{line}</FadeText>
            </p>
          ))}
        </div>
        {INGREDIENTS.map((item, i) => (
          <div
            key={item.src}
            ref={(el) => {
              imageRefs.current[i].current = el;
            }}
            className={item.style}
            style={{ willChange: "transform" }}
          >
            <img
              alt={item.alt}
              width={1000}
              height={1000}
              decoding="async"
              {...(i === 0 ? {} : { loading: "lazy" as const })}
              className="h-full w-full object-contain"
              style={{ color: "transparent" }}
              src={item.src}
            />
          </div>
        ))}
      </div>
    </ParallaxSection>
  );
}
