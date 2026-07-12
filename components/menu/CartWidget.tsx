"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import ConceptPopup from "../contact/ConceptPopup";
import Button from "../contact/Button";
import TextRoll from "./TextRoll";

interface CartItem {
  key: string;
  name: string;
  price: string;
  qty: number;
}

/**
 * Floating cart FAB + popover + "Added to Cart" toast + checkout concept
 * popup. 1:1 port of the original module 68763
 * (_reference/_original/_next/static/chunks/007kg070x-b~l.js).
 * Mounted as the first child of the /menu page (per the RSC flight payload).
 * Listens for the "crav:add-to-cart" CustomEvent dispatched by MenuList.
 */
export default function CartWidget() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const fabRef = useRef<HTMLButtonElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onAdd = (e: Event) => {
      const item = (e as CustomEvent<{ item?: { name?: string; price?: string } }>)
        ?.detail?.item;
      const name = item?.name ?? "Item";
      const price = item?.price ?? "";
      setItems((prev) => {
        const idx = prev.findIndex((it) => it.key === name);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [...prev, { key: name, name, price, qty: 1 }];
      });
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    };
    window.addEventListener("crav:add-to-cart", onAdd);
    return () => window.removeEventListener("crav:add-to-cart", onAdd);
  }, []);

  const count = items.reduce((acc, it) => acc + (it.qty || 0), 0);
  const total = items.reduce((acc, it) => {
    const n = Number(
      String(typeof it.price === "string" ? it.price : "").replace(/[^0-9.]/g, "")
    );
    return acc + (Number.isFinite(n) ? n : 0) * (it.qty || 0);
  }, 0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (overlay && panel) {
      if (!tlRef.current) {
        gsap.set(overlay, { opacity: 0, pointerEvents: "none" });
        gsap.set(panel, {
          opacity: 0,
          y: 14,
          scale: 0.96,
          transformOrigin: "100% 100%",
        });
        const tl = gsap.timeline({ paused: true, defaults: { overwrite: "auto" } });
        tl.add(() => gsap.set(overlay, { pointerEvents: "auto" }), 0)
          .to(overlay, { opacity: 1, duration: 0.22, ease: "power2.out" }, 0)
          .to(
            panel,
            { opacity: 1, y: 0, scale: 1, duration: 0.34, ease: "back.out(2.1)" },
            0.06
          );
        tl.eventCallback("onReverseComplete", () => {
          gsap.set(overlay, { pointerEvents: "none" });
        });
        tlRef.current = tl;
      }
      if (open) tlRef.current.play();
      else tlRef.current.reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!lenis) return;
    if (open || checkoutOpen) lenis.stop();
    else lenis.start();
    return () => {
      lenis.start();
    };
  }, [lenis, open, checkoutOpen]);

  const decreaseItem = (key: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.key === key);
      if (idx < 0) return prev;
      const item = prev[idx];
      if (item.qty <= 1) return prev.filter((it) => it.key !== key);
      const next = [...prev];
      next[idx] = { ...item, qty: item.qty - 1 };
      return next;
    });
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  };

  return (
    <>
      <ConceptPopup
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title="Checkout"
        badge="Concept"
      >
        This is a concept website created by Anyflow Agency. If you are looking
        for brand design and development like this, you can reach out to us at
        anyflowagency@gmail.com
      </ConceptPopup>
      <div
        ref={overlayRef}
        onClick={() => {
          if (open) setOpen(false);
        }}
        className="fixed inset-0 z-998 bg-red/30 backdrop-blur-md"
        style={{ opacity: 0, pointerEvents: "none" }}
        aria-hidden={true}
      />
      <div
        data-cursor-hide="true"
        className="fixed bottom-[1.6vw] right-[1.6vw] max-md:bottom-[4vw] max-md:right-[4vw] z-999"
      >
        <div className="relative pointer-events-auto flex items-center">
          <div
            className={`absolute right-[calc(100%+1vw)] top-1/2 -translate-y-1/2 z-100 flex items-center gap-[1vw] px-[1.2vw] py-[.6vw] max-md:px-[4vw] max-md:py-[2vw] rounded-full bg-red text-white font-mouse-memoirs uppercase tracking-widest text-[.85vw] max-md:text-[3.2vw] shadow-lg transition-all duration-500 ease-out whitespace-nowrap ${
              toast && !open
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-[1vw] scale-90 pointer-events-none"
            }`}
          >
            Added to Cart
          </div>
          <div
            ref={panelRef}
            className="absolute bottom-[calc(100%+1vw)] right-0 w-[20vw] max-md:w-[92vw]"
            style={{
              pointerEvents: open ? "auto" : "none",
              visibility: open ? "visible" : "hidden",
            }}
          >
            <div className="rounded-[1.4vw] max-md:rounded-[5vw] bg-red text-beige shadow-[0_1vw_3vw_rgba(27,27,27,.25)] border border-beige/15 overflow-hidden">
              <div className="px-[1.4vw] py-[1.2vw] max-md:px-[5vw] max-md:py-[4vw]">
                <div className="flex items-center justify-between">
                  <p className="font-mouse-memoirs uppercase tracking-[.2em] text-[.85vw] max-md:text-[3.4vw] text-beige/70">
                    Your cart {count}
                  </p>
                  <p className="font-mouse-memoirs uppercase tracking-[.12em] text-[.85vw] max-md:text-[3.4vw] text-beige/85">
                    Total: ${total.toFixed(2)}
                  </p>
                </div>
                <p className="mt-[.6vw] max-md:mt-[2vw] font-mouse-memoirs uppercase text-[1.1vw] max-md:text-[4.2vw] leading-tight text-beige/95">
                  {count
                    ? "Your burgers are ready."
                    : "Hungry? Add items to start your order."}
                </p>
                <div
                  data-lenis-prevent={true}
                  className="mt-[1vw] max-md:mt-[3.5vw] max-h-[17vw] overflow-y-scroll max-md:max-h-[42vw] overflow-auto pr-[.2vw] max-md:pr-[1vw] space-y-[.6vw] max-md:space-y-[2.4vw]"
                >
                  {items.length ? (
                    items.map((item, i) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-[.8vw] max-md:gap-[3vw] rounded-[1vw] max-md:rounded-[4vw] bg-beige/10 border border-beige/15 px-[1vw] py-[.75vw] max-md:px-[4vw] max-md:py-[2.6vw]"
                        style={{ zIndex: 20 - i }}
                      >
                        <div className="min-w-0">
                          <p className="font-mouse-memoirs uppercase text-[1vw] max-md:text-[3.9vw] text-beige leading-tight truncate">
                            {item.name}
                          </p>
                          <p className="font-mouse-memoirs uppercase text-[.85vw] max-md:text-[3.4vw] text-beige/70 tracking-wide">
                            {item.price} · Qty {item.qty}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-[.45vw] max-md:gap-[2vw]">
                          <Button
                            data-cursor-hide="true"
                            variant="iconCircle"
                            type="button"
                            onClick={(e: React.MouseEvent) => {
                              const el = e.currentTarget;
                              el.classList.add("scale-90");
                              setTimeout(() => el.classList.remove("scale-90"), 120);
                              decreaseItem(item.key);
                            }}
                            aria-label={`Decrease ${item.name}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-[55%] h-[55%]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.6"
                              strokeLinecap="round"
                            >
                              <path d="M6 12h12" />
                            </svg>
                          </Button>
                          <Button
                            data-cursor-hide="true"
                            variant="iconCircle"
                            type="button"
                            onClick={(e: React.MouseEvent) => {
                              const el = e.currentTarget;
                              el.classList.add("scale-90");
                              setTimeout(() => el.classList.remove("scale-90"), 120);
                              removeItem(item.key);
                            }}
                            aria-label={`Remove ${item.name}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-[55%] h-[55%]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M9 3h6" />
                              <path d="M4 6h16" />
                              <path d="M7 6l1 14h8l1-14" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1vw] max-md:rounded-[4vw] bg-beige/10 border border-beige/15 px-[1vw] py-[.9vw] max-md:px-[4vw] max-md:py-[3.2vw]">
                      <p className="font-mouse-memoirs uppercase text-[.95vw] max-md:text-[3.8vw] text-beige/80 tracking-wide">
                        No items yet
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  data-cursor-hide="true"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className="mt-[1vw] cursor-pointer max-md:mt-[3.5vw] w-full font-mouse-memoirs uppercase tracking-wide group hover:bg-black hover:text-beige text-[1vw] flex items-center justify-center max-md:text-[3.9vw] px-[1.2vw] py-[.7vw] max-md:px-[4.8vw] max-md:py-[2.2vw] rounded-full transition-colors bg-mustard text-black"
                  disabled={!count}
                >
                  <TextRoll>Checkout</TextRoll>
                </Button>
              </div>
            </div>
          </div>
          <Button
            ref={fabRef}
            data-cursor-hide="true"
            variant="cartFab"
            type="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-label="Cart (UI only)"
            aria-expanded={open}
          >
            <span className="absolute -top-[.35vw] -right-[.35vw] max-md:-top-[1.2vw] max-md:-right-[1.2vw] size-[1.5vw] max-md:size-[5.5vw] rounded-full bg-mustard text-black grid place-items-center font-mouse-memoirs text-[.9vw] max-md:text-[3.4vw] leading-none border border-black/10">
              {count}
            </span>
            <svg
              viewBox="0 0 24 24"
              className="w-[52%] h-[52%]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6h15l-1.5 9h-11z" />
              <path d="M6 6l-2-2" />
              <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              <path d="M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              <path d="M8.5 10.5h10" />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
}
