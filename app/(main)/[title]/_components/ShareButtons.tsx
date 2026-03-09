"use client";

import { useEffect, useState } from "react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsTelegram } from "react-icons/bs";

type Props = {
  title: string;
};

export default function ShareButtons({ title }: Props) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm text-[#868686]">شارك المقالة:</span>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مشاركة على واتساب"
        className="px-3 py-1.5 rounded-full bg-green-500 text-white text-sm hover:opacity-90">
        <FaWhatsapp className="size-6" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مشاركة على فيسبوك"
        className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-sm hover:opacity-90">
        <FaFacebook className="size-6" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        aria-label="مشاركة على تويتر"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-full bg-black text-white text-sm hover:opacity-90">
        <FaXTwitter className="size-6" />
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        aria-label="مشاركة على تليجرام"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-full bg-sky-500 text-white text-sm hover:opacity-90">
        <BsTelegram className="size-6" />
      </a>

      {/* Copy Link */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert("تم نسخ رابط المقال");
        }}
        className="px-3 py-1.5 rounded-full bg-white text-sm text-black cursor-pointer hover:bg-white/80">
        نسخ رابط المقالة
      </button>
    </div>
  );
}
