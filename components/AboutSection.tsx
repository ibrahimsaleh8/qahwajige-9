import { AboutSectionData } from "@/lib/responseType";
import { Star } from "lucide-react";
import AboutImage from "./AnimatedComponents/AboutImage";

export default function AboutSection({
  description1,
  label,
  title,
  image,
}: AboutSectionData) {
  return (
    <section
      className="py-20 md:py-24 px-4 bg-[hsl(var(--color-second-bg))]"
      id="about">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Image column - left */}
          <div className="order-2 lg:order-1">
            {image && (
              <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.75)]">
                <AboutImage imageUrl={image} />
                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 right-4 left-4 flex flex-wrap justify-between gap-3 text-xs md:text-sm text-white z-10">
                  <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-main-color" />
                    <span>فريق متخصص في ضيافة المناسبات</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
                    <span className="font-semibold">+500</span>
                    <span>مناسبة ناجحة</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text column - right (RTL) */}
          <div className="order-1 lg:order-2 text-center lg:text-right text-slate-100">
            {label && (
              <p className="inline-flex items-center bg-main-color/10 text-main-color font-semibold text-xs md:text-sm rounded-full px-4 py-2 mb-4 shadow-sm border border-main-color/40">
                <span className="w-2 h-2 rounded-full bg-main-color ml-2" />
                <span>{label}</span>
              </p>
            )}
            <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              {title}
            </p>

            {description1 && (
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 max-w-xl mx-auto lg:ml-auto lg:mr-0">
                {description1}
              </p>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-6">
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-right shadow-soft">
                <p className="text-xs text-slate-400 mb-1">خبرة ممتدة</p>
                <p className="text-2xl md:text-3xl font-extrabold text-main-color mb-1">
                  10+
                </p>
                <p className="text-slate-400 text-sm">سنوات في خدمة الضيافة</p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-right shadow-soft">
                <p className="text-xs text-slate-400 mb-1">مناسبات منوعة</p>
                <p className="text-2xl md:text-3xl font-extrabold text-main-color mb-1">
                  500+
                </p>
                <p className="text-slate-400 text-sm">حفلات ومناسبات ناجحة</p>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-right shadow-soft">
                <p className="text-xs text-slate-400 mb-1">رضا العملاء</p>
                <div className="flex items-center justify-start gap-1.5 mb-1">
                  <Star className="w-5 h-5 fill-main-color text-main-color" />
                  <span className="text-xl font-bold text-main-color">4.9</span>
                </div>
                <p className="text-slate-400 text-sm">متوسط التقييم العام</p>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              نهتم بأدق التفاصيل من أول فنجان قهوة حتى آخر ضيف، لنضمن لكم تجربة
              ضيافة لا تُنسى.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
