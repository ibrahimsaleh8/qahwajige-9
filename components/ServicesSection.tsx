import { ServicesSectionData } from "@/lib/responseType";
import { Coffee, RefreshCw, Heart, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Users: RefreshCw,
  Heart,
  Building2: Coffee,
};

export default function ServicesSection({
  description,
  items,
  label,
  title,
}: ServicesSectionData) {
  return (
    <section
      className="py-20 px-4 bg-[hsl(var(--color-main-background))]"
      id="services">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="text-main-color flex mb-5 bg-main-color/10 border border-main-color/40 w-fit px-6 py-2.5 rounded-full text-sm md:text-base max-w-2xl mx-auto shadow-sm">
            {label}
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {title}
          </p>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items &&
            items.map((card) => {
              const IconComponent =
                iconMap[card.icon as keyof typeof iconMap] || Coffee;
              return (
                <div
                  key={card.title}
                  className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 shadow-[0_18px_45px_rgba(15,23,42,0.65)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.9)] transition-all duration-300 text-right">
                  <div className="w-14 h-14 bg-main-color/10 rounded-2xl flex items-center justify-center mb-6 text-main-color shadow-sm">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <p className="text-xl font-bold text-white mb-3">
                    {card.title}
                  </p>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4">
                    <span>خدمة متكاملة وفق أعلى المعايير</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
