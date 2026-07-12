import React from "react";
import JellyCurve from "./JellyCurve";
import StickerPeel from "./StickerPeel";
import TextPop from "./TextPop";
import TextReveal from "./TextReveal";
import BlobButton from "./BlobButton";
import "./contact.css";

/**
 * "FEEL IT / feel the Change" CTA section that follows the contact hero.
 * Structure and props copied 1:1 from the original page RSC payload
 * (section#cta in _reference/_source_contact.html).
 */
export default function CtaSection() {
  return (
    <section
      id="cta"
      className="h-fit w-full pt-[18vw] max-md:pt-[12vw] overflow-clip relative bg-beige"
    >
      <JellyCurve fill="#f91814" />
      <div className="h-screen my-[8vw] mt-0 flex items-center justify-center w-full relative max-md:my-[2vw] max-md:mt-0 max-md:h-fit max-md:flex-col max-md:gap-0 max-md:px-[2vw]">
        <StickerPeel
          triggers={["-0% 50%", "50% 50%"]}
          className="absolute z-222 bottom-[1vw] max-md:bottom-[65vw] max-md:left-[2vw] max-md:translate-x-0! -rotate-45 left-1/2  -translate-x-1/2 w-[35vw] h-auto  max-md:w-[70vw] object-contain max-md:mb-[4vw]"
          imageSrc="/img/burger-boy.png"
          alt="Happy customer enjoying a CRAV artisan burger"
          width="35vw"
        />
        <div className="w-[60vw] flex items-start gap-[2vw] justify-center flex-col self h-full max-md:w-full max-md:gap-[4vw] max-md:items-center max-md:h-fit">
          <p className="text-red -rotate-7 ml-[.5vw] uppercase text-stroke-180 font-modak leading-[.9]! text60 max-md:rotate-0 max-md:ml-0 max-md:translate-y-0 max-md:text-center">
            FEEL IT
          </p>
          <TextPop
            as="h2"
            className="text-red text-stroke-180 heading300 uppercase leading-[.75] max-md:leading-[.85]! max-md:text-[10vw] max-md:text-center"
            split="words"
            scrollStart="top 88%"
          >
            {"feel the\nChange"}
          </TextPop>
          <TextReveal delay={0.25}>
            <p className="text40 w-[30vw]   font-mouse-memoirs leading-[1.1] max-md:w-full max-md:text-[4vw] max-md:text-center">
              Smashed for the bold, built for the hungry. Dive into a legendary craft
              experience where every crispy edge and juicy layer rules.
            </p>
          </TextReveal>
          <div className="max-md:w-full max-md:flex max-md:justify-center">
            <BlobButton />
          </div>
        </div>
        <div className="w-[45vw] rounded-[2vw] overflow-hidden h-[60vw] max-md:w-full max-md:h-[40vh] max-md:min-h-[40vw] max-md:rounded-[4vw]">
          <img
            alt="Premium smashed burger on a wooden board"
            loading="lazy"
            width={1000}
            height={1000}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ color: "transparent" }}
            src="/img-webp/cta.webp"
          />
        </div>
      </div>
    </section>
  );
}
