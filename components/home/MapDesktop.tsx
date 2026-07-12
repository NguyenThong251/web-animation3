"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Jelly from "./Jelly";
import FadeText from "./FadeText";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, InertiaPlugin);

const CITIES = [
  {
    src: "/img-webp/berlin.webp",
    alt: "CRAV Burger takeaway packaging in Berlin",
    country: "BERLIN",
    containerClass:
      "absolute right-[5vw] space-y-[1.5vw] z-200 top-[50vw] items-end flex flex-col",
    noteClass:
      "text-red rotate-7 text-right uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
  },
  {
    src: "/img-webp/london.webp",
    alt: "CRAV Burger takeaway packaging in London",
    country: "LONDON",
    containerClass:
      "absolute left-[35vw] space-y-[1.5vw] z-200 top-[64vw] items-start flex flex-col",
    noteClass:
      "text-red -rotate-7 text-left uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
  },
  {
    src: "/img-webp/newyork.webp",
    alt: "CRAV Burger takeaway packaging in New York",
    country: "NEW YORK",
    containerClass:
      "absolute right-[20vw] space-y-[1.5vw] z-200 top-[80vw] items-end flex flex-col",
    noteClass:
      "text-red rotate-12 text-right uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
  },
  {
    src: "/img-webp/sydney.webp",
    alt: "CRAV Burger takeaway packaging in Sydney",
    country: "SYDNEY",
    containerClass:
      "absolute left-[15vw] space-y-[1.5vw] z-200 top-[105vw] items-start flex flex-col",
    noteClass:
      "text-red -rotate-12 text-left uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
  },
  {
    src: "/img-webp/tokyo.webp",
    alt: "CRAV Burger takeaway packaging in Tokyo",
    country: "TOKYO",
    containerClass:
      "absolute right-[14vw] space-y-[1.5vw] z-200 top-[130vw] items-end flex flex-col",
    noteClass:
      "text-red rotate-6 text-right uppercase text-stroke-small text40 font-modak leading-[.9]! country-label",
  },
];

function attachInertiaHover(
  el: HTMLElement,
  velocityScale: number,
  rotationScale: number,
  resistance: number
) {
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  const baseRotation =
    parseFloat(String(gsap.getProperty(el, "rotation"))) || 0;

  const onMove = (e: MouseEvent) => {
    velX = e.clientX - lastX;
    velY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onEnter = (e: MouseEvent) => {
    velX = 0;
    velY = 0;
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onLeave = () => {
    gsap.to(el, {
      inertia: {
        x: { velocity: velX * velocityScale, end: 0 },
        y: { velocity: velY * velocityScale, end: 0 },
        rotation: { velocity: velX * rotationScale, end: baseRotation },
        resistance,
      },
      force3D: true,
    });
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
  };
}

export default function MapDesktop() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    cardRefs.current.forEach((card) => {
      if (!card) return;
      cleanups.push(attachInertiaHover(card, 30, 2, 140));
    });
    labelRefs.current.forEach((label) => {
      if (!label) return;
      cleanups.push(attachInertiaHover(label, 25, 1.5, 170));
    });
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const plane = planeRef.current;
    const path = pathRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const triggerVars = {
        trigger: track,
        start: "-10% top",
        end: "75%",
        scrub: 1,
        invalidateOnRefresh: true,
      };
      const thresholds = [0.14, 0.28, 0.5, 0.68, 0.91];

      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 0, scale: 0.8, rotate: 0 });
      });

      const shown = Array(cardRefs.current.length).fill(false);
      ScrollTrigger.create({
        ...triggerVars,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          thresholds.forEach((threshold, i) => {
            const card = cardRefs.current[i];
            if (!card) return;
            if (progress >= threshold && !shown[i]) {
              gsap.fromTo(
                card,
                {
                  opacity: 0,
                  scale: 0.8,
                  rotate: -15 + 30 * Math.random(),
                },
                {
                  opacity: 1,
                  scale: 1.08,
                  rotate: 5 - 10 * Math.random(),
                  duration: 0.45,
                  ease: "back.out(2.2)",
                  overwrite: "auto",
                  force3D: true,
                }
              );
              shown[i] = true;
            } else if (progress < threshold && shown[i]) {
              gsap.to(card, {
                opacity: 0,
                scale: 0.8,
                rotate: -15 + 30 * Math.random(),
                duration: 0.28,
                ease: "back.in(1.2)",
                overwrite: "auto",
                force3D: true,
              });
              shown[i] = false;
            }
          });
        },
      });

      if (plane && path) {
        gsap.set(plane, { xPercent: -50, yPercent: -50 });
        gsap.to(plane, {
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: -90,
          },
          ease: "none",
          force3D: true,
          scrollTrigger: { ...triggerVars },
        });
      }

      const timeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad, { once: true });
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("load", onLoad);
      };
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="map-desktop"
      className="h-fit max-md:hidden overflow-hidden w-full bg-mustard relative"
    >
      <Jelly fill="#F5E3CD" />
      <div
        ref={planeRef}
        className="pointer-events-none absolute left-0 top-0 w-[15vw]"
        style={{
          zIndex: 2,
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translate3d(0,0,0)",
        }}
      >
        <img
          alt="Plane"
          draggable={false}
          width={1000}
          height={1000}
          decoding="async"
          className="h-full w-full object-contain"
          style={{ color: "transparent" }}
          src="/img/plane.png"
        />
      </div>
      <div ref={trackRef} className="relative self h-[163vw] w-full">
        <div className="absolute top-0 left-0 h-full w-full">
          <svg
            ref={svgRef}
            className="h-full w-full object-cover"
            width="1728"
            height="2176"
            viewBox="0 0 1728 2176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              ref={pathRef}
              d="M500 -139C557 -139 1550.43 364.378 1610.6 653.93C1745.6 1303.59 -160.566 551.165 -11.7069 1197.36C117.259 1757.21 1470.1 925.826 1474.12 1502.33C1478.15 2080.14 63.7084 1375.34 -11.707 1896.78C-107.419 2558.55 1928.5 2042.5 1928.5 2042.5"
              stroke="#F4A804"
              strokeOpacity="0.5"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="42 42"
            />
          </svg>
        </div>
        <div className="space-y-[2vw] mt-[20vw] relative z-10">
          <p className="text-mustard-dark -rotate-7 ml-[1vw] -translate-y-[6vw]  uppercase text-stroke-180 text-[2.8vw] font-modak leading-[.9]!">
            take away
          </p>
          <h2 className="text-white text-stroke-180-mustard heading300 w-[80vw] leading-[.85]">
            QUALITY THAT TRAVELS WITH YOU
          </h2>
          <FadeText delay={0.25}>
            <p className="text40 w-[30vw] ml-[1vw] text-black font-mouse-memoirs leading-[1.1]">
              Freshly packed smash burgers, ready to go wherever you crave.
              From our flat-top to any corner of the globe, we ensure every
              layer stays hot and juicy.
            </p>
          </FadeText>
        </div>
        {CITIES.map(({ src, alt, country, containerClass, noteClass }, i) => (
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
              {"˝"}
            </p>
            <div className="w-[14vw] rounded-[1vw] overflow-hidden h-[17vw]">
              <img
                alt={alt}
                draggable={false}
                width={1000}
                height={1000}
                decoding="async"
                className="h-full w-full object-cover"
                style={{ color: "transparent" }}
                src={src}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
