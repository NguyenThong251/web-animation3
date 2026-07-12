import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";
import CtaSection from "@/components/contact/CtaSection";

export const metadata: Metadata = {
  title: "Contact Us | CRAV | CRAV Burgers",
  description:
    "Have a craving? Get in touch with CRAV Burgers. Visit us in Navarra, España, or reach out for inquiries and feedback.",
};

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <CtaSection />
    </>
  );
}
