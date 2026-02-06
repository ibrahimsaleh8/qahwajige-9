"use client";
import { motion } from "motion/react";
import Image from "next/image";

export default function AboutImage({ imageUrl }: { imageUrl: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true }}
      className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 max-w-lg mx-auto lg:max-w-none w-full bg-slate-200 order-2 lg:order-1">
      <Image
        src={imageUrl}
        alt="عن قهوجيين الرياض - ضيافة سعودية أصيلة"
        width={560}
        height={420}
        className="w-full h-full object-cover object-center"
      />
    </motion.div>
  );
}
