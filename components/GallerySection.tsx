"use client";
import { GalleryImageData } from "@/lib/responseType";
import Image from "next/image";
import { motion } from "motion/react";
import UpFromDownText from "./AnimatedComponents/UpFromDownText";

export function GallerySection({ gallery }: { gallery: GalleryImageData[] }) {
  return (
    <section id="gallery" className="py-24 bg-second-bg">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <UpFromDownText
            text="معرض الأعمال"
            classes="text-main-color font-semibold text-sm tracking-wider mb-4"
          />
          <h2 className="text-4xl lg:text-5xl font-bold text-main-color mb-4">
            لحظات لا تُنسى من
            <br />
            <span className="text-main-color">مناسباتنا المميزة</span>
          </h2>
          <p className="text-black/60 text-lg max-w-2xl mx-auto">
            شاهد مجموعة من أفضل الصور لخدماتنا في مختلف المناسبات والفعاليات
          </p>
          <div className="w-20 h-1 bg-main-color mx-auto my-6" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              key={index}
              className={`relative bg-white/60 overflow-hidden rounded-2xl cursor-pointer group shadow-soft hover:shadow-luxury transition-all duration-300`}>
              <div className={`aspect-square `}>
                <Image
                  src={image.url}
                  alt={image.alt ?? `صورة-${index + 1}`}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-2xl"
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-[hsl(var(--coffee-dark)/0)] group-hover:bg-[hsl(var(--coffee-dark)/0.4)] transition-colors duration-300 flex items-center justify-center rounded-2xl">
                <span className="text-[hsl(var(--cream))] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-center px-2">
                  {image.alt ?? `صورة-${index + 1}`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
