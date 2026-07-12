"use client";

import React from "react";
import JellyDivider from "./JellyDivider";
import TextPop from "./TextPop";
import FadeIn from "./FadeIn";
import "./spices.css";

/**
 * /spices hero — full-bleed spices background, popped headline and intro copy.
 */
export default function SpicesHero() {
  return (
    <div className="h-[57vw] flex-col max-md:h-[80vh] flex items-center self justify-end w-full relative">
      <div className="absolute brightness-80 inset-0 w-full h-full z-0">
        <img
          src="/img-webp/spices.webp"
          alt="Spices Background"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>
      <JellyDivider flip fill="#f91814" />
      <TextPop
        as="p"
        delay={0}
        className="text-mustard-dark z-100 max-md:rotate-0 max-md:mb-[4vw] mb-[2vw] rotate-5 text-stroke-180 w-full text-center mx-auto text60 font-modak leading-[.9]! uppercase"
      >
        {"what’s Inside"}
      </TextPop>
      <TextPop
        as="h2"
        delay={0.15}
        className="text-stroke-180  max-md:w-full w-[70%] text-center mx-auto max-md:leading-[.85]! leading-[.85]! text-red heading300 uppercase "
        split="words"
        scrollStart="top 86%"
      >
        simple things done right
      </TextPop>
      <p className="text-white uppercase max-md:relative max-md:pb-[15vw] max-md:mt-[4vw] z-10 max-md:w-[90%] pt-[1vw] pb-[5vw] text-center text40 w-[45%] leading-[1.1] mx-auto  ">
        <FadeIn delay={0.2}>
          We don&apos;t have a long list of ingredients. We have a short one — and
          we&apos;re obsessive about every single item on it.
        </FadeIn>
      </p>
    </div>
  );
}
