"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

const INGREDIENTS = [
  { src: "/img-webp/lettuce.webp", alt: "lettuce" },
  { src: "/img-webp/tomato.webp", alt: "tomato" },
  { src: "/img-webp/cheese-logo.webp", alt: "cheese" },
  { src: "/img-webp/meat.webp", alt: "patty" },
];

interface RopePoint {
  x: number;
  y: number;
}

/**
 * Desktop-only cursor rope (module 78519 in the original bundle): a chain of
 * segments follows the mouse, drawn as a quadratic SVG path with four
 * ingredient chips pinned at the knots. Hidden over [data-cursor-hide]
 * elements and disabled for touch / reduced-motion users.
 */
export default function IngredientRope({
  ropeColor = "#fff",
  ropeWidth = 2,
  ropeOpacity = 1,
  segmentLength = 8,
  segmentCount = 8,
  knots = [0, 3, 5, 9],
}: {
  ropeColor?: string;
  ropeWidth?: number;
  ropeOpacity?: number;
  segmentLength?: number;
  segmentCount?: number;
  knots?: number[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const enabled = useMemo(
    () =>
      !!mounted &&
      (window.matchMedia?.("(pointer: fine)")?.matches ?? false) &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    [mounted],
  );

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointsRef = useRef<RopePoint[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const tensionRef = useRef({ value: segmentLength });
  const relaxTimeoutRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const fadeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [items] = useState(() => INGREDIENTS);

  // Fade the rope in once tracking starts, out over [data-cursor-hide].
  useEffect(() => {
    if (enabled && started) {
      gsap.to(fadeRef, {
        current: hidden ? 0 : 1,
        duration: 0.6,
        overwrite: "auto",
        ease: "power3.inOut",
        onUpdate: () => {
          const value = fadeRef.current;
          setOpacity(value);
          if (containerRef.current) {
            containerRef.current.style.opacity = `${value}`;
            containerRef.current.style.zIndex = value < 0.2 ? "0" : "10000";
          }
          chipRefs.current.forEach((chip) => {
            if (chip) chip.style.opacity = `${value}`;
          });
        },
      });
    }
  }, [hidden, started, enabled]);

  useEffect(() => {
    if (!enabled) return;
    let tracking = false;
    let raf: number | null = null;

    const onMouseDown = () => {
      const svg = svgRef.current;
      if (svg) {
        gsap.fromTo(svg, { opacity: 1 }, { opacity: 1, duration: 0.01 });
      }
    };

    const tick = () => {
      if (tracking && mouseRef.current.x !== null) {
        const points = pointsRef.current;
        gsap.to(points[0], {
          x: mouseRef.current.x,
          y: mouseRef.current.y ?? 0,
          duration: 0.05,
          ease: "power2.out",
          overwrite: true,
        });

        // Constrain each segment to the rope length.
        const maxLength = Math.max(0, tensionRef.current?.value ?? segmentLength);
        for (let i = 1; i < segmentCount; i += 1) {
          const prev = points[i - 1];
          const point = points[i];
          const dx = prev.x - point.x;
          const dy = prev.y - point.y;
          if (Math.sqrt(dx * dx + dy * dy) > maxLength) {
            const angle = Math.atan2(dy, dx);
            const nx = prev.x - Math.cos(angle) * maxLength;
            const ny = prev.y - Math.sin(angle) * maxLength;
            gsap.to(point, {
              x: nx,
              y: ny,
              duration: 0.12 + 0.01 * i,
              ease: "power3.out",
              overwrite: true,
            });
          }
        }

        // Draw a smooth quadratic path through the points.
        if (pathRef.current) {
          let d = `M ${points[0].x} ${points[0].y}`;
          for (let i = 1; i < segmentCount - 1; i += 1) {
            const cx = (points[i].x + points[i + 1].x) / 2;
            const cy = (points[i].y + points[i + 1].y) / 2;
            d += ` Q ${points[i].x} ${points[i].y} ${cx} ${cy}`;
          }
          const last = points[segmentCount - 1];
          d += ` L ${last.x} ${last.y}`;
          pathRef.current.setAttribute("d", d);
        }

        // Pin the ingredient chips to the knots.
        knots.forEach((knot, i) => {
          const chip = chipRefs.current[i];
          const point = points[Math.max(0, Math.min(segmentCount - 1, knot))];
          if (!chip || !point) return;
          gsap.set(chip, { x: point.x, y: point.y });
          const prev = points[Math.max(0, Math.min(segmentCount - 1, knot - 1))];
          if (prev) {
            const angle =
              Math.atan2(point.y - prev.y, point.x - prev.x) * (180 / Math.PI);
            gsap.set(chip, { rotation: angle });
          }
        });
      }
      raf = requestAnimationFrame(tick);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      if (!tracking) {
        const { clientX, clientY } = event;
        pointsRef.current = Array.from({ length: segmentCount }, () => ({
          x: clientX,
          y: clientY,
        }));
        tracking = true;
        setStarted(true);
        tensionRef.current.value = segmentLength;
      }
      gsap.to(tensionRef.current, {
        value: segmentLength,
        duration: 0.01,
        ease: "power4.inOut",
        overwrite: true,
      });
      if (relaxTimeoutRef.current) {
        window.clearTimeout(relaxTimeoutRef.current);
      }
      relaxTimeoutRef.current = window.setTimeout(() => {
        gsap.to(tensionRef.current, {
          value: 0,
          duration: 0.5,
          ease: "expo.out",
          overwrite: true,
        });
      }, 0);

      // Hide the rope over any [data-cursor-hide] element.
      const hovered = document.elementFromPoint(
        mouseRef.current.x ?? -1,
        mouseRef.current.y ?? -1,
      );
      let shouldHide = false;
      let node: Element | null = hovered;
      while (node) {
        if (node.getAttribute && node.getAttribute("data-cursor-hide") !== null) {
          shouldHide = true;
          break;
        }
        node = node.parentElement;
      }
      setHidden(shouldHide);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      if (relaxTimeoutRef.current) window.clearTimeout(relaxTimeoutRef.current);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, knots, segmentCount, segmentLength]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className="fixed max-md:hidden inset-0 pointer-events-none"
      style={{ opacity, zIndex: hidden ? 0 : 10000 }}
    >
      <svg ref={svgRef} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          ref={pathRef}
          fill="none"
          stroke={ropeColor}
          strokeWidth={ropeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={ropeOpacity}
        />
      </svg>
      {knots.slice(0, 4).map((_, i) => {
        const ingredient = items[i] ?? INGREDIENTS[0];
        return (
          <div
            key={i}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
            style={{ opacity, zIndex: 10000 - i }}
          >
            <div className="size-[2.2vw] max-md:hidden max-md:size-[7vw] rounded-full bg-white/80 backdrop-blur-md  border border-black/20  grid place-items-center">
              <img
                src={ingredient.src}
                alt={ingredient.alt}
                draggable={false}
                className="w-[70%] h-[70%] object-contain select-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
