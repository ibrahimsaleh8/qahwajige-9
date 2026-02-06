import { HeroSectionData } from "@/lib/responseType";
import Image from "next/image";
import HeroImage from "@/public/images/wider.jpg";
import HeroLinks from "./AnimatedComponents/HeroLinks";

export default function HeroSection({
  headline,
  subheadline,
  whatsApp,
}: HeroSectionData) {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[hsl(var(--color-main-background))]">
      {/* Full-width background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroImage}
          alt="Hero Image"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-slate-950/80" aria-hidden />
      </div>

      {/* Content over image - inspired by new design */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr] items-center gap-10">
          {/* Text content */}
          <div className="order-2 lg:order-1 text-center lg:text-right max-w-xl lg:ml-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-main-color" />
              <span className="text-sm md:text-base text-white/80">
                أصالة الضيافة السعودية
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
              {headline}
            </h1>
            <p className="text-white/85 text-base md:text-lg mb-8 leading-relaxed drop-shadow-sm max-w-xl mx-auto lg:mx-0">
              {subheadline}
            </p>
            <HeroLinks whatsApp={whatsApp} />
          </div>
          {/* Empty right column to mimic visual balance / future content */}
          <div className="order-1 lg:order-2 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
