import Curve from "./Curve";
import AnimatedTitle from "./AnimatedTitle";

/**
 * Menu page hero — full-screen smoky burger photo, jelly curve into the next
 * section, floating smile badge and the popping "Eat like you mean it" title.
 */
export default function MenuHero() {
  return (
    <section data-nav-dark="true" className="  w-full  relative max-md:h-[80vh] h-screen">
      <Curve fill="#F5E3CD" flip />
      <img
        alt="menu hero"
        loading="lazy"
        width={1000}
        height={1000}
        decoding="async"
        className="h-full w-full object-cover"
        style={{ color: "transparent" }}
        src="/img-webp/smoky-burger.webp"
      />
      <div className="size-[13vw] max-md:size-[30vw] absolute top-[13vw] max-md:top-[90vw] -translate-y-1/2 left-[25vw]">
        <img
          alt="burger"
          width={1000}
          height={1000}
          decoding="async"
          className="h-full w-full object-contain"
          style={{ color: "transparent" }}
          src="/img-webp/smile.png"
        />
      </div>
      <AnimatedTitle
        scroll={false}
        as="h1"
        delay={0}
        className="text-stroke-180 w-[60vw] max-md:mb-[12vw] heading300 max-md:w-full text-center uppercase leading-[.85] text-[#F4A804] absolute left-1/2 -translate-x-1/2 bottom-[12vw]"
        split="words"
      >
        Eat like you mean it
      </AnimatedTitle>
    </section>
  );
}
