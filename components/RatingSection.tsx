"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { APP_URL } from "@/lib/ProjectId";
import { motion } from "framer-motion";

const STORAGE_KEY = (projectId: string) => `rating_${projectId}`;

interface RatingSectionProps {
  projectId: string;
  averageRating: number;
  totalRatings: number;
}

export default function RatingSection({
  projectId,
  averageRating,
  totalRatings,
}: RatingSectionProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY(projectId));
      if (stored) {
        const value = parseInt(stored, 10);
        if (value >= 1 && value <= 5) {
          setSubmitted(value);
        }
      }
    } catch {
      // localStorage not available
    }
    setMounted(true);
  }, [projectId]);

  const displayRating = hoverRating || selectedRating;

  const handleStarClick = async (value: number) => {
    if (submitted !== null) return;

    setSelectedRating(value);
    setIsLoading(true);

    try {
      const res = await fetch(`${APP_URL}/api/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, stars: value }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(value);
        try {
          localStorage.setItem(STORAGE_KEY(projectId), String(value));
        } catch {
          // localStorage not available
        }
        Toast({ icon: "success", message: "شكراً لتقييمك!" });
      } else {
        setSelectedRating(0);
        Toast({
          icon: "error",
          message: data.message || data.error || "حدث خطأ في التقييم",
        });
      }
    } catch {
      setSelectedRating(0);
      Toast({ icon: "error", message: "حدث خطأ في التقييم" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (value: number, interactive = false) => (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="relative inline-block">
          {interactive ? (
            <button
              type="button"
              disabled={isLoading || !mounted}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 rounded-lg transition-all duration-200 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              style={{
                outline: "none",
              }}
              aria-label={`تقييم ${star} من 5`}>
              <Star
                className="w-10 h-10 md:w-12 md:h-12 transition-all duration-200"
                style={{
                  fill: star <= value ? "#38bdf8" : "#1f2937",
                  color: star <= value ? "#38bdf8" : "#334155",
                  filter:
                    star <= value
                      ? "drop-shadow(0 0 6px rgba(56,189,248,0.5))"
                      : "none",
                }}
              />
            </button>
          ) : (
            <Star
              className="w-10 h-10 md:w-12 md:h-12"
              style={{
                fill: star <= value ? "#38bdf8" : "#1f2937",
                color: star <= value ? "#38bdf8" : "#334155",
                filter:
                  star <= value
                    ? "drop-shadow(0 0 6px rgba(56,189,248,0.5))"
                    : "none",
              }}
            />
          )}
        </span>
      ))}
    </div>
  );

  return (
    <section
      id="rating"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: "var(--main-background, #020617)" }}>
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

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(56,189,248,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: "var(--card-background, #020617)",
            border: "1px solid #334155",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(56,189,248,0.08)",
          }}>
          {/* Top inner glow */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)",
            }}
          />

          <div className="p-8 md:p-12 text-center">
            {/* Section label */}
            <span
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{
                background: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.25)",
                color: "#38bdf8",
              }}>
              آراء العملاء
            </span>

            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight"
              style={{ color: "#f1f5f9" }}>
              قيّم تجربتك معنا
            </h2>

            <p
              className="text-base md:text-lg mb-8 max-w-xl mx-auto"
              style={{ color: "#9ca3af" }}>
              رأيك يهمنا! ساعدنا في التحسين من خلال تقييم تجربتك
            </p>

            {/* Stats row */}
            {(averageRating > 0 || totalRatings > 0) && (
              <div
                className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 py-4 px-6 rounded-2xl mx-auto w-fit"
                style={{
                  background: "rgba(56,189,248,0.05)",
                  border: "1px solid rgba(56,189,248,0.15)",
                }}>
                {averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: "#f1f5f9" }}>
                      {averageRating.toFixed(1)}
                    </span>
                    <span style={{ color: "#9ca3af" }}>/ 5</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4"
                          style={{
                            fill:
                              star <= Math.round(averageRating)
                                ? "#38bdf8"
                                : "#1f2937",
                            color:
                              star <= Math.round(averageRating)
                                ? "#38bdf8"
                                : "#334155",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {totalRatings > 0 && (
                  <div
                    className="text-sm md:text-base"
                    style={{ color: "#9ca3af" }}>
                    <span
                      className="font-semibold"
                      style={{ color: "#38bdf8" }}>
                      {totalRatings}
                    </span>{" "}
                    {totalRatings === 1 ? "تقييم" : "تقييمات"}
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div
              className="mx-auto mb-8 rounded-full"
              style={{
                width: "64px",
                height: "2px",
                background: "linear-gradient(90deg, #0071a5, #38bdf8)",
              }}
            />

            {submitted !== null && mounted ? (
              <div className="py-4">
                {renderStars(submitted, false)}
                <p
                  className="font-semibold mt-5 text-lg"
                  style={{ color: "#38bdf8" }}>
                  شكراً لتقييمك!
                </p>
                <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                  نسعد بتقييمك وسنعمل على تحسين تجربتك
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {renderStars(displayRating || 0, true)}
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  {mounted && !isLoading
                    ? "انقر على النجم المناسب للتقييم"
                    : ""}
                  {isLoading && (
                    <span style={{ color: "#38bdf8" }}>جاري الإرسال...</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
