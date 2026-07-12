"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAnimation } from "./AnimationProvider";

/**
 * Non-visual chrome behaviors from the original site:
 * 1. Console branding easter egg (with the same noisy-log filter).
 * 2. Animated document.title cycler ("CRAV | Sizzling" -> "Grilling" -> ...)
 *    that shows "Craving..." while the loader / page transition runs.
 */
export default function ChromeEffects() {
  const pathname = usePathname();
  const { isTransitionFinished, isLoaderFinished } = useAnimation();

  // Console branding (module 44091 in the original bundle).
  useEffect(() => {
    const original = console.log;
    console.log = (...args: unknown[]) => {
      if (
        args.some(
          (arg) =>
            typeof arg === "string" &&
            (arg.includes("[SaveDesign]") || arg.includes("Content script")),
        )
      ) {
        return;
      }
      original.apply(console, args);
    };
    console.clear();
    console.log(
      "%c CRAV BY %c : %c VASAV · PRITAM · GAURAV ",
      "color: #f91814; font-weight: 900; letter-spacing: 1px;",
      "color: #ccc;",
      "color: #ccc; font-weight: 500; letter-spacing: 0.5px;",
    );
  }, []);

  const base = useMemo(
    () =>
      pathname === "/"
        ? "CRAV"
        : pathname
            .split("/")
            .filter(Boolean)
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
            )
            .join(" | ") || "CRAV",
    [pathname],
  );

  // Title cycler (module 28981 in the original bundle).
  useEffect(() => {
    if (!isTransitionFinished || !isLoaderFinished) {
      document.title = "Craving...";
      return;
    }
    const titles = [
      `${base} | Sizzling`,
      `${base} | Grilling`,
      `${base} | Flipping`,
      `${base} | Serving`,
      `${base} | Enjoy`,
    ];
    let index = 0;
    document.title = titles[index];
    index = (index + 1) % titles.length;
    const interval = setInterval(() => {
      document.title = titles[index];
      index = (index + 1) % titles.length;
    }, 800);
    return () => clearInterval(interval);
  }, [base, isTransitionFinished, isLoaderFinished]);

  return null;
}
