import React from "react";
import StickerPeel from "./StickerPeel";
import TextPop from "./TextPop";
import ContactForm from "./ContactForm";
import "./contact.css";

/**
 * "/contact" hero: SAY HELLO / GOT A CRAVING? LET'S TALK + form.
 * 1:1 port of the original section (module 88720, section#contact-form).
 */
export default function ContactSection() {
  return (
    <section
      id="contact-form"
      data-nav-dark={true}
      className="h-screen max-md:h-fit z-999 bg-red w-full flex items-center justify-center relative overflow-hidden self"
    >
      <StickerPeel
        className="w-[20vw] max-md:w-[25vw] max-md:hidden h-auto absolute top-[8vw] max-md:top-[30vw] left-[5vw] max-md:-left-[4vw] z-50"
        imageSrc="/img-webp/fries.webp"
        width="100%"
      />
      <StickerPeel
        className="w-[25vw] max-md:w-[35vw] max-md:hidden h-auto absolute top-[20vw] max-md:top-[35vw] right-[2vw] max-md:-right-[6vw] z-50"
        imageSrc="/img-webp/burger.webp"
        width="100%"
      />
      <div className="relative z-10 flex max-md:mt-[10vw] items-center flex-col justify-between gap-[2vw] max-md:gap-[8vw] w-full max-md:max-w-full">
        <div className="relative z-20 gap-[2vw] w-full flex flex-col items-center">
          <TextPop
            as="p"
            className="-rotate-9 max-md:rotate-0 text-mustard-dark text-stroke-180 text-center text-[2.8vw] font-modak leading-[.9]! max-md:text-[6vw]"
          >
            SAY HELLO
          </TextPop>
          <TextPop
            as="h2"
            className="text-center heading180 uppercase max-md:text-[14vw] leading-[.75]  max-md:leading-[.9] w-full text-beige relative z-20 "
            split="words"
            scrollStart="top 88%"
            delay={0.15}
          >
            {"GOT A CRAVING?\nLET'S TALK"}
          </TextPop>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
