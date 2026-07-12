"use client";

import type { ReactNode } from "react";

/**
 * Rolling hover text used across the chrome (nav pills, footer links,
 * cookie buttons). On hover the visible copy slides up and a duplicate
 * slides in from below (pure CSS via the `group` classes).
 */
export default function HoverText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`overflow-hidden  relative inline-block group ${className}`}>
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
