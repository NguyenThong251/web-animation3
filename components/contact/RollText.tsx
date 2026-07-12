import React from "react";

/**
 * Hover roll-up text (double stacked spans). 1:1 port of the original
 * component (module 31922). Class strings copied verbatim from the SSR DOM,
 * including double spaces.
 */
export default function RollText({ children }: { children: React.ReactNode }) {
  return (
    <span className="overflow-hidden  relative inline-block group ">
      <span className="block  group-hover:-translate-y-full translate-y-0 transition-all duration-300">
        {children}
      </span>
      <span
        className="block absolute inset-0 w-full h-full group-hover:translate-y-0 translate-y-full transition-all duration-300"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}
