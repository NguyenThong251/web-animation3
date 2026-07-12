"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type JellyCurveProps = {
  fill?: string;
  flip?: boolean;
  className?: string;
};

/**
 * Wobbling section-divider curve. 1:1 port of the original component
 * (module 36507 in _reference/_original/_next/static/chunks).
 */
export default function JellyCurve({
  fill = "#f5e3cd",
  flip = false,
  className = "",
}: JellyCurveProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let mm: gsap.MatchMedia | undefined;
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;

      const pts = flip
        ? { v: 165, s1c: 235, s1e: 145, s2c: 195, s2e: 163, s3c: 195, s3e: 195 }
        : { v: 135, s1c: 65, s1e: 155, s2c: 105, s2e: 137, s3c: 105, s3e: 105 };

      const buildPath = () =>
        flip
          ? `M1536,300 H-1 V${300 - pts.v} S184.32,${300 - pts.s1c} 460.8,${300 - pts.s1e} S860.16,${300 - pts.s2c} 1121.28,${300 - pts.s2e} S1413.12,${300 - pts.s3c} 1536,${300 - pts.s3e} V300`
          : `M1536,0 H-1 V${pts.v} S184.32,${pts.s1c} 460.8,${pts.s1e} S860.16,${pts.s2c} 1121.28,${pts.s2e} S1413.12,${pts.s3c} 1536,${pts.s3e} V0`;

      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      if (flip) {
        tl.to(
          pts,
          {
            v: 145,
            s1c: 215,
            s1e: 155,
            duration: 1,
            ease: "sine.inOut",
            onUpdate: () => path.setAttribute("d", buildPath()),
          },
          0
        );
        tl.to(
          pts,
          {
            s2c: 175,
            s2e: 140,
            duration: 2,
            ease: "sine.inOut",
            onUpdate: () => path.setAttribute("d", buildPath()),
          },
          0.3
        );
        tl.to(
          pts,
          {
            s3c: 170,
            s3e: 200,
            duration: 1.8,
            ease: "sine.inOut",
            onUpdate: () => path.setAttribute("d", buildPath()),
          },
          0.6
        );
      } else {
        tl.to(
          pts,
          {
            v: 155,
            s1c: 45,
            s1e: 175,
            duration: 1,
            ease: "sine.inOut",
            onUpdate: () => path.setAttribute("d", buildPath()),
          },
          0
        );
        tl.to(
          pts,
          {
            s2c: 85,
            s2e: 160,
            duration: 2,
            ease: "sine.inOut",
            onUpdate: () => path.setAttribute("d", buildPath()),
          },
          0.3
        );
        tl.to(
          pts,
          {
            s3c: 130,
            s3e: 80,
            duration: 1.8,
            ease: "sine.inOut",
            onUpdate: () => path.setAttribute("d", buildPath()),
          },
          0.6
        );
      }

      const svg = svgRef.current;
      if (svg) {
        gsap.set(svg, { transformOrigin: flip ? "bottom center" : "top center" });
        mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () =>
          gsap.to(svg, {
            scaleY: 1.5,
            scrollTrigger: {
              trigger: svg,
              start: flip ? "bottom 80%" : "top 80%",
              end: flip ? "top 20%" : "bottom 20%",
              scrub: 1,
            },
          })
        );
        mm.add("(max-width: 767px)", () =>
          gsap.to(svg, {
            scaleY: 1.2,
            scrollTrigger: {
              trigger: svg,
              start: flip ? "bottom 95%" : "top 90%",
              end: flip ? "top 15%" : "bottom 10%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
        );
      }
    });

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, [flip]);

  return (
    <div
      className={`
        z-99 w-full absolute left-0 right-0 overflow-x-clip
        max-md:left-0 max-md:right-0
        ${flip ? "bottom-[-.5vw] max-md:bottom-0" : "top-0"}
        ${className}
      `}
    >
      <svg
        ref={svgRef}
        className="jelly pointer-events-none block w-full max-w-[100vw] h-[300px] max-md:h-auto"
        width="100%"
        viewBox="0 0 1536 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={
            flip
              ? "M1536,300 H-1 V135 S184.32,235 460.8,145 S860.16,195 1121.28,163 S1413.12,195 1536,195 V300"
              : "M1536,0 H-1 V135 S184.32,65 460.8,155 S860.16,105 1121.28,137 S1413.12,105 1536,105 V0"
          }
          fill={fill}
        />
      </svg>
    </div>
  );
}
