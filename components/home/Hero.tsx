"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PopText from "./PopText";
import FadeText from "./FadeText";
import { usePageReady } from "./usePageReady";

export default function Hero() {
  const isPageReady = usePageReady();
  const burgerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (isPageReady && !ctxRef.current && burgerRef.current) {
      ctxRef.current = gsap.context(() => {
        gsap.fromTo(
          burgerRef.current,
          { scale: 0.5, opacity: 0, y: 100, rotate: -5 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 1.5,
            ease: "back.out(1.5)",
            delay: 0.5,
          }
        );
        gsap.to(burgerRef.current, {
          y: "-=15",
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.7,
        });
      });
    }
  }, [isPageReady]);

  useEffect(
    () => () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    },
    []
  );

  return (
    <section
      data-nav-dark="false"
      id="hero"
      className="h-screen w-full relative flex flex-col justify-between items-center pt-[8vw] max-md:pt-[40vw]  max-md:h-[200vw] max-md:pb-[2vw]"
    >
      <div className="w-fit h-fit relative">
        <PopText
          as="h1"
          className="text-[30vw] leading-[.8] text-center text-red text-stroke-180 font-mouse-memoirs max-md:text-[26vw] max-md:leading-[.85]"
          split="words"
          scrollStart="top 92%"
        >
          THE BURGER
        </PopText>
        <PopText
          as="p"
          className="absolute top-[10%] left-[10%] text-mustard-dark z-10 rotate-15 max-md:rotate-0 max-md:top-[2%] max-md:left-[2%] text-stroke-180 text-center text-[2.8vw] font-modak leading-[.9]! max-md:text-[6vw]"
          delay={0.15}
        >
          {"SMASHED\nFRESH"}
        </PopText>
        <PopText
          as="p"
          className="absolute bottom-[10%] right-[10%] text-mustard-dark z-10 -rotate-15 max-md:rotate-0 max-md:bottom-[2%] max-md:right-[2%] text-stroke-180 text-center text-[2.8vw] font-modak leading-[.9]! max-md:text-[6vw]"
          delay={0.15}
        >
          {"BOLD\nFLAVOR"}
        </PopText>
      </div>
      <div className="size-[40vw] z-20 absolute top-[60%] -translate-y-[60%] left-1/2 -translate-x-1/2 max-md:size-[80vw] max-md:top-[110vw] max-md:-translate-y-[50%]">
        <div ref={burgerRef} className="w-full h-full opacity-0">
          <img
            alt="CRAV Artisan Smashed Burger with fresh ingredients"
            width={1000}
            height={1000}
            decoding="async"
            className="h-full w-full object-contain"
            style={{ color: "transparent" }}
            src="/img-webp/burgerH.webp"
          />
        </div>
      </div>
      <PopText
        as="p"
        className="text-center text-[15vw] max-md:text-[20vw] font-modak uppercase mt-[15vw] relative z-20 max-md:z-20 text-stroke-180 text-[#F4A804] translate-y-[-9vw] max-md:mt-[6vw] max-md:absolute max-md:top-[133vw] max-md:-translate-y-1/2"
        delay={0.8}
      >
        CRAV
      </PopText>
      <div className="w-full absolute bottom-0 left-0 flex justify-between px-[2.5vw] py-[2vw] max-md:static max-md:flex-col max-md:gap-[4vw] max-md:items-center max-md:px-[5vw] max-md:py-0">
        <div className="w-[23vw] max-md:w-full">
          <p className="text40 leading-none max-md:text-center">
            <FadeText delay={0.25}>
              Smashed hot on the flat top, our prime patties lock in ultimate
              juiciness under a caramelized crust.
            </FadeText>
          </p>
        </div>
        <div className="w-[23vw] max-md:w-full ">
          <p className="text40 leading-none text-right max-md:text-center">
            <FadeText delay={0.25}>
              Topped with melted cheddar and our signature chili honey glaze
              crafted to satisfy your cravings since 1997.
            </FadeText>
          </p>
        </div>
      </div>
    </section>
  );
}
