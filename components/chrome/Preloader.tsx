"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useAnimation } from "./AnimationProvider";
import { PRELOADER_LAYERS } from "./preloader-layers";

const SPARKLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  color: i % 3 === 0 ? "#ffd750" : i % 3 === 1 ? "#fff" : "#60A905",
  size: i % 2 === 0 ? "w-2 h-2 md:w-3 md:h-3" : "w-3 h-3 md:w-4 md:h-4",
}));

export default function Preloader() {
  const lenis = useLenis();
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("PREPARING ARTISAN KITCHEN...");
  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sparkleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const redPathRef = useRef<SVGPathElement>(null);
  const orangePathRef = useRef<SVGPathElement>(null);
  const maroonPathRef = useRef<SVGPathElement>(null);
  const { setLoaderFinished } = useAnimation();

  useLayoutEffect(() => {
    if (!lenis) return;
    lenis.stop();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          lenis.start();
          setShow(false);
          setLoaderFinished(true);
        },
      });

      const red = { yLeft: 101, yRight: 101, yCenter: 101 };
      const orange = { yLeft: 101, yRight: 101, yCenter: 101 };
      const maroon = { yLeft: 101, yRight: 101, yCenter: 101 };

      gsap.set(layerRefs.current, { y: -800, opacity: 0, scale: 0.8 });
      gsap.set(stackRef.current, { scaleX: 1, scaleY: 1 });
      gsap.set(textRef.current, { opacity: 1, y: 0 });

      const counter = { value: 0 };
      tl.to(
        counter,
        {
          value: 100,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: () => {
            setProgress(Math.floor(counter.value));
          },
        },
        0,
      );

      PRELOADER_LAYERS.forEach((layer, i) => {
        const dropAt = 0.22 * i;
        const settleAt = dropAt + 0.32;
        tl.call(() => setLabel(layer.label), undefined, dropAt + 0.05);
        tl.fromTo(
          layerRefs.current[i],
          { y: -800, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "power1.in" },
          dropAt,
        );
        tl.fromTo(
          layerRefs.current[i],
          { rotate: layer.rotate + (Math.random() > 0.5 ? 12 : -12) },
          { rotate: layer.rotate, duration: 0.45, ease: "back.out(2.5)" },
          settleAt,
        );
        tl.to(
          stackRef.current,
          { scaleY: 0.88, scaleX: 1.06, duration: 0.06, ease: "power2.out" },
          settleAt,
        );
        tl.to(
          stackRef.current,
          { scaleY: 1.03, scaleX: 0.98, duration: 0.08, ease: "power1.inOut" },
          settleAt + 0.06,
        );
        tl.to(
          stackRef.current,
          { scaleY: 1, scaleX: 1, duration: 0.12, ease: "power2.out" },
          settleAt + 0.14,
        );
      });

      const burstAt = 1.1 + 0.32;
      tl.call(
        () => {
          sparkleRefs.current.forEach((sparkle, i) => {
            if (!sparkle) return;
            const angle = (i / SPARKLES.length) * Math.PI * 2;
            const distance = 110 + 90 * Math.random();
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance - 30;
            gsap.fromTo(
              sparkle,
              { x: 0, y: 0, scale: 0, opacity: 1 },
              {
                x,
                y,
                scale: 1.5 * Math.random() + 0.6,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
              },
            );
          });
        },
        undefined,
        burstAt,
      );
      tl.to(
        stackRef.current,
        { y: -50, scale: 1.08, rotate: 2, duration: 0.4, ease: "power2.out" },
        burstAt + 0.3,
      ).to(stackRef.current, {
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: "bounce.out",
      });
      tl.call(() => setLabel("READY TO CRAV!"), undefined, burstAt + 0.3);

      const exitAt = burstAt + 1.2;
      tl.to(
        [textRef.current, ".loader-bar"],
        {
          y: 50,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            lenis.scrollTo("top");
          },
        },
        exitAt - 0.4,
      );
      tl.to(
        stackRef.current,
        { y: -1000, opacity: 0, scale: 0.9, duration: 0.75, ease: "power2.in" },
        exitAt,
      );

      tl.to(
        red,
        { yLeft: -1, yRight: -1, duration: 0.8, ease: "power2.inOut" },
        exitAt,
      ).to(
        red,
        {
          yCenter: -1,
          duration: 1.1,
          ease: "power4.inOut",
          onUpdate: () => {
            redPathRef.current &&
              redPathRef.current.setAttribute(
                "d",
                `M -1 -1 L 101 -1 L 101 ${red.yRight} Q 50 ${red.yCenter} -1 ${red.yLeft} Z`,
              );
          },
        },
        exitAt,
      );

      const orangeAt = exitAt + 0.12;
      tl.to(
        orange,
        { yLeft: -1, yRight: -1, duration: 0.8, ease: "power2.inOut" },
        orangeAt,
      ).to(
        orange,
        {
          yCenter: -1,
          duration: 1.1,
          ease: "power4.inOut",
          onUpdate: () => {
            orangePathRef.current &&
              orangePathRef.current.setAttribute(
                "d",
                `M -1 -1 L 101 -1 L 101 ${orange.yRight} Q 50 ${orange.yCenter} -1 ${orange.yLeft} Z`,
              );
          },
        },
        orangeAt,
      );

      const maroonAt = exitAt + 0.24;
      tl.to(
        maroon,
        { yLeft: -1, yRight: -1, duration: 0.8, ease: "power2.inOut" },
        maroonAt,
      ).to(
        maroon,
        {
          yCenter: -1,
          duration: 1.1,
          ease: "power4.inOut",
          onUpdate: () => {
            maroonPathRef.current &&
              maroonPathRef.current.setAttribute(
                "d",
                `M -1 -1 L 101 -1 L 101 ${maroon.yRight} Q 50 ${maroon.yCenter} -1 ${maroon.yLeft} Z`,
              );
          },
        },
        maroonAt,
      );
    });

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis]);

  if (!show) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 h-dvh w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 99999 }}
      role="dialog"
      aria-modal="true"
      aria-label="Page loading"
    >
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={maroonPathRef}
            fill="#4C0016"
            d="M -1 -1 L 101 -1 L 101 101 Q 50 101 -1 101 Z"
          />
        </svg>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={orangePathRef}
            fill="#EF6F2E"
            d="M -1 -1 L 101 -1 L 101 101 Q 50 101 -1 101 Z"
          />
        </svg>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={redPathRef}
            fill="#f91814"
            d="M -1 -1 L 101 -1 L 101 101 Q 50 101 -1 101 Z"
          />
        </svg>
      </div>
      <div
        ref={stackRef}
        className="relative w-[75vw] h-[80vw] mb-[12vw] max-w-[340px] max-h-[360px] md:max-w-[450px] md:max-h-[480px] flex items-center justify-center z-20 origin-bottom"
        aria-hidden="true"
      >
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          {SPARKLES.map((sparkle, i) => (
            <div
              key={sparkle.id}
              ref={(el) => {
                sparkleRefs.current[i] = el;
              }}
              className={`absolute rounded-full ${sparkle.size}`}
              style={{ backgroundColor: sparkle.color, opacity: 0 }}
            />
          ))}
        </div>
        {PRELOADER_LAYERS.map((layer, i) => {
          const LayerComponent = layer.component;
          return (
            <div
              key={layer.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="absolute left-1/2 -translate-x-1/2 will-change-transform"
              style={{
                bottom: layer.bottom,
                width: layer.width,
                height: layer.height,
                zIndex: layer.zIndex,
                opacity: 0,
              }}
            >
              <LayerComponent />
            </div>
          );
        })}
      </div>
      <div
        ref={textRef}
        className="flex  absolute bottom-[4vw] max-md:bottom-[20vw] flex-col items-center mt-[6vw] md:mt-[10vw] z-20 w-full px-6"
      >
        <div
          className="font-mouse-memoirs text60 text-white/90 tracking-wider uppercase mt-[3vw] md:mt-[1.5vw] text-center min-h-[1.5em]"
          aria-live="polite"
        >
          {label}
        </div>
      </div>
      <div
        className="w-full loader-bar absolute bottom-0 left-0  h-[2vw] md:h-[1vw] bg-white/15 overflow-hidden mt-[2vw] md:mt-[1vw]"
        role="progressbar"
        aria-label="Loading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-mustard  transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
