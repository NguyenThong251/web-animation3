"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import Button from "./Button";
import RollText from "./RollText";
import ConceptPopup from "./ConceptPopup";

type FormFields = { email: string; message: string };

/**
 * Contact form with validation, shake-on-error and the "Concept Website"
 * success popup. 1:1 port of the original form block inside module 88720.
 * Submitting never sends anything anywhere — after a fake 1.5s "SENDING..."
 * state the original concept-notice popup is shown (original behavior).
 */
export default function ContactForm() {
  const [formData, setFormData] = useState<FormFields>({ email: "", message: "" });
  const [errors, setErrors] = useState<FormFields>({ email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [popupOpen, setPopupOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<FormFields> = {};
    if (!formData.email) {
      newErrors.email = "WHERE SHOULD WE SEND THE REPLY?";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "THAT EMAIL LOOKS A BIT RAW...";
    }
    if (!formData.message) {
      newErrors.message = "FORGOT TO ADD THE SAUCE?";
    } else if (formData.message.length < 10) {
      newErrors.message = "COULD BE A LITTLE JUICIER...";
    }
    setErrors({ email: newErrors.email ?? "", message: newErrors.message ?? "" });
    if (Object.keys(newErrors).length !== 0) {
      gsap.to(formRef.current, {
        // GSAP array-keyframe value, exactly as in the original bundle
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut",
      } as unknown as gsap.TweenVars);
      return;
    }
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setPopupOpen(true);
      setFormData({ email: "", message: "" });
      setTimeout(() => setStatus("idle"), 1000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[35vw] max-md:max-w-full p-[2vw] max-md:p-[4vw] z-999! relative">
      <ConceptPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title="Concept Website"
        badge="Notice"
        showCreators={true}
        variant="white"
      >
        <div className="space-y-[1vw] max-md:space-y-[3vw]">
          <p>
            This is a concept website created by Anyflow Agency. If you are looking for
            brand design and development like this, you can reach out to us at
            anyflowagency@gmail.com
          </p>
        </div>
      </ConceptPopup>
      <form
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-[1vw] max-md:gap-[8vw] relative z-10"
      >
        <div className="relative group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="YOUR BEST EMAIL"
            className={`w-full bg-transparent border-b outline-none py-[1vw] max-md:py-[3vw] font-mouse-memoirs text-[1.4vw] max-md:text-[5vw] text-white transition-all duration-300 placeholder:text-white/30 uppercase tracking-widest ${
              errors.email ? "border-mustard" : "border-white/20 focus:border-mustard"
            }`}
          />
          {errors.email && (
            <p className="absolute left-0 -bottom-[1.2vw] max-md:-bottom-[5vw] text-[0.8vw] max-md:text-[3vw] font-mouse-memoirs text-mustard uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
              {errors.email}
            </p>
          )}
        </div>
        <div className="relative group">
          <textarea
            name="message"
            rows={2}
            maxLength={80}
            value={formData.message}
            onChange={handleChange}
            placeholder="TELL US YOUR CRAVING..."
            className={`w-full bg-transparent border-b outline-none py-[1vw] max-md:py-[3vw] font-mouse-memoirs text-[1.4vw] max-md:text-[5vw] text-white transition-all duration-300 placeholder:text-white/30 uppercase tracking-widest resize-none min-h-[4vw] max-md:min-h-[15vw] ${
              errors.message ? "border-mustard" : "border-white/20 focus:border-mustard"
            }`}
          />
          {errors.message && (
            <p className="absolute left-0 -bottom-[1.2vw] max-md:-bottom-[5vw] text-[0.8vw] max-md:text-[3vw] font-mouse-memoirs text-mustard uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
              {errors.message}
            </p>
          )}
        </div>
        <div className="mt-[2vw]">
          <Button
            type="submit"
            variant="conceptCta"
            disabled={status === "sending"}
            className="w-full !text-[1.5vw] !py-[1vw] group max-md:!text-[5vw] max-md:!py-[3vw]"
          >
            <RollText> {status === "sending" ? "SENDING..." : "SEND CRAVING"}</RollText>
          </Button>
        </div>
      </form>
    </div>
  );
}
