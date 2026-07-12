"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Jelly from "./Jelly";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const CONFIG = {
  scrollTrigger: {
    start: "-2% center",
    end: "95% center",
    scrub: 1,
    markers: false,
  },
  motionPath: { alignOrigin: [0.5, 0.5] as [number, number], autoRotate: true, ease: "none" },
  segmentDuration: 1,
  logo: { xPercent: -50, yPercent: -50, widthClass: "w-[25vw]", zIndex: 2 },
};

const LOGOS = [
  { src: "/img/plane.png", alt: "Path — lettuce" },
  { src: "/img/plane.png", alt: "Path — tomato" },
  { src: "/img/plane.png", alt: "Path — cheese" },
  { src: "/img/plane.png", alt: "Path — patty" },
];

const STOPS = [
  {
    src: "/img-webp/berlin.webp",
    alt: "take away 1",
    country: "BERLIN",
    note: "Grilled to perfection juicy, smoky, unforgettable.",
  },
  {
    src: "/img-webp/london.webp",
    alt: "take away 2",
    country: "LONDON",
    note: "Sun-ripened tomatoes that bring natural sweetness and balance.",
  },
  {
    src: "/img-webp/newyork.webp",
    alt: "take away 3",
    country: "NEW YORK",
    note: "Rich, creamy cheese that melts into every bite.",
  },
  {
    src: "/img-webp/sydney.webp",
    alt: "take away 4",
    country: "SYDNEY",
    note: "Grilled to perfection juicy, smoky, unforgettable.",
  },
  {
    src: "/img-webp/tokyo.webp",
    alt: "take away 5",
    country: "TOKYO",
    note: "Soft, toasted buns crafted to hold everything together.",
  },
];

export default function MapMobile() {
  const stopRefs = useRef<Array<HTMLDivElement | null>>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const logoRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const stops = stopRefs.current.filter(Boolean) as HTMLDivElement[];
    if (stops.length === 0) return;
    const ctx = gsap.context(() => {
      stops.forEach((stop) => {
        gsap.set(stop, { opacity: 0, scale: 0.8, rotate: 0, y: 50 });
        ScrollTrigger.create({
          trigger: stop,
          start: "top 70%",
          onEnter: () => {
            gsap.fromTo(
              stop,
              {
                opacity: 0,
                scale: 0.8,
                rotate: -15 + 30 * Math.random(),
                y: 50,
              },
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
    }, stopRefs);
    return () => ctx.revert();
  }, []);

  const count = LOGOS.length;

  useLayoutEffect(() => {
    const track = trackRef.current;
    const path = pathRef.current;
    const logos = logoRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!track || !path || logos.length !== count) return;

    const ctx = gsap.context(() => {
      const {
        scrollTrigger: st,
        motionPath: mp,
        segmentDuration,
        logo,
      } = CONFIG;

      logos.forEach((el) => {
        gsap.set(el, {
          xPercent: logo.xPercent,
          yPercent: logo.yPercent,
          opacity: 0,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: st.start,
          end: st.end,
          scrub: st.scrub,
          markers: st.markers,
        },
      });

      for (let i = 0; i < count; i++) {
        const position = i * segmentDuration;
        tl.fromTo(
          logos[i],
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: mp.alignOrigin,
              autoRotate: mp.autoRotate,
              start: i / count,
              end: i / count,
            },
          },
          {
            motionPath: {
              path,
              align: path,
              alignOrigin: mp.alignOrigin,
              autoRotate: mp.autoRotate,
              start: i / count,
              end: (i + 1) / count,
            },
            duration: segmentDuration,
            ease: mp.ease,
          },
          position
        );
        const fade = 0.2 * segmentDuration;
        tl.fromTo(
          logos[i],
          { opacity: 0 },
          { opacity: 1, duration: fade, ease: "power1.inOut" },
          position
        );
        tl.to(
          logos[i],
          { opacity: 0, duration: fade, ease: "power1.inOut" },
          position + segmentDuration - fade
        );
      }
    }, trackRef);
    return () => ctx.revert();
  }, [count]);

  const { logo } = CONFIG;

  return (
    <section
      id="map-mobile"
      className="h-fit hidden space-y-[5vw] max-md:block relative min-h-screen w-full bg-mustard overflow-hidden"
    >
      <Jelly fill="#F5E3CD" />
      <div className="space-y-[4vw] mt-[30vw] relative z-10">
        <h2 className="text-white text-center w-full text-stroke-180-mustard heading300 uppercase leading-[.85]">
          A story in every bite.
        </h2>
        <p className="text40 mx-auto text-center w-[65%] text-black font-mouse-memoirs leading-[1.1]">
          From fresh farms to your hands every layer matters.
        </p>
      </div>
      <div
        ref={trackRef}
        className="flex flex-col relative gap-[50vw] items-center mt-[25vw] pb-[10vw]"
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
        {LOGOS.map(({ src, alt }, i) => (
          <div
            key={`path-follow-logo-${i}-${src}`}
            ref={(el) => {
              logoRefs.current[i] = el;
            }}
            className={`pointer-events-none absolute left-0 top-0 ${logo.widthClass} will-change-transform`}
            style={{ zIndex: logo.zIndex }}
          >
            <img
              alt={alt}
              draggable={false}
              loading="lazy"
              width={1000}
              height={1000}
              decoding="async"
              className="h-full w-full object-contain -rotate-90"
              style={{ color: "transparent" }}
              src={src}
            />
          </div>
        ))}
        {STOPS.map(({ src, alt, country, note }, i) => (
          <div
            key={src}
            ref={(el) => {
              stopRefs.current[i] = el;
            }}
            className="flex flex-col items-center space-y-[3vw] w-fit relative z-10"
            style={{ cursor: "pointer", willChange: "transform" }}
          >
            <p
              className="uppercase text-stroke-small text-[7vw] font-modak leading-snug country-label"
              style={{ willChange: "transform", cursor: "pointer" }}
            >
              {country}
            </p>
            <div className="w-[60vw] rounded-[5vw] overflow-hidden h-auto mx-auto bg-white/70 shadow-lg">
              <img
                alt={alt}
                draggable={false}
                loading="lazy"
                width={900}
                height={450}
                decoding="async"
                className="h-full w-full object-cover"
                style={{ color: "transparent" }}
                src={src}
              />
            </div>
            <p className="text-[5vw] w-[70%] text-black uppercase font-mouse-memoirs leading-[1.1] text-center px-[6vw]">
              {note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
