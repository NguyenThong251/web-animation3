import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import CheesyBreak from "@/components/home/CheesyBreak";
import Ingredients from "@/components/home/Ingredients";
import MapDesktop from "@/components/home/MapDesktop";
import MapMobile from "@/components/home/MapMobile";
import Cta from "@/components/home/Cta";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "CRAV | Artisan Smashed Burgers",
  description:
    "Experience the ultimate artisan smashed burgers at CRAV. Fresh ingredients, bold flavors, and zero guilt. Est. 1997 — Navarra, España.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <CheesyBreak />
      <Ingredients />
      <MapDesktop />
      <MapMobile />
      <Cta />
    </>
  );
}
