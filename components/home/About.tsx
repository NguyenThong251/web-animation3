"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import PopText from "./PopText";
import FadeText from "./FadeText";
import BlobButton from "./BlobButton";
import StickerPeel from "./StickerPeel";

gsap.registerPlugin(InertiaPlugin);

const MEDIA = [
  {
    src: "/img-webp/about-1.webp",
    rotate: 5,
    alt: "Chef preparing a fresh smashed burger",
  },
  {
    src: "/img-webp/about-2.webp",
    rotate: -5,
    alt: "Close-up of melted cheese on a burger patty",
  },
  {
    src: "/img-webp/about-3.webp",
    rotate: 8,
    alt: "CRAV restaurant atmosphere",
  },
];

const MD_ROTATIONS = ["md:rotate-[5deg]", "md:rotate-[-5deg]", "md:rotate-[8deg]"];
const MOBILE_STYLES = [
  "max-md:-rotate-12 max-md:translate-y-[3vw]",
  "max-md:-translate-y-[6vw] max-md:z-10",
  "max-md:rotate-12 max-md:translate-y-[3vw]",
];

function MediaGrid() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll<HTMLElement>(".media-item");
    const cleanups: Array<() => void> = [];

    items.forEach((item) => {
      let lastX = 0;
      let lastY = 0;
      let velX = 0;
      let velY = 0;
      const baseRotation =
        parseFloat(String(gsap.getProperty(item, "rotation"))) || 0;

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
        gsap.to(item, {
          inertia: {
            x: { velocity: velX * 30, end: 0 },
            y: { velocity: velY * 30, end: 0 },
            rotation: { velocity: velX * 2, end: baseRotation },
            resistance: 150,
          },
          force3D: true,
        });
      };

      item.addEventListener("mousemove", onMove);
      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        item.removeEventListener("mousemove", onMove);
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="relative grid h-fit w-full place-items-center px-[10vw] pb-[6vw] max-md:px-[4vw] max-md:pb-[12vw]"
    >
      <div className="absolute w-[15vw] max-md:w-[25vw] h-auto top-[-13vw] max-md:top-[-30vw] left-[5vw] max-md:-left-[4vw] z-50 drop-shadow-xl">
        <StickerPeel className="" imageSrc="/img/burgerselfie.png" width="100%" />
      </div>
      <div className="grid grid-cols-3 gap-[1vw] justify-center mx-auto max-w-[70vw]  max-md:flex max-md:flex-row max-md:flex-nowrap max-md:items-end max-md:justify-center max-md:gap-[2vw] max-md:w-full max-md:pt-[4vw] max-md:pb-[2vw]">
        {MEDIA.map((item, i) => (
          <div
            key={i}
            className={`
              h-[25vw] w-[20vw] rounded-[4%] overflow-hidden media-item max-md:origin-bottom
              max-md:w-[35vw] max-md:h-[38vw] max-md:shrink-0
              ${MD_ROTATIONS[i]} ${MOBILE_STYLES[i]}
            `}
            style={{ willChange: "transform", cursor: "pointer" }}
          >
            <img
              alt={item.alt}
              width={1000}
              height={1000}
              decoding="async"
              className="h-full w-full object-cover"
              style={{ color: "transparent" }}
              src={item.src}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="h-fit overflow-clip self relative z-100 text-center space-y-[2vw] w-full max-md:space-y-[6vw] py-[6vw]"
    >
      <div className="space-y-[1vw] relative max-md:space-y-[6vw]">
        <p className="text-red z-100 max-md:rotate-0 relative top-[-1vw] max-md:top-0 -rotate-5 text-stroke-180 w-full text-center mx-auto text-[2.8vw] font-modak leading-[.9]! max-md:text-[8vw] max-md:w-fit max-md:mx-auto">
          TOP CLASSIC
        </p>
        <PopText
          as="h2"
          className="text-stroke-180 max-md:w-full w-[70%] text-center mx-auto leading-[.75]! text-red heading300 uppercase "
          split="words"
          scrollStart="top 86%"
        >
          juicy cheesy fully Loaded
        </PopText>
        <p className="text-black text40 w-[45%] mt-[2vw] leading-[1.1] mx-auto max-md:w-[90%] ">
          <FadeText delay={0.25}>
            CRAV is back and bolder than ever. Honoring our rich roots, we
            bring you the ultimate smashed experience fully loaded, hot, and
            crafted fresh.
          </FadeText>
        </p>
      </div>
      <div className="mx-auto mt-[2vw] mb-[4vw] w-full max-md:mt-[6vw] max-md:mb-[8vw]">
        <BlobButton />
      </div>
      <MediaGrid />
    </section>
  );
}
