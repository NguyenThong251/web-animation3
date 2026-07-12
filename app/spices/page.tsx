import type { Metadata } from "next";
import SpicesHero from "@/components/spices/SpicesHero";
import FarmToBite from "@/components/spices/FarmToBite";
import StoryOfEveryBite from "@/components/spices/StoryOfEveryBite";
import StoryOfEveryBiteMobile from "@/components/spices/StoryOfEveryBiteMobile";
import CtaSection from "@/components/spices/CtaSection";

export const metadata: Metadata = {
  title: "Our Spices & Ingredients | CRAV Burgers",
  description:
    "Discover the secret behind our bold flavors. We source only the finest organic ingredients and spices, maintaining a farm-to-bite philosophy since 1997.",
};

export default function SpicesPage() {
  return (
    <>
      <SpicesHero />
      <FarmToBite />
      <StoryOfEveryBite />
      <StoryOfEveryBiteMobile />
      <CtaSection />
    </>
  );
}
