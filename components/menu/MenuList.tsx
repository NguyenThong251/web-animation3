"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import Copy from "./Copy";

gsap.registerPlugin(ScrollTrigger);

interface MenuItem {
  name: string;
  price: string;
  image: string;
  detail: string;
  quick: { bun: string; patty: string; spice: string; time: string };
  nutrition: { calories: number; protein: string };
}

// Exact menu data from the original bundle (module 43072)
const MENU_ITEMS: MenuItem[] = [
  {
    name: "Classic Burger",
    price: "$16",
    image: "/burgers/1b.png",
    detail: "Smashed beef · cheddar · house sauce",
    quick: { bun: "Brioche", patty: "Beef", spice: "Mild", time: "10–12 min" },
    nutrition: { calories: 720, protein: "32g" },
  },
  {
    name: "Spicy Jalapeño Burger",
    price: "$18",
    image: "/burgers/2b.png",
    detail: "Jalapeño · pepper jack · spicy mayo",
    quick: { bun: "Brioche", patty: "Beef", spice: "Hot", time: "12–14 min" },
    nutrition: { calories: 810, protein: "34g" },
  },
  {
    name: "Bacon Cheese Burger",
    price: "$21",
    image: "/burgers/3b.png",
    detail: "Crispy bacon · cheddar · caramel onions",
    quick: { bun: "Brioche", patty: "Beef", spice: "Mild", time: "12–15 min" },
    nutrition: { calories: 900, protein: "37g" },
  },
  {
    name: "Veggie Delight Burger",
    price: "$15",
    image: "/burgers/4b.png",
    detail: "Veggie patty · fresh crunch · house sauce",
    quick: { bun: "Sesame", patty: "Veggie", spice: "Mild", time: "10–12 min" },
    nutrition: { calories: 620, protein: "17g" },
  },
  {
    name: "BBQ Ranch Burger",
    price: "$19",
    image: "/burgers/5b.png",
    detail: "BBQ glaze · ranch · crispy onions",
    quick: { bun: "Brioche", patty: "Beef", spice: "Medium", time: "12–14 min" },
    nutrition: { calories: 870, protein: "36g" },
  },
  {
    name: "Mushroom Swiss Burger",
    price: "$20",
    image: "/burgers/6b.png",
    detail: "Sautéed mushrooms · swiss · garlic aioli",
    quick: { bun: "Brioche", patty: "Beef", spice: "Mild", time: "12–14 min" },
    nutrition: { calories: 830, protein: "33g" },
  },
];

interface CardProps extends MenuItem {
  onAddToCart: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

function MenuCard({ name, price, image, quick, nutrition, onAddToCart, cardRef }: CardProps) {
  return (
    <div ref={cardRef} className="opacity-0 w-full">
      <div className="group h-[35vw] max-md:h-[70vw] w-full rounded-[2vw] overflow-hidden bg-white relative max-md:rounded-[5vw] shrink-0  translate-y-[4vw] transition-all duration-500 ">
        <div
          className="absolute w-full left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none will-change-transform"
          style={{ height: "6vw", transition: "transform 0.44s cubic-bezier(.4,1.6,.7,.95)" }}
          aria-hidden="true"
        >
          <div className="flex w-full h-[3vw] max-md:h-[7vw] transition-all duration-600">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-full w-[8.33%] max-md:w-[8.33%] transition-colors duration-500 ${i % 2 === 0 ? "bg-red" : "bg-white"}`}
              />
            ))}
          </div>
          <div className="flex w-full h-[3vw] max-md:h-[7vw] transition-all duration-600">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-full w-[8.33%] max-md:w-[8.33%] transition-colors duration-500 ${i % 2 === 1 ? "bg-red" : "bg-white"}`}
              />
            ))}
          </div>
        </div>
        <div className="size-full relative z-20 flex flex-col justify-between p-[2vw] max-md:p-[4vw]">
          <div className="absolute left-[2vw] z-200 right-[2vw] bottom-[2vw] max-md:hidden pointer-events-none">
            <div className="rounded-[1.2vw] border border-black/10 bg-white/85 backdrop-blur-md px-[1.2vw] py-[1vw] opacity-0 translate-y-[1vw] transition-all duration-400 ease-[cubic-bezier(.45,.85,.34,1.12)] group-hover:opacity-100 group-hover:translate-y-0 ">
              <div className="flex items-center justify-between gap-[1vw]">
                <p className="text40 uppercase tracking-[.18em] text-black/60">Quick details</p>
                <p className="text40 uppercase text-black/60">{quick?.time}</p>
              </div>
              <div className="mt-[.6vw] grid grid-cols-3 gap-[.6vw]">
                <div className="rounded-[.9vw] bg-black/5 border border-black/10 px-[.8vw] py-[.6vw] transition-all duration-300">
                  <p className="text40 uppercase text-black/60">Bun</p>
                  <p className="text40 uppercase text-black/80">{quick?.bun}</p>
                </div>
                <div className="rounded-[.9vw] bg-black/5 border border-black/10 px-[.8vw] py-[.6vw] transition-all duration-300">
                  <p className="text40 uppercase text-black/60">Patty</p>
                  <p className="text40 uppercase text-black/80">{quick?.patty}</p>
                </div>
                <div className="rounded-[.9vw] bg-black/5 border border-black/10 px-[.8vw] py-[.6vw] transition-all duration-300">
                  <p className="text40 uppercase text-black/60">Spice</p>
                  <p className="text40 uppercase text-black/80">{quick?.spice}</p>
                </div>
              </div>
              <div className="mt-[.7vw] flex flex-wrap gap-[.6vw]">
                <span className="text40 uppercase px-[.7vw] py-[.35vw] rounded-full bg-beige border border-black/10 text-black/70 transition-all">
                  Calories: {nutrition?.calories}
                </span>
                <span className="text40 uppercase px-[.7vw] py-[.35vw] rounded-full bg-beige border border-black/10 text-black/70 transition-all">
                  Protein: {nutrition?.protein}
                </span>
              </div>
            </div>
          </div>
          <button
            data-cursor-hide="true"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="size-[3vw] p-[.5vw] max-md:p-[1vw] aspect-square max-md:size-[8vw] rounded-full bg-mustard grid place-items-center ml-auto transition-transform duration-400 hover:rotate-115 hover:scale-110 cursor-pointer  will-change-transform"
            aria-label={`Add ${name} to cart`}
          >
            <svg
              className="w-full h-full object-contain"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div className="size-[25vw] pointer-events-none max-md:size-[38vw] mx-auto transition-transform duration-700 will-change-transform group-hover:scale-[1.054]">
            <img
              alt={name}
              loading="lazy"
              width={1000}
              height={1000}
              decoding="async"
              className="h-full w-full object-contain"
              style={{
                color: "transparent",
                transition: "transform 0.7s cubic-bezier(.5,1.45,.2,1)",
                willChange: "transform",
              }}
              src={image}
            />
          </div>
          <div className="w-full flex items-end justify-between text40 max-md:text-[5vw]">
            <p className="text-red text60">{name}</p>
            <p className="text60 max-md:mr-[2vw]">{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "Our Finest Burger Picks" grid (original module 43072). Cards fade/slide in
 * with a staggered ScrollTrigger reveal; the add-to-cart button pulses the
 * card and dispatches the crav:add-to-cart event.
 */
export default function MenuList() {
  const [, setToast] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!cardsRef.current.length) return;
    const triggers: ScrollTrigger[] = [];
    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, y: 64 });
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.72,
              delay: (i % 3) * 0.1 + 0.05 * Math.floor(i / 3),
              ease: "power3.out",
              overwrite: "auto",
            });
          },
        })
      );
    });
    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const handleAddToCart = (item: MenuItem, index: number) => {
    try {
      window.dispatchEvent(
        new CustomEvent("crav:add-to-cart", { detail: { item } })
      );
    } catch {}
    const card = cardsRef.current[index];
    if (card) {
      gsap.fromTo(
        card,
        { scale: 1 },
        { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1, ease: "back.out(2)" }
      );
    }
    setToast(true);
    window.setTimeout(() => setToast(false), 2000);
  };

  return (
    <section className="w-full relative z-100 h-fit mb-[5vw] -mt-[.5vw] self">
      <div className="flex relative z-100 -mt-[5vw] justify-between items-end max-md:flex-col max-md:items-start max-md:gap-[2vw] max-md:-mt-[8vw]">
        <div className="space-y-[2vw] w-fit -mt-[5vw] max-md:mt-0">
          <p className="text-mustard-dark -rotate-7 ml-[1vw] -translate-y-[2vw]  uppercase text-stroke-180 text60 max-md:rotate-0 font-modak leading-[.9]! max-md:text-[8vw]">
            The best
          </p>
          <AnimatedTitle
            as="h2"
            className="text-red text-stroke-180-menu heading300 uppercase leading-[.75] max-md:leading-[.85] max-md:text-[9vw]"
            split="words"
            scrollStart="top 88%"
          >
            {"Our Finest\nBurger Picks"}
          </AnimatedTitle>
        </div>
        <Copy>
          <p className="text40 max-md:text-[6vw] ml-[1vw] max-md:block uppercase hidden">
            {MENU_ITEMS.length} items
          </p>
        </Copy>
        <Copy>
          <p className="text40 max-md:hidden uppercase">{MENU_ITEMS.length} items</p>
        </Copy>
      </div>
      <div className="w-full grid grid-cols-3 gap-[2vw] mt-[6vw] max-md:grid-cols-1 max-md:gap-[6vw] max-md:mt-[4vw]">
        {MENU_ITEMS.map((item, i) => (
          <MenuCard
            key={i}
            {...item}
            onAddToCart={() => handleAddToCart(item, i)}
            cardRef={(el) => {
              cardsRef.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
