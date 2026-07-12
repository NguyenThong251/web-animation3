import type { Metadata } from "next";
import CartWidget from "@/components/menu/CartWidget";
import MenuHero from "@/components/menu/MenuHero";
import MenuList from "@/components/menu/MenuList";
import CtaSection from "@/components/menu/CtaSection";
import "@/components/menu/menu.css";

export const metadata: Metadata = {
  title: "Artisan Burger Menu | CRAV Burgers",
  description:
    "Explore our selection of premium smashed burgers, hand-crafted with fresh, organic ingredients. From classic cheeseburgers to our signature CRAV specials.",
};

export default function MenuPage() {
  return (
    <>
      <CartWidget />
      <MenuHero />
      <MenuList />
      <CtaSection />
    </>
  );
}
