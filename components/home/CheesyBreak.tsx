import Jelly from "./Jelly";

export default function CheesyBreak() {
  return (
    <div className="h-[160vh] max-md:h-[70vh] w-full relative">
      <Jelly fill="#f91814" />
      <Jelly flip fill="#f5e3cd" className="max-md:!bottom-[-7vw]" />
      <img
        alt="CRAV Signature Cheesy Burger with dripping cheese"
        loading="lazy"
        width={1000}
        height={1000}
        decoding="async"
        className="h-full w-full object-cover"
        style={{ color: "transparent" }}
        src="/img-webp/cheesyBurger.webp"
      />
    </div>
  );
}
