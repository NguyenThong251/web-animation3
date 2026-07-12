"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import JellyDivider from "./JellyDivider";
import TextPop from "./TextPop";
import FadeIn from "./FadeIn";
import "./spices.css";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, InertiaPlugin);

/**
 * Desktop "A story in every bite." section (1:1 rebuild of module 71555 in
 * the original client bundle).
 *
 * - 4 ingredient logos travel along the dashed SVG path, driven by a
 *   ScrollTrigger (start "-5% top"-like config below, one segment per logo).
 * - 5 ingredient cards pop in at scroll-progress thresholds [0,.25,.5,.75,1]
 *   with back.out(2.2).
 * - Cards and country labels get an inertia "magnet" fling on mouse leave.
 */
const PATH_FOLLOW = {
  oneWay: false,
  scrollTrigger: { start: "5% top", end: "95%", scrub: false, markers: false },
  motionPath: {
    alignOrigin: [0.5, 0.5] as [number, number],
    autoRotate: true,
    ease: "none",
  },
  segmentDuration: 1,
  logo: { xPercent: -50, yPercent: -50, widthClass: "w-[15vw]", zIndex: 2 },
  thresholds: undefined as number[] | undefined,
};

const CARD_REVEAL = {
  oneWay: true,
  scrollTrigger: { start: "5% top", end: "95%", scrub: false, markers: false },
  thresholds: [0, 0.25, 0.5, 0.75, 1],
  animation: {
    in: { duration: 0.45, ease: "back.out(2.2)" },
    out: { duration: 0.28, ease: "back.in(1.2)" },
  },
};

const CARD_MAGNET = { velocityScale: 30, rotationScale: 2, resistance: 140 };
const LABEL_MAGNET = { velocityScale: 25, rotationScale: 1.5, resistance: 170 };

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
    containerClass:
      "absolute right-[15vw] space-y-[1.5vw] z-200 top-[45vw] items-end flex flex-col",
    noteClass:
      " rotate-7 text-right uppercase text-stroke-small text40 font-modak leading-[.9]! text-[#60A905] country-label",
    description: "Grilled to perfection juicy, smoky, unforgettable.",
    descriptionClass:
      "text40 w-[25vw] text-black uppercase font-mouse-memoirs leading-[1.1]",
  },
  {
    src: "/img-webp/tomatoimg.webp",
    alt: "take away 2",
    country: "Juicy Tomatoes",
    containerClass:
      "absolute left-[8vw] space-y-[1.5vw] z-200 top-[85vw] items-start flex flex-col",
    noteClass:
      "text-red -rotate-7 text-left uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
    description: "Sun-ripened tomatoes that bring natural sweetness and balance.",
    descriptionClass:
      "text40 w-[25vw] text-black uppercase font-mouse-memoirs leading-[1.1]",
  },
  {
    src: "/img-webp/cheeseimg.webp",
    alt: "take away 3",
    country: "Creamy Cheese",
    containerClass:
      "absolute right-[8vw] space-y-[1.5vw] z-200 top-[115vw] items-end flex flex-col",
    noteClass:
      "text-mustard rotate-12 text-right uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
    description: "Rich, creamy cheese that melts into every bite.",
    descriptionClass:
      "text40 w-[25vw] text-black uppercase font-mouse-memoirs leading-[1.1]",
  },
  {
    src: "/img-webp/tikki.webp",
    alt: "take away 4",
    country: "Perfect Patty",
    containerClass:
      "absolute left-[8vw] space-y-[1.5vw] z-200 top-[135vw] items-start flex flex-col",
    noteClass:
      "text-[#662C00] -rotate-12 text-left uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
    description: "Grilled to perfection juicy, smoky, unforgettable.",
    descriptionClass:
      "text40 w-[25vw] text-black uppercase font-mouse-memoirs leading-[1.1]",
  },
  {
    src: "/img-webp/bun.webp",
    alt: "take away 5",
    country: "Artisan Bun",
    containerClass:
      "absolute right-[8vw] space-y-[1.5vw] z-200 top-[160vw] items-start flex flex-col",
    noteClass:
      "text-mustard-dark rotate-6 text-right uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
    description: "Soft, toasted buns crafted to hold everything together.",
    descriptionClass:
      "text40 w-[25vw] text-black uppercase font-mouse-memoirs leading-[1.1]",
  },
];

/** Inertia "magnet" fling on hover-leave (original helper `v`). */
function useMagnet(
  refs: React.MutableRefObject<(HTMLElement | null)[]>,
  config: { velocityScale: number; rotationScale: number; resistance: number }
) {
  useEffect(() => {
    const cleanups = refs.current.filter(Boolean).map((el) => {
      const element = el as HTMLElement;
      let lastX = 0;
      let lastY = 0;
      let velX = 0;
      let velY = 0;
      const baseRotation =
        Number.parseFloat(String(gsap.getProperty(element, "rotation"))) || 0;
      const onMouseMove = (e: MouseEvent) => {
        velX = e.clientX - lastX;
        velY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onMouseEnter = (e: MouseEvent) => {
        velX = 0;
        velY = 0;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const onMouseLeave = () => {
        gsap.to(element, {
          inertia: {
            x: { velocity: velX * config.velocityScale, end: 0 },
            y: { velocity: velY * config.velocityScale, end: 0 },
            rotation: {
              velocity: velX * config.rotationScale,
              end: baseRotation,
            },
            resistance: config.resistance,
          },
        });
      };
      element.addEventListener("mousemove", onMouseMove);
      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);
      return () => {
        element.removeEventListener("mousemove", onMouseMove);
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, [config, refs]);
}

export default function StoryOfEveryBite() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);

  useMagnet(cardRefs, CARD_MAGNET);
  useMagnet(labelRefs, LABEL_MAGNET);

  // Threshold-based card pop-ins.
  useLayoutEffect(() => {
    const trigger = containerRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!trigger || cards.length === 0) return;

    const ctx = gsap.context(() => {
      const { scrollTrigger, thresholds, animation } = CARD_REVEAL;
      cards.forEach((card) => gsap.set(card, { opacity: 0, scale: 0.8, rotate: 0 }));
      const shown = Array(cards.length).fill(false);
      let maxProgress = 0;
      ScrollTrigger.create({
        trigger,
        start: scrollTrigger.start,
        end: scrollTrigger.end,
        markers: scrollTrigger.markers,
        onUpdate: (self) => {
          maxProgress = Math.max(maxProgress, self.progress);
          thresholds.forEach((threshold, i) => {
            const card = cards[i];
            if (card && maxProgress >= threshold && !shown[i]) {
              gsap.fromTo(
                card,
                { opacity: 0, scale: 0.8, rotate: -15 + 30 * Math.random() },
                {
                  opacity: 1,
                  scale: 1.08,
                  rotate: 5 - 10 * Math.random(),
                  duration: animation.in.duration,
                  ease: animation.in.ease,
                  overwrite: "auto",
                }
              );
              shown[i] = true;
            }
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Ingredients follow the dashed motion path with scroll.
  useLayoutEffect(() => {
    const trigger = containerRef.current;
    const path = pathRef.current;
    const logos = logoRefs.current.filter(Boolean) as HTMLElement[];
    const count = PATH_LOGOS.length;
    if (!trigger || !path || logos.length !== count) return;

    const ctx = gsap.context(() => {
      const {
        oneWay = true,
        scrollTrigger,
        motionPath,
        segmentDuration,
        logo,
        thresholds,
      } = PATH_FOLLOW;
      const points =
        thresholds?.length === count + 1
          ? thresholds
          : Array.from({ length: count + 1 }, (_, i) => i / count);
      const totalDuration = count * segmentDuration;

      logos.forEach((el) =>
        gsap.set(el, { xPercent: logo.xPercent, yPercent: logo.yPercent })
      );

      const tl = gsap.timeline({ paused: true, defaults: { ease: motionPath.ease } });
      for (let i = 0; i < count; i++) {
        const segStart = i / count;
        const segEnd = (i + 1) / count;
        const posStart = points[i] * totalDuration;
        const segLength = Math.max((points[i + 1] - points[i]) * totalDuration, 1e-6);
        tl.to(
          logos[i],
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: motionPath.alignOrigin,
              autoRotate: motionPath.autoRotate,
              start: segStart,
              end: segEnd,
            },
            duration: segLength,
            ease: motionPath.ease,
          },
          posStart
        );
      }

      let maxProgress = 0;
      ScrollTrigger.create({
        trigger,
        start: scrollTrigger.start,
        end: scrollTrigger.end,
        markers: scrollTrigger.markers,
        onUpdate: (self) => {
          const progress = self.progress;
          if (oneWay) {
            maxProgress = Math.max(maxProgress, progress);
            tl.progress(maxProgress);
          } else {
            tl.progress(progress);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const { logo } = PATH_FOLLOW;

  return (
    <section
      id="storyofEveryBite"
      className="max-md:hidden h-[195vw] -mt-[5vw] w-full relative bg-mustard"
    >
      <JellyDivider fill="#f91814" />
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
      <div ref={containerRef} className="relative self h-[153vw] w-full">
        <div className="absolute top-[40vw] left-1/2 -translate-x-1/2 h-full w-[70vw]">
          <svg
            ref={svgRef}
            className="h-full w-full object-contain"
            width="1021"
            height="1750"
            viewBox="0 0 1021 1750"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={pathRef}
              d="M869.51 4.98096C869.51 4.98096 92.2848 72.8008 46.5095 431.981C-6.4157 847.264 1011.9 471.855 1015.51 890.481C1019.21 1319.64 1.40592 893.322 5.00955 1322.48C8.60041 1750.12 1015.51 1744.48 1015.51 1744.48"
              stroke="#F4A804"
              strokeOpacity="0.5"
              strokeWidth="10"
              strokeDasharray="36 36"
            />
          </svg>
        </div>
        <div className="space-y-[2vw] mt-[20vw] relative z-10">
          <TextPop
            as="h2"
            className="text-white w-[70vw] text-stroke-180-mustard heading300 uppercase leading-[.85]"
            split="words"
            scrollStart="top 86%"
          >
            A story in every bite.
          </TextPop>
          <FadeIn delay={0.25}>
            <p className="text40 w-[25vw] uppercase ml-[1vw] text-black font-mouse-memoirs leading-[1.1]">
              From fresh farms to your hands every layer matters.
            </p>
          </FadeIn>
        </div>
        {CARDS.map(
          (
            { src, alt, country, containerClass, noteClass, description, descriptionClass },
            i
          ) => (
            <div
              key={src}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={containerClass}
              style={{ cursor: "pointer", willChange: "transform" }}
            >
              <p
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className={noteClass}
                style={{ willChange: "transform", cursor: "pointer" }}
              >
                {country}
              </p>
              <div className="w-[25vw] rounded-[1vw] overflow-hidden h-[17vw]">
                <img
                  src={src}
                  alt={alt}
                  draggable={false}
                  loading="lazy"
                  width={1000}
                  height={1000}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className={descriptionClass}>{description}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
