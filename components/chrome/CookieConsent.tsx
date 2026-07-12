"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HoverText from "./HoverText";

const STORAGE_KEY = "crav_cookie_ok";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  // Show the card 6s after first load unless the user already accepted.
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") return;
      timeout = setTimeout(() => {
        setMounted(true);
        setVisible(true);
      }, 6000);
    } catch {
      timeout = setTimeout(() => {
        setMounted(true);
        setVisible(true);
      }, 6000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (visible) {
      animatingRef.current = true;
      gsap.killTweensOf(card);
      gsap.set(card, { opacity: 0, y: 60, scale: 1, pointerEvents: "auto" });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power4.out",
        onComplete: () => {
          animatingRef.current = false;
        },
        clearProps: "transform",
      });
    } else if (mounted) {
      animatingRef.current = true;
      gsap.killTweensOf(card);
      gsap.to(card, {
        opacity: 0,
        y: 68,
        duration: 0.44,
        ease: "power2.inOut",
        onComplete: () => {
          animatingRef.current = false;
          setMounted(false);
        },
      });
    }
  }, [visible, mounted]);

  if (!mounted) return null;

  return (
    <div
      className="fixed bottom-[2vw] max-md:bottom-[3vw] left-1/2 -translate-x-1/2 z-997 w-[32vw] max-w-[98vw] min-w-[290px] max-md:w-[99vw] max-md:px-[2vw] pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        ref={cardRef}
        aria-label="Cookie consent"
        className="pointer-events-auto bg-white/90 backdrop-blur-md text-black border border-beige/30 rounded-2xl shadow-lg px-[1.6vw] py-[1.1vw] max-md:px-[4vw] max-md:py-[4vw] max-md:rounded-xl max-md:gap-3 overflow-hidden flex flex-col gap-1.5"
        style={{
          border: "1.5px solid rgba(240,176,45,0.15)",
          boxShadow: "0 6px 22px rgba(27,27,27,.18)",
        }}
      >
        <div className="flex items-center gap-2 mb-[.5vw] max-md:gap-2.5 max-md:mb-[1.3vw]">
          <span className="inline-flex items-center justify-center bg-mustard/20 rounded-full p-1 mr-1 max-md:p-[2.2vw] max-md:mr-[1vw]">
            <svg aria-hidden="true" width={21} height={21} viewBox="0 0 21 21" fill="none">
              <circle
                cx="10.5"
                cy="10.5"
                r="8.8"
                fill="#F4A804"
                stroke="#C99902"
                strokeWidth="1.4"
              />
              <circle cx="8" cy="8.7" r="1" fill="#deb110" />
              <circle cx="12.5" cy="13.5" r="0.7" fill="#deb110" />
              <circle cx="12.2" cy="7.8" r="0.5" fill="#deb110" />
              <circle cx="8.1" cy="13.7" r="0.45" fill="#deb110" />
            </svg>
          </span>
          <span className="font-mouse-memoirs uppercase tracking-[.16em] text-[.88vw] max-md:text-[4vw] text-black/85 max-md:leading-tight">
            Cookies in use
          </span>
        </div>
        <div className="flex items-center w-full gap-3 max-md:flex-col max-md:items-stretch max-md:gap-[2vw] max-md:w-full">
          <p className="font-mouse-memoirs text-[.96vw] max-md:text-[4vw] text-black/95 leading-normal mr-auto max-md:mr-0 max-md:mb-[2vw] max-md:text-left">
            We use cookies to improve your experience.
          </p>
          <div className="flex items-center gap-2 shrink-0 max-md:mt-0 max-md:w-full max-md:gap-[3vw]">
            <button
              data-cursor-hide="true"
              type="button"
              onClick={() => {
                setVisible(false);
              }}
              className="font-mouse-memoirs cursor-pointer flex items-center justify-center uppercase tracking-wide text-[.88vw] max-md:text-[3.5vw] px-[1vw] py-[.43vw] max-md:px-[2.5vw] max-md:py-[2.4vw] rounded-full border border-black/15 hover:border-mustard hover:bg-mustard/10 transition-colors duration-200 w-fit max-md:flex-1"
            >
              <HoverText>Later</HoverText>
            </button>
            <button
              data-cursor-hide="true"
              type="button"
              onClick={() => {
                try {
                  window.localStorage.setItem(STORAGE_KEY, "1");
                } catch {}
                setVisible(false);
              }}
              className="font-mouse-memoirs cursor-pointer flex items-center justify-center uppercase tracking-wide text-[.88vw] max-md:text-[3.5vw] bg-mustard text-black px-[1vw] py-[.43vw] max-md:px-[2.5vw] max-md:py-[2.4vw] rounded-full border border-mustard hover:bg-black hover:text-beige hover:border-black transition-colors duration-200 w-fit max-md:flex-1"
            >
              <HoverText>Okay!</HoverText>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
