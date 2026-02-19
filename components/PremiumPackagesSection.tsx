"use client";
import { motion } from "motion/react";
import { PackageData } from "@/lib/responseType";
import { Check, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function PremiumPackagesSection({
  whatsapp,
  packages,
}: {
  whatsapp: string;
  packages: PackageData[];
}) {
  const whatsappNumber = whatsapp.includes("+")
    ? whatsapp.split("+").join("")
    : whatsapp;
  const waLink = `https://wa.me/${whatsappNumber}?text=`;

  if (!packages?.length) return null;

  return (
    <section
      id="packages"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "var(--second-background, #02081a)" }}>
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #38bdf8, transparent)",
        }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #38bdf8, transparent)",
        }}
      />

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blob top-right */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Glow blob bottom-left */}
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-18 max-w-2xl mx-auto" dir="rtl">
          <span
            className="inline-block text-sm font-bold tracking-widest mb-3 uppercase"
            style={{ color: "#38bdf8" }}>
            باقاتنا
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-snug"
            style={{ color: "#f1f5f9" }}>
            اختر الباقة المناسبة لك
          </h2>
          {/* Cyan underline */}
          <div
            className="mx-auto rounded-full mb-4"
            style={{
              width: "64px",
              height: "3px",
              background: "linear-gradient(90deg, #0071a5, #38bdf8)",
            }}
          />
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "#9ca3af" }}>
            نقدم لك مجموعة متميزة من الباقات المصممة بعناية لتلبي احتياجاتك
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mx-auto w-full">
          {packages.map((pkg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              key={pkg.id}
              className="group relative flex flex-col h-full w-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
              style={{
                background: "var(--card-background, #020617)",
                border: "1px solid #334155",
                boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border =
                  "1px solid rgba(56,189,248,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 40px rgba(56,189,248,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border =
                  "1px solid #334155";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 20px rgba(0,0,0,0.4)";
              }}>
              {/* Top cyan accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, #0071a5, #38bdf8, #0071a5)",
                }}
              />

              {/* Image */}
              <div
                className="relative aspect-video overflow-hidden"
                style={{ background: "#1f2937" }}>
                {pkg.image ? (
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #1f2937 0%, #020617 100%)",
                    }}>
                    <span
                      className="text-5xl font-extrabold"
                      style={{ color: "rgba(56,189,248,0.3)" }}>
                      {pkg.title?.charAt(0) ?? "?"}
                    </span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(2,6,23,0.7) 0%, transparent 60%)",
                  }}
                />
                {/* Package badge */}
                <div className="absolute top-3 right-3" dir="rtl">
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow"
                    style={{
                      background: "rgba(56,189,248,0.15)",
                      border: "1px solid rgba(56,189,248,0.4)",
                      color: "#38bdf8",
                      backdropFilter: "blur(8px)",
                    }}>
                    الباقة {index + 1}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 md:p-7" dir="rtl">
                <h3
                  className="text-xl md:text-2xl font-extrabold mb-4 text-right"
                  style={{ color: "#f1f5f9" }}>
                  {pkg.title}
                </h3>

                {/* Cyan divider */}
                <div
                  className="rounded-full mb-4 mr-0"
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, #38bdf8, #0071a5)",
                  }}
                />

                {/* Features */}
                {pkg.features?.length > 0 ? (
                  <div className="flex-1 mb-6">
                    <p
                      className="text-sm font-bold mb-3 text-right"
                      style={{ color: "#38bdf8" }}>
                      المميزات :
                    </p>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-right">
                          <span
                            className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              background: "rgba(56,189,248,0.1)",
                              border: "1px solid rgba(56,189,248,0.3)",
                            }}>
                            <Check
                              className="w-3 h-3"
                              style={{ color: "#38bdf8" }}
                              strokeWidth={3}
                            />
                          </span>
                          <span
                            className="text-sm md:text-base leading-relaxed"
                            style={{ color: "#9ca3af" }}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex-1 mb-6" />
                )}

                {/* CTA Button */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full py-3.5 px-6 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #0071a5, #38bdf8)",
                    color: "#ffffff",
                    boxShadow: "0 4px 20px rgba(56,189,248,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 6px 28px rgba(56,189,248,0.4)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 20px rgba(56,189,248,0.25)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                  }}>
                  <MessageCircle className="w-5 h-5" />
                  اطلب الخدمة عبر واتساب
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
