"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children?: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  // Drive Lenis from GSAP's ticker (original: autoRaf:false + ticker.add).
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  // Keep ScrollTrigger in sync with Lenis scroll events.
  useLenis(() => ScrollTrigger.update());

  return (
    <>
      <ReactLenis
        root
        options={{ autoRaf: false, duration: 1.2 }}
        ref={lenisRef}
      />
      {children}
    </>
  );
}
