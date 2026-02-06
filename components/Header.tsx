"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Menu, X } from "lucide-react";
import { HeaderData } from "@/lib/responseType";
import Link from "next/link";

const navLinks = [
  { href: "#about", label: "تعرف علينا" },
  { href: "#services", label: "ماذا نقدم" },
  { href: "#faq", label: "الأسئلة الشائعة" },
  { href: "#gallery", label: "أعمالنا" },
  { href: "#contact", label: "احجز الآن" },
];

export function Header({
  brandName,
  telephone,
}: HeaderData & { telephone?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md text-slate-800"
          : "bg-white/95 backdrop-blur-sm text-slate-800"
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - RTL: brand on the right side */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-main-color-dark">
            <span className="w-8 h-8 rounded bg-main-color flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </span>
            <span className="text-slate-800">{brandName}</span>
          </Link>

          {/* Desktop Navigation - RTL: nav links to the left of logo */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-main-color transition-colors font-medium text-[15px]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="toggle mobile menu"
              className="lg:hidden text-slate-700 cursor-pointer p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <a
              target="_blank"
              href={`tel:${telephone}`}
              className="bg-main-color-dark hover:opacity-75 text-white md:px-6 md:py-3 px-4 py-2 text-sm md:text-base rounded-lg shadow-[0_4px_20px_hsl(var(--shadow-gold))] transition-all">
              احجز الآن
            </a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setTimeout(() => setIsMobileMenuOpen(false), 300)
                  }
                  className="text-slate-700 hover:text-main-color transition-colors font-medium py-2">
                  {link.label}
                </Link>
              ))}
              <a
                target="_blank"
                href={`tel:${telephone}`}
                className="bg-main-color hover:opacity-75 text-white md:px-6 md:py-3 px-4 py-2 text-sm md:text-base rounded-lg shadow-[0_4px_20px_hsl(var(--shadow-gold))] transition-all">
                احجز الآن
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
