import { FooterData } from "@/lib/responseType";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
const mapEmbedSrc =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7247.733529263881!2d46.7653!3d24.731454!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f013bec0d4b7b%3A0xeb4d9048d7b13647!2z2YLZh9mI2KzZiiDZiNi12KjYp9io2YrZhiDZgtmH2YjYqSDYp9mE2LHZitin2LY!5e0!3m2!1sar!2str!4v1728329118756!5m2!1sar!2str";

const sitemapLinks = [
  { name: "الرئيسية", href: "#home" },
  { name: "تعرف علينا", href: "#about" },
  { name: "ماذا نقدم", href: "#services" },
  { name: "الأسئلة الشائعة", href: "#faq" },
  { name: "أعمالنا", href: "#gallery" },
  { name: "احجز الآن", href: "#contact" },
];

export default function Footer({
  address,
  phone,
  brandName,
  email,
  description,
}: FooterData & { description?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#161616] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{brandName}</h3>
            <p className="text-white/70">{description}</p>{" "}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">روابط مهمة</h3>
            <ul className="space-y-2">
              {sitemapLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-main-color transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تواصل معنا - email, phone, address, social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">تواصل معنا</h3>
            <ul className="space-y-3 text-white/80 text-sm">
              {email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-main-color transition-colors dir-ltr text-left">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-main-color transition-colors dir-ltr">
                    {phone}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>
          {/* Map embed */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">
              موقعنا على الخريطة
            </h3>

            <div className="w-full aspect-video md:aspect-21/9 min-h-55 bg-slate-800">
              <iframe
                src={mapEmbedSrc}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع قهوجيين الرياض على الخريطة"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-white/60 text-sm text-center">
            © {currentYear} جميع الحقوق محفوظة لـ{" "}
            {brandName || "قهوجيين الرياض"}
          </p>
        </div>
      </div>
    </footer>
  );
}
