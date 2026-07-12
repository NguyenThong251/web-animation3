import type { ReactNode } from "react";

/**
 * Hover text roll — two stacked copies of the label; on group hover the first
 * rolls up and the second rolls in from below. Markup copied verbatim from the
 * original site (module 31922).
 */
export default function TextRoll({ children }: { children: ReactNode }) {
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
