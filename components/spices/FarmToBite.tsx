"use client";

import React from "react";
import TextPop from "./TextPop";
import FadeIn from "./FadeIn";
import StickerPeel from "./StickerPeel";
import OrderNowButton from "./OrderNowButton";
import "./spices.css";

/**
 * "From farm to bite" red section with peeling fries/burger stickers.
 */
export default function FarmToBite() {
  return (
    <section
      id="farmToBite"
      className="h-fit overflow-x-hidden -mt-[5vw] max-md:mt-0 z-200 self max-md:space-y-[6vw] w-full relative bg-red"
    >
      <TextPop
        as="h2"
        className="heading300 uppercase max-md:text-center max-md:w-full max-md:text-[14vw] w-[50vw] leading-[.85] text-beige relative z-20"
        split="words"
        scrollStart="top 86%"
      >
        from farm to bite
      </TextPop>
      <StickerPeel
        className="w-[25vw] max-md:w-[35vw] max-md:top-[65vw] max-md:left-0 h-auto absolute top-[30vw] left-[5vw] z-50"
        imageSrc="/img-webp/fries.webp"
        width="100%"
      />
      <StickerPeel
        className="w-[22vw] max-md:w-[45vw] h-auto absolute top-[15vw] max-md:right-0 max-md:top-[95vw] right-[5vw] z-50"
        imageSrc="/img-webp/burger.webp"
        width="100%"
      />
      <div className="flex max-md:w-full max-md:flex-col max-md:items-center max-md:justify-center items-end gap-[2vw] max-md:gap-[6vw] justify-end">
        <div className="h-[70vh] -mt-[8vw] max-md:mt-[3vw] max-md:h-auto max-md:w-full max-md:rounded-[5vw] w-[30vw] rounded-[1vw] overflow-hidden">
          <img
            src="/img-webp/farmtobite.webp"
            alt="farm to bite"
            loading="lazy"
            width={1000}
            height={1000}
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-[2vw] max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-[6vw] pb-[2vw]">
          <p className="text40 w-[25vw] max-md:text-center uppercase  max-md:w-full ml-[1vw] text-white font-mouse-memoirs leading-[1.1]">
            <FadeIn delay={0.25}>
              We didn&apos;t just pick ingredients off a list. We thought about
              where they come from, why they matter, and what they bring to the
              burger.
            </FadeIn>
          </p>
          <OrderNowButton />
        </div>
      </div>
    </section>
  );
}
