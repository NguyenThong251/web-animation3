import React from "react";
import Link from "next/link";

/**
 * Shared pill button. 1:1 port of the original Button component
 * (module 62987 in _reference/_original/_next/static/chunks).
 */
const variants: Record<string, string> = {
  primaryPill:
    "font-mouse-memoirs uppercase tracking-wide text-[1.05vw] max-md:text-[4vw] bg-mustard text-black px-[1.6vw] py-[.75vw] max-md:px-[6vw] max-md:py-[2.6vw] rounded-full hover:bg-black hover:text-beige transition-all duration-300 ease-out group flex items-center justify-center",
  outlinePill:
    "font-mouse-memoirs uppercase tracking-wide text-[1.05vw] max-md:text-[4vw] border border-black/20 text-black px-[1.6vw] py-[.75vw] max-md:px-[6vw] max-md:py-[2.6vw] rounded-full hover:bg-black hover:text-beige hover:border-black group transition-all duration-300 ease-out flex items-center justify-center",
  redPill:
    "font-mouse-memoirs hover:scale-105 transition-all duration-300 flex items-center justify-center text-[1.3vw] max-md:text-[4vw] uppercase tracking-wide text-beige bg-red px-[1.6vw] py-[.5vw] max-md:px-[5vw] max-md:py-[1.8vw] group rounded-full hover:bg-black",
  iconCircle:
    "size-[2vw] cursor-pointer max-md:size-[8.5vw] rounded-full bg-black/20 hover:bg-black/35 transition-colors grid place-items-center group active:scale-90 duration-100",
  cartFab:
    "relative size-[4.1vw] max-md:size-[14vw] rounded-full bg-red text-beige cursor-pointer border border-beige/15 grid place-items-center group hover:bg-black transition-colors",
  conceptCta:
    "font-mouse-memoirs flex items-center justify-center cursor-pointer uppercase tracking-wide text-[1.1vw] max-md:text-[4vw] bg-mustard text-black px-[1.6vw] py-[.6vw] max-md:px-[6vw] max-md:py-[2.2vw] rounded-full group hover:bg-black hover:text-beige transition-colors",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Record<string, unknown>;

export default function Button({
  variant,
  href,
  onClick,
  type = "button",
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const combined = `${variant ? (variants[variant] ?? "") : ""}${variant && className ? " " : ""}${className}`;

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={combined}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combined} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
