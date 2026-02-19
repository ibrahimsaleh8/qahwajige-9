"use client";

import { motion } from "framer-motion";

import {
  FaFacebookF,
  FaPhone,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

export default function FloatedIcons({
  whatsapp,
  telephone,
}: {
  whatsapp: string;

  telephone: string;
}) {
  return (
    <div className="fixed z-10 left-4 bottom-4 flex flex-col gap-3">
      <motion.a
        aria-label="whatsapp"
        target="_blank"
        href={`https://wa.me/${
          whatsapp.includes("+") ? whatsapp.replace("+", "") : whatsapp
        }?text=`}
        className="flex items-center justify-center w-14 h-14 bg-[#25d366] rounded-full"
        initial={{ scale: 0 }}
        animate={{
          scale: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <FaWhatsapp className="w-9 h-9 text-white" />
      </motion.a>
      <motion.a
        aria-label="telephone"
        target="_blank"
        href={`tel:${telephone}`}
        className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: 0.2,
        }}>
        <FaPhone className="w-9 h-9 text-white rotate-110" />
      </motion.a>

      <motion.a
        aria-label="instagram"
        target="_blank"
        href={`https://www.instagram.com/qahwajeyn`}
        className="flex items-center justify-center w-14 h-14 bg-[#c13584] rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: 0.2,
        }}>
        <FaInstagram className="w-9 h-9 text-white" />
      </motion.a>

      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: 0.2,
        }}
        aria-label="tiktok"
        target="_blank"
        href="https://www.tiktok.com/@user61719922769991"
        className="flex items-center justify-center hover:scale-105 duration-300 w-14 h-14 bg-black rounded-full">
        <FaTiktok className="w-9 h-9 text-white" />
      </motion.a>

      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: 0.4,
        }}
        aria-label="facebook"
        target="_blank"
        href="https://www.facebook.com/SbabinAlkahwaa/?_rdr"
        className="flex items-center justify-center hover:scale-105 duration-300 w-14 h-14 bg-[#1877f2] rounded-full">
        <FaFacebookF className="w-9 h-9 text-white" />
      </motion.a>
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.4,
          delay: 0.6,
        }}
        aria-label="twitter"
        target="_blank"
        href="https://x.com/NghmAbw11703"
        className="flex items-center justify-center hover:scale-105 duration-300 w-14 h-14 bg-[#1da1f2] rounded-full">
        <FaTwitter className="w-9 h-9 text-white" />
      </motion.a>
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          duration: 0.3,
          delay: 0.8,
        }}
        aria-label="youtube"
        target="_blank"
        href="https://www.youtube.com/channel/UCProSRhVIgB-Bkn6_NPrMng"
        className="flex items-center justify-center hover:scale-105 duration-300 w-14 h-14 bg-[#ff0000] rounded-full">
        <FaYoutube className="w-9 h-9 text-white" />
      </motion.a>
    </div>
  );
}
