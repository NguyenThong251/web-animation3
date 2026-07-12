import type { Metadata } from "next";
import { Modak, Mouse_Memoirs } from "next/font/google";
import "./globals.css";
import "../components/chrome/chrome.css";
import LenisProvider from "../components/chrome/LenisProvider";
import { AnimationProvider } from "../components/chrome/AnimationProvider";
import ChromeEffects from "../components/chrome/ChromeEffects";
import Preloader from "../components/chrome/Preloader";
import PageTransition from "../components/chrome/PageTransition";
import IngredientRope from "../components/chrome/IngredientRope";
import Navbar from "../components/chrome/Navbar";
import Footer from "../components/chrome/Footer";
import CookieConsent from "../components/chrome/CookieConsent";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
  display: "swap",
});

const mouseMemoirs = Mouse_Memoirs({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mouse-memoirs",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRAV | Artisan Smashed Burgers",
  description:
    "Experience the ultimate artisan smashed burgers at CRAV. Fresh ingredients, bold flavors, and zero guilt. Est. 1997 — Navarra, España.",
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "CRAV Burgers",
  image: "https://www.cravburgers.shop/img-webp/burgerwithhands.webp",
  "@id": "https://www.cravburgers.shop",
  url: "https://www.cravburgers.shop",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Navarra",
    addressCountry: "ES",
  },
  menu: "https://www.cravburgers.shop/menu",
  servesCuisine: "Artisan Burgers",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${modak.variable} ${mouseMemoirs.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          id="restaurant-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <LenisProvider>
          <AnimationProvider>
            <ChromeEffects />
            <Preloader />
            <PageTransition>
              <IngredientRope />
              <Navbar />
              {children}
              <Footer />
              <CookieConsent />
            </PageTransition>
          </AnimationProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
