"use client";

import { useEffect, useState } from "react";

/**
 * Mirrors the original site's `useAnimation().isPageReady`
 * (isLoaderFinished && isTransitionFinished) without depending on a
 * layout-level provider. If a preloader overlay exists in the DOM
 * (role="dialog" aria-label="Page loading"), we wait until it is removed
 * or hidden (or a "crav:page-ready" event fires); otherwise we are ready
 * immediately.
 */
export function usePageReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ((window as unknown as { __cravPageReady?: boolean }).__cravPageReady) {
      setReady(true);
      return;
    }

    const onReady = () => setReady(true);
    window.addEventListener("crav:page-ready", onReady);

    const loader = document.querySelector<HTMLElement>(
      '[role="dialog"][aria-label="Page loading"]'
    );

    let interval: number | undefined;
    let timeout: number | undefined;

    if (!loader) {
      setReady(true);
    } else {
      interval = window.setInterval(() => {
        const gone =
          !document.contains(loader) ||
          getComputedStyle(loader).display === "none" ||
          getComputedStyle(loader).visibility === "hidden" ||
          parseFloat(getComputedStyle(loader).opacity) === 0;
        if (gone) {
          setReady(true);
          if (interval) window.clearInterval(interval);
        }
      }, 200);
      // Hard fallback so content never stays hidden forever.
      timeout = window.setTimeout(() => setReady(true), 9000);
    }

    return () => {
      window.removeEventListener("crav:page-ready", onReady);
      if (interval) window.clearInterval(interval);
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  return ready;
}
