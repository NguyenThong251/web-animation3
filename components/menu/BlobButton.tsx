"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

const BASE_SHAPE =
  "M310.777 0.20434C424.154 2.91791 540.733 50.9739 574.176 159.34C606.479 264.014 533.962 365.999 442.064 425.623C364.995 475.626 270.863 455.893 193.524 406.309C93.8313 342.395 -27.3608 259.503 5.48889 145.729C40.0621 25.9857 186.179 -2.77783 310.777 0.20434Z";

const HOVER_SHAPES = [
  "M302 27C437 -2 587 97 559 201C532 308 430 453 288 427C193 410 66 363 41 273C6 146 186 48 302 27Z",
  "M295 50C400 0 593 84 562 172C519 292 399 453 237 418C138 397 61 324 41 233C20 140 184 58 295 50Z",
  "M326 0C491 34 591 147 525 255C452 373 345 468 202 405C131 369 34 297 35 201C37 77 186 -10 326 0Z",
];

/**
 * "Order Now" blob button (original module 23057). The red blob morphs to a
 * random alternate shape on hover (MorphSVG, back.out) and morphs back on
 * leave (back.in).
 */
export default function BlobButton() {
  const pathRef = useRef<SVGPathElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  return (
    <Link
      data-cursor-hide="true"
      href="/menu"
      type="link-btn"
      onMouseEnter={() => {
        const shape = HOVER_SHAPES[Math.floor(Math.random() * HOVER_SHAPES.length)];
        tweenRef.current?.kill();
        tweenRef.current = gsap.to(pathRef.current, {
          keyframes: [{ morphSVG: { shape }, duration: 0.5, ease: "back.out" }],
        });
      }}
      onMouseLeave={() => {
        tweenRef.current?.kill();
        tweenRef.current = gsap.to(pathRef.current, {
          keyframes: [{ morphSVG: { shape: BASE_SHAPE }, duration: 0.5, ease: "back.in" }],
        });
      }}
      className="relative w-fit mx-auto border-none bg-transparent p-0 block cursor-pointer outline-none select-none "
      data-anm-btn="btn"
      data-wf--btn-blob--variant="secondary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        viewBox="-10 -10 602 475"
        preserveAspectRatio="none"
        data-anm-btn="svg"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      >
        <path
          ref={pathRef}
          stroke="#ffffff"
          strokeWidth="10"
          fill="#F91914"
          d={BASE_SHAPE}
          data-anm-btn="path"
          className="transition-[fill] duration-200"
        />
      </svg>
      <span
        data-anm-btn="text"
        className="relative z-10 text-white font-bold text40 uppercase inline-block px-[4vw] py-[1.5vw] max-md:px-[10vw] max-md:py-[4vw] "
        aria-hidden="false"
      >
        Order Now
      </span>
    </Link>
  );
}
