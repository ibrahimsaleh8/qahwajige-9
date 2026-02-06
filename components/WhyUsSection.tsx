import { WhyUsSectionData } from "@/lib/responseType";
import { Award, Clock, MapPin, User, LucideIcon } from "lucide-react";
import WhyUsImage from "./AnimatedComponents/WhyUsImage";
const iconMap: Record<string, LucideIcon> = {
  award: Award,
  clock: Clock,
  shield: MapPin,
  sparkles: User,
  Award,
  Clock,
  Shield: Award,
  Sparkles: User,
};

export function WhyUsSection({
  description,
  features,
  label,
  title,
}: WhyUsSectionData) {
  return (
    <section id="about" className="py-20 px-4 bg-[hsl(var(--color-second-bg))]">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content - RTL: right side */}
          <div className="bg-slate-900/70 rounded-3xl p-8 lg:p-10 shadow-[0_18px_45px_rgba(15,23,42,0.65)] text-slate-100">
            <p className="text-main-color flex mb-5 bg-main-color/10 border border-main-color/40 w-fit px-6 py-2.5 rounded-full text-sm md:text-base max-w-2xl shadow-sm">
              {label}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 text-white">
              {title}
            </p>
            {description && (
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                {description}
              </p>
            )}
            <ul className="space-y-5">
              {features &&
                features.map((feature) => {
                  const IconComponent =
                    iconMap[
                      feature.icon?.toLowerCase() as keyof typeof iconMap
                    ] ||
                    iconMap[feature.icon as keyof typeof iconMap] ||
                    Award;
                  return (
                    <li key={feature.title} className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-main-color/15 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-main-color" />
                      </div>
                      <div>
                        <p className="font-bold text-white mb-0.5">
                          {feature.title}
                        </p>
                        {feature.description && (
                          <p className="text-slate-300 text-sm">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* Image - RTL: left side */}
          <WhyUsImage />
        </div>
      </div>
    </section>
  );
}
