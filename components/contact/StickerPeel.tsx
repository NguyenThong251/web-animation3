"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StickerPeelProps = {
  imageSrc: string;
  rotate?: number;
  triggers?: [string, string] | string[];
  peelBackHoverPct?: number;
  peelBackActivePct?: number;
  peelEasing?: string;
  peelHoverEasing?: string;
  width?: number | string;
  shadowIntensity?: number;
  lightingIntensity?: number;
  peelDirection?: number;
  className?: string;
  alt?: string;
};

/**
 * Scroll-driven sticker peel. 1:1 port of the original StickerPeel component
 * (module 80308 in _reference/_original/_next/static/chunks).
 */
export default function StickerPeel({
  imageSrc,
  rotate = 30,
  triggers = ["-120% 50%", "30% 50%"],
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelEasing = "power3.out",
  peelHoverEasing = "power2.out",
  width = 200,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  peelDirection = 0,
  className = "",
}: StickerPeelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pointLightRef = useRef<SVGFEPointLightElement | null>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement | null>(null);
  const [simpleEffects, setSimpleEffects] = useState(false);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isCoarse || isSafari) setSimpleEffects(true);
  }, []);

  useEffect(() => {
    if (simpleEffects) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.set(pointLightRef.current, { attr: { x, y } });
      if (Math.abs(peelDirection % 360) !== 180) {
        gsap.set(pointLightFlippedRef.current, {
          attr: { x, y: rect.height - y },
        });
      } else {
        gsap.set(pointLightFlippedRef.current, { attr: { x: -1000, y: -1000 } });
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [peelDirection, simpleEffects]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onTouchStart = () => container.classList.add("touch-active");
    const onTouchEnd = () => container.classList.remove("touch-active");
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchend", onTouchEnd);
    container.addEventListener("touchcancel", onTouchEnd);
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const state = { peel: 1 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: triggers[0],
        end: triggers[1],
        scrub: 1,
        markers: false,
      },
    });
    tl.to(state, {
      peel: 0,
      ease: "none",
      onUpdate: () => {
        el.style.setProperty("--peel-amount", String(state.peel));
      },
    });
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cssVars = useMemo(
    () =>
      ({
        "--sticker-rotate": `${rotate}deg`,
        "--sticker-p": "20%",
        "--sticker-peelback-hover": `${peelBackHoverPct}%`,
        "--sticker-peelback-active": `${peelBackActivePct}%`,
        "--sticker-peel-easing": peelEasing,
        "--sticker-peel-hover-easing": peelHoverEasing,
        "--sticker-width": typeof width === "number" ? `${width}px` : width,
        "--sticker-shadow-opacity": shadowIntensity,
        "--sticker-lighting-constant": lightingIntensity,
        "--peel-direction": `${peelDirection}deg`,
        "--peel-amount": 1,
      }) as React.CSSProperties,
    [
      rotate,
      peelBackHoverPct,
      peelBackActivePct,
      peelEasing,
      peelHoverEasing,
      width,
      shadowIntensity,
      lightingIntensity,
      peelDirection,
    ]
  );

  return (
    <div
      className={`${className} ${simpleEffects ? "simple-effects" : ""}`}
      ref={rootRef}
      style={cssVars}
    >
      <svg width="0" height="0">
        <defs>
          <filter id="pointLight">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="pointLightFlipped">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={7 * lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="dropShadow">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>
          <filter id="expandAndFill">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>
      <div className="sticker-container" ref={containerRef}>
        <div className="sticker-main">
          <div className="sticker-lighting">
            <img
              src={imageSrc}
              alt=""
              className="sticker-image"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
        <div className="flap">
          <div className="flap-lighting">
            <img
              src={imageSrc}
              alt=""
              className="flap-image"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
