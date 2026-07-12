"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import Button from "./Button";
import RollText from "./RollText";

type ConceptPopupProps = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  badge?: string;
  showCreators?: boolean;
  variant?: "red" | "white";
  children?: React.ReactNode;
};

/**
 * "Concept Website" notice dialog. 1:1 port of the original component
 * (module 87188 in _reference/_original/_next/static/chunks).
 */
export default function ConceptPopup({
  open,
  onClose,
  title = "Concept Website",
  badge = "Notice",
  showCreators = true,
  variant = "red",
  children,
}: ConceptPopupProps) {
  const id = useId();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();
  const [crossHovered, setCrossHovered] = useState(false);
  const isWhite = variant === "white";

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    return () => {
      lenis.start();
    };
  }, [lenis, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const dialog = dialogRef.current;
    if (overlay && dialog) {
      if (!tlRef.current) {
        gsap.set(overlay, { opacity: 0, pointerEvents: "none" });
        gsap.set(dialog, {
          opacity: 0,
          scale: 0.9,
          y: 36,
          transformOrigin: "50% 50%",
        });
        const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
        tl.to(
          overlay,
          {
            opacity: 1,
            duration: 0.32,
            ease: "power2.out",
            onStart: () => gsap.set(overlay, { pointerEvents: "auto" }),
          },
          0
        );
        tl.to(
          dialog,
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2.7)" },
          0.13
        );
        tl.eventCallback("onReverseComplete", () => {
          gsap.set(overlay, { pointerEvents: "none" });
        });
        tlRef.current = tl;
      }
      if (open) tlRef.current.play(0);
      else tlRef.current.reverse();
    }
  }, [open]);

  useEffect(() => {
    const btn = dialogRef.current?.querySelector(".concept-cross-btn");
    if (!btn) return;
    if (crossHovered) {
      gsap.to(btn, { rotate: 90, scale: 1.24, duration: 0.23, ease: "power2.out" });
    } else {
      gsap.to(btn, { rotate: 0, scale: 1, duration: 0.18, ease: "power1.out" });
    }
  }, [crossHovered]);

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 opacity-0 z-998 pointer-events-none bg-red/30 backdrop-blur-md transition-opacity"
        onClick={open ? onClose : undefined}
        aria-hidden={true}
        style={{ cursor: open ? "pointer" : "default" }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-999 grid place-items-center px-[4vw]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
      >
        <div
          ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: open ? "auto" : "none" }}
          className={`w-full max-w-[32vw] opacity-0 max-md:max-w-[92vw] rounded-[1.2vw] max-md:rounded-[5vw] shadow-[0_1vw_3vw_rgba(27,27,27,.25)] ${
            isWhite ? "bg-white text-black" : "bg-red text-beige"
          }`}
        >
          <div className="p-[1.8vw] max-md:p-[6vw]">
            <div className="flex items-start justify-between gap-[2vw]">
              <div className="space-y-[.6vw] max-md:space-y-[2vw]">
                <p
                  className={`font-mouse-memoirs uppercase tracking-[.2em] text-[.9vw] max-md:text-[3.5vw] ${
                    isWhite ? "text-black/50" : "text-beige/70"
                  }`}
                >
                  {badge}
                </p>
                <h3
                  id={`${id}-title`}
                  className="font-modak uppercase leading-[.95] text-[2.4vw] max-md:text-[9vw]"
                >
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`concept-cross-btn shrink-0 size-[3vw] max-md:size-[10vw] rounded-full border transition-colors grid place-items-center ${
                  isWhite ? "border-black/20" : "border-beige/30"
                }
                  ${
                    crossHovered
                      ? isWhite
                        ? "border-black/40 bg-black/5"
                        : "border-beige/70 bg-beige/10"
                      : ""
                  }
                `}
                aria-label="Close popup"
                tabIndex={open ? 0 : -1}
                onMouseEnter={() => setCrossHovered(true)}
                onMouseLeave={() => setCrossHovered(false)}
                style={{
                  cursor: "pointer",
                  willChange: "transform",
                  transition: "box-shadow 0.14s, background 0.18s, transform 0.18s",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[55%] h-[55%]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div
              id={`${id}-desc`}
              className={`mt-[1.2vw] font-mouse-memoirs uppercase text-[1.05vw] max-md:text-[4.2vw] leading-[1.4] ${
                isWhite ? "text-black/70" : "text-beige/80"
              }`}
            >
              <div className="relative max-md:w-[90%] z-10">{children}</div>
              {showCreators && (
                <div className="mt-[2.5vw] relative">
                  <div className="flex flex-col items-center gap-[1.8vw] max-md:gap-[6vw]">
                    <div
                      className={`px-[1vw] max-md:px-[3vw]  max-md:mt-[4vw] backdrop-blur-sm py-[.4vw] rounded-full border ${
                        isWhite ? "bg-black/5 border-black/5" : "bg-white/5 border-white/5"
                      }`}
                    >
                      <p
                        className={`font-mouse-memoirs uppercase tracking-[.4em] text-[.7vw] max-md:text-[2.8vw] ${
                          isWhite ? "text-black/40" : "text-beige/40"
                        }`}
                      >
                        Designed &amp; Developed By
                      </p>
                    </div>
                    <div className="flex items-stretch justify-center gap-[1.2vw] max-md:flex-col max-md:items-center max-md:gap-[4vw] w-full">
                      {[{ name: "Anyflow ", link: "https://labs.anyflow.agency/" }].map(
                        (creator, i) => (
                          <Link
                            key={i}
                            href={creator.link}
                            target="_blank"
                            className={`group relative max-md:w-full flex-1 flex flex-col items-center justify-center p-[1.6vw] max-md:p-[6vw] rounded-[1vw] max-md:rounded-[4vw] border transition-all duration-500 overflow-hidden ${
                              isWhite
                                ? "bg-black/5 border-black/5 hover:bg-black/10 hover:border-black/10"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-br from-mustard/15 via-transparent to-transparent transition-opacity duration-700" />
                            <span
                              className={`relative font-modak uppercase text-[1.8vw] max-md:text-[7vw] ${
                                isWhite ? "group-hover:text-red" : "group-hover:text-mustard"
                              } transition-colors leading-none tracking-tight ${
                                isWhite ? "text-black" : "text-beige"
                              }`}
                            >
                              {creator.name}
                            </span>
                            <div className="absolute top-[.6vw] right-[.6vw] opacity-0 group-hover:opacity-40 transition-opacity">
                              <svg
                                viewBox="0 0 24 24"
                                className="size-[.7vw]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                              </svg>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-[2.2vw] max-md:mt-[8vw] flex items-center justify-center">
              <Button
                data-cursor-hide="true"
                type="button"
                onClick={onClose}
                variant="conceptCta"
                className={`w-full py-[1vw] max-md:py-[3vw] rounded-full transition-all duration-300 ${
                  isWhite ? "hover:bg-red hover:text-white" : "hover:bg-black hover:text-white"
                }`}
                tabIndex={open ? 0 : -1}
              >
                <RollText>Acknowledge &amp; Close</RollText>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
