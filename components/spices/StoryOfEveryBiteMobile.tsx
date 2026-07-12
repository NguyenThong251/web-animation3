"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import JellyDivider from "./JellyDivider";
import TextPop from "./TextPop";
import FadeIn from "./FadeIn";
import "./spices.css";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * Mobile "A story in every bite." section (1:1 rebuild of module 65165 in
 * the original client bundle).
 *
 * - Ingredient logos travel down the dashed vertical line (scrub: 1),
 *   fading in/out at the start/end of their own segment.
 * - Cards pop in individually (trigger "top 70%", once, back.out(2.2)).
 */
const PATH_FOLLOW = {
  scrollTrigger: { start: "-2% center", end: "95% center", scrub: 1, markers: false },
  motionPath: {
    alignOrigin: [0.5, 0.5] as [number, number],
    autoRotate: true,
    ease: "none",
  },
  segmentDuration: 1,
  logo: { xPercent: -50, yPercent: -50, widthClass: "w-[15vw]", zIndex: 2 },
};

const PATH_LOGOS = [
  { src: "/img-webp/lettuce.webp", alt: "Path — lettuce" },
  { src: "/img-webp/tomato.webp", alt: "Path — tomato" },
  { src: "/img-webp/cheese-logo.webp", alt: "Path — cheese" },
  { src: "/img-webp/meat.webp", alt: "Path — patty" },
];

const CARDS = [
  {
    src: "/img-webp/lettuceimg.webp",
    alt: "take away 1",
    country: "Freshly Greens",
    colorClass: "text-[#60A905]",
    description: "Grilled to perfection juicy, smoky, unforgettable.",
  },
  {
    src: "/img-webp/tomatoimg.webp",
    alt: "take away 2",
    country: "Juicy Tomatoes",
    colorClass: "text-red",
    description: "Sun-ripened tomatoes that bring natural sweetness and balance.",
  },
  {
    src: "/img-webp/cheeseimg.webp",
    alt: "take away 3",
    country: "Creamy Cheese",
    colorClass: "text-mustard",
    description: "Rich, creamy cheese that melts into every bite.",
  },
  {
    src: "/img-webp/tikki.webp",
    alt: "take away 4",
    country: "Perfect Patty",
    colorClass: "text-[#662C00]",
    description: "Grilled to perfection juicy, smoky, unforgettable.",
  },
  {
    src: "/img-webp/bun.webp",
    alt: "take away 5",
    country: "Artisan Bun",
    colorClass: "text-mustard-dark",
    description: "Soft, toasted buns crafted to hold everything together.",
  },
];

export default function StoryOfEveryBiteMobile() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Individual card pop-ins.
  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;
    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, scale: 0.8, rotate: 0, y: 50 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 70%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { opacity: 0, scale: 0.8, rotate: -15 + 30 * Math.random(), y: 50 },
              {
                opacity: 1,
                scale: 1.05,
                rotate: 3 - 6 * Math.random(),
                y: 0,
                duration: 0.45,
                ease: "back.out(2.2)",
                overwrite: "auto",
              }
            );
          },
          once: true,
        });
      });
    }, cardRefs);
    return () => ctx.revert();
  }, []);

  // Logos travel down the dashed line with scrubbed fade in/out per segment.
  useLayoutEffect(() => {
    const trigger = containerRef.current;
    const path = pathRef.current;
    const logos = logoRefs.current.filter(Boolean) as HTMLElement[];
    const count = PATH_LOGOS.length;
    if (!trigger || !path || logos.length !== count) return;

    const ctx = gsap.context(() => {
      const { scrollTrigger, motionPath, segmentDuration, logo } = PATH_FOLLOW;

      logos.forEach((el) =>
        gsap.set(el, { xPercent: logo.xPercent, yPercent: logo.yPercent, opacity: 0 })
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: scrollTrigger.start,
          end: scrollTrigger.end,
          scrub: scrollTrigger.scrub,
          markers: scrollTrigger.markers,
        },
      });

      for (let i = 0; i < count; i++) {
        const pos = i * segmentDuration;
        tl.fromTo(
          logos[i],
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: motionPath.alignOrigin,
              autoRotate: motionPath.autoRotate,
              start: i / count,
              end: i / count,
            },
          },
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: motionPath.alignOrigin,
              autoRotate: motionPath.autoRotate,
              start: i / count,
              end: (i + 1) / count,
            },
            duration: segmentDuration,
            ease: motionPath.ease,
          },
          pos
        );
        const fadeDuration = 0.2 * segmentDuration;
        tl.fromTo(
          logos[i],
          { opacity: 0 },
          { opacity: 1, duration: fadeDuration, ease: "power1.inOut" },
          pos
        );
        tl.to(
          logos[i],
          { opacity: 0, duration: fadeDuration, ease: "power1.inOut" },
          pos + segmentDuration - fadeDuration
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { logo } = PATH_FOLLOW;

  return (
    <section
      id="storyofEveryBiteMobile"
      className="h-fit hidden space-y-[5vw] max-md:block relative min-h-screen w-full bg-mustard overflow-hidden"
    >
      <JellyDivider fill="#f91814" />
      <div className="space-y-[2vw] mt-[30vw] relative z-10">
        <TextPop
          as="h2"
          className="text-white text-center w-full text-stroke-180-mustard heading300 uppercase leading-[.85]"
          split="words"
          scrollStart="top 86%"
        >
          A story in every bite.
        </TextPop>
        <p className="text40  text-center w-[60%] mx-auto text-black font-mouse-memoirs leading-[1.1]">
          <FadeIn delay={0.25}>
            From fresh farms to your hands every layer matters.
          </FadeIn>
        </p>
      </div>
      <div
        ref={containerRef}
        className="flex flex-col relative gap-[40vw] items-center mt-[25vw] pb-[10vw]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[83%] w-[2vw] flex items-center pointer-events-none z-0">
          <svg
            width="6"
            height="100%"
            viewBox="0 0 6 1000"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block" }}
          >
            <path
              ref={pathRef}
              d="M3 0 L3 1000"
              stroke="#F4A804"
              strokeOpacity="0.7"
              strokeWidth="4"
              strokeDasharray="10 14"
            />
          </svg>
        </div>
        {PATH_LOGOS.map(({ src, alt }, i) => (
          <div
            key={`path-follow-logo-${i}-${src}`}
            ref={(el) => {
              logoRefs.current[i] = el;
            }}
            className={`pointer-events-none absolute left-0 top-0 ${logo.widthClass} will-change-transform`}
            style={{ zIndex: logo.zIndex }}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              loading="lazy"
              width={1000}
              height={1000}
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
        ))}
        {CARDS.map(({ src, alt, country, colorClass, description }, i) => (
          <div
            key={src}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="flex flex-col ${idx % 2} items-center space-y-[3vw] w-fit relative z-10"
            style={{ cursor: "pointer", willChange: "transform" }}
          >
            <p
              className={`uppercase text-stroke-small text-[7vw] font-modak leading-snug country-label ${colorClass}`}
              style={{ willChange: "transform", cursor: "pointer" }}
            >
              {country}
            </p>
            <div className="w-[60vw] rounded-[5vw] overflow-hidden h-[45vw] mx-auto bg-white/70 shadow-lg">
              <img
                src={src}
                alt={alt}
                draggable={false}
                loading="lazy"
                width={900}
                height={450}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-[5vw] w-[70%] text-black uppercase font-mouse-memoirs leading-[1.1] text-center px-[6vw]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
