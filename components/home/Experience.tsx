"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Jelly from "./Jelly";
import StickerPeel from "./StickerPeel";
import PopText from "./PopText";
import FadeText from "./FadeText";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const leftPupilRef = useRef<HTMLDivElement | null>(null);
  const rightPupilRef = useRef<HTMLDivElement | null>(null);
  const refreshedRef = useRef(false);

  useEffect(() => {
    const left = leftPupilRef.current;
    const right = rightPupilRef.current;
    if (!left || !right) return;

    const setLeft = gsap.quickSetter(left, "rotation", "deg");
    const setRight = gsap.quickSetter(right, "rotation", "deg");
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - window.innerWidth / 2;
      const angle =
        (180 / Math.PI) *
          Math.atan2(e.clientY - window.innerHeight / 2, dx) -
        180;
      setLeft(angle);
      setRight(angle);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    if (refreshedRef.current) return;
    refreshedRef.current = true;
    const raf = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const eye = (ref: React.RefObject<HTMLDivElement | null>) => (
    <div
      className="bg-white flex items-center justify-center overflow-hidden mx-auto"
      style={{
        width: "6vw",
        height: "9vw",
        maxWidth: "12vw",
        maxHeight: "18vw",
        borderRadius: "50% / 60%",
      }}
    >
      <div
        className="relative bg-white"
        style={{ width: "70%", height: "75%", borderRadius: "50% / 60%" }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "2.2vw",
            maxHeight: "4.2vw",
            transform: "translate(-50%,-50%) rotate(0deg)",
            transformOrigin: "50% 50%",
          }}
          ref={ref}
        >
          <div
            style={{
              width: "2.2vw",
              height: "3vw",
              maxWidth: "4vw",
              maxHeight: "6vw",
              borderRadius: "50% / 55%",
              background: "black",
            }}
          />
        </div>
      </div>
    </div>
  );

  const brow = (flipped: boolean) => (
    <div
      className={`w-[7vw] ${flipped ? "scale-x-[-1] " : ""}max-md:w-[14vw] mb-[.8vw] max-md:mb-[1.8vw] mx-auto flex items-center justify-center`}
    >
      <svg
        width="100%"
        viewBox="0 0 182 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.2666 74.5742C7.2666 74.5742 45.7896 11.0167 85.7666 8.57418C128.957 5.93536 174.767 74.5742 174.767 74.5742"
          stroke="white"
          strokeWidth="17"
        />
      </svg>
    </div>
  );

  return (
    <div className="h-fit  -mt-[15vw] max-md:-mt-[10vw] self flex items-center justify-center relative w-full bg-red">
      <Jelly />
      <div className="h-fit relative mt-[15vw] max-md:mt-[10vw] flex flex-col items-center justify-center translate-y-[10vw] max-md:translate-y-[5vw] z-10 w-full overflow-hidden pb-[5vw] max-md:pb-[15vw]">
        <StickerPeel
          className="w-[14vw] max-md:w-[25vw] h-auto absolute top-[5vw] max-md:top-[30vw] left-[5vw] max-md:-left-[4vw] z-50"
          imageSrc="/img-webp/fries.webp"
          width="100%"
        />
        <StickerPeel
          className="w-[18vw] max-md:w-[35vw] h-auto absolute top-[20vw] max-md:top-[35vw] right-[2vw] max-md:-right-[6vw] z-50"
          imageSrc="/img-webp/burger.webp"
          width="100%"
        />
        <div className="relative z-20 w-full flex flex-col items-center">
          <p className="text-red absolute -rotate-8 max-md:rotate-0 text-stroke-180 text-center top-[5vw] max-md:top-[6vw] left-1/2 -translate-x-1/2 text-[2.8vw] max-md:text-[7vw] font-modak leading-[.9]! z-0 mix-blend-overlay opacity-80">
            EXPERIENCE
          </p>
          <PopText
            as="h2"
            className="text-center heading300 uppercase max-md:text-[14vw] leading-[.75] w-full text-beige relative z-20 mt-[10vw] max-md:mt-[15vw]"
            split="words"
            scrollStart="top 88%"
          >
            {"food that\nfeels good"}
          </PopText>
        </div>
        <div className="flex items-end justify-between w-full px-0 max-md:px-[4vw] max-md:flex-col max-md:items-center relative max-md:mt-[15vw]">
          <div className="max-md:absolute max-md:bottom-[-15vw] max-md:left-0 z-20 max-md:text-left">
            <p className="text-beige whitespace-nowrap font-mouse-memoirs uppercase leading-[1.1] text40 max-md:text-[6vw]">
              <FadeText>
                450 kcal
                <br /> High Protein
                <br /> Fresh Ingredients
              </FadeText>
            </p>
          </div>
          <div className="h-auto translate-y-[4vw] max-md:translate-y-0 w-[80vw] max-md:w-screen relative z-10">
            <div className="absolute top-[2%] left-[36%] max-md:left-[38.5%] -translate-x-1/2 z-20">
              {brow(false)}
              {eye(leftPupilRef)}
            </div>
            <div className="absolute top-[2%] right-[36%] max-md:right-[38.5%] translate-x-1/2 z-20">
              {brow(true)}
              {eye(rightPupilRef)}
            </div>
            <img
              alt="burger with hands"
              loading="lazy"
              width={1000}
              height={1000}
              decoding="async"
              className="h-full w-full object-contain relative z-10 "
              style={{ color: "transparent" }}
              src="/img-webp/burgerwithhands.webp"
              onLoad={() => ScrollTrigger.refresh()}
            />
            <p className="text-mustard-dark absolute rotate-15 text-stroke-180 w-[10vw] max-md:w-[22vw] text-center bottom-[10vw] max-md:bottom-[10vw] right-[10vw] max-md:right-[8vw] text-[2.8vw] max-md:text-[6vw] font-modak leading-[.9]! z-30">
              BOLD FLAVOUR
            </p>
          </div>
          <div className="max-md:absolute max-md:bottom-[-15vw] max-md:right-0 z-20 max-md:text-right">
            <p className="text-beige font-mouse-memoirs uppercase leading-[1.1] text-right text40 max-md:text-[6vw] whitespace-nowrap">
              <FadeText>
                100% Organic
                <br /> Zero Guilt
                <br /> True Taste
              </FadeText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
