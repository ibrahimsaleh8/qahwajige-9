import {
  // Coffee & Food
  Coffee,
  CupSoda,
  UtensilsCrossed,
  ChefHat,
  Flame,
  Soup,
  // Delivery & Speed
  Truck,
  Zap,
  Clock,
  Timer,
  Wind,
  Rocket,
  // Quality & Award
  Award,
  Star,
  Crown,
  Medal,
  Trophy,
  BadgeCheck,
  // Nature & Freshness
  Leaf,
  Sprout,
  Sun,
  Flower2,
  Mountain,
  Droplets,
  // Business & Service
  HandCoins,
  ShieldCheck,
  Package,
  HeartHandshake,
  Globe,
  Store,
  // People
  Users,
  UserCheck,
  Smile,
  Heart,
  Handshake,
  ThumbsUp,
  // Tech & Tools
  Sparkles,
  Lightbulb,
  Settings,
  Wrench,
  BarChart3,
  PieChart,
  // Misc
  MapPin,
  Phone,
  Mail,
  Bell,
  Gift,
  Gem,
  LucideIcon,
} from "lucide-react";

// ─── Icon registry ───────────────────────────────────────────────────────────
export const ICON_OPTIONS: { name: string; icon: LucideIcon; label: string }[] =
  [
    // Coffee & Food
    { name: "Coffee", icon: Coffee, label: "قهوة" },
    { name: "CupSoda", icon: CupSoda, label: "مشروب" },
    { name: "UtensilsCrossed", icon: UtensilsCrossed, label: "أدوات طعام" },
    { name: "ChefHat", icon: ChefHat, label: "طاهٍ" },
    { name: "Flame", icon: Flame, label: "نار" },
    { name: "Soup", icon: Soup, label: "شوربة" },
    // Delivery & Speed
    { name: "Truck", icon: Truck, label: "توصيل" },
    { name: "Zap", icon: Zap, label: "سريع" },
    { name: "Clock", icon: Clock, label: "وقت" },
    { name: "Timer", icon: Timer, label: "مؤقت" },
    { name: "Wind", icon: Wind, label: "ريح" },
    { name: "Rocket", icon: Rocket, label: "صاروخ" },
    // Quality & Award
    { name: "Award", icon: Award, label: "جائزة" },
    { name: "Star", icon: Star, label: "نجمة" },
    { name: "Crown", icon: Crown, label: "تاج" },
    { name: "Medal", icon: Medal, label: "ميدالية" },
    { name: "Trophy", icon: Trophy, label: "كأس" },
    { name: "BadgeCheck", icon: BadgeCheck, label: "معتمد" },
    // Nature & Freshness
    { name: "Leaf", icon: Leaf, label: "ورقة" },
    { name: "Sprout", icon: Sprout, label: "نبتة" },
    { name: "Sun", icon: Sun, label: "شمس" },
    { name: "Flower2", icon: Flower2, label: "زهرة" },
    { name: "Mountain", icon: Mountain, label: "جبل" },
    { name: "Droplets", icon: Droplets, label: "قطرات" },
    // Business & Service
    { name: "HandCoins", icon: HandCoins, label: "مال" },
    { name: "ShieldCheck", icon: ShieldCheck, label: "أمان" },
    { name: "Package", icon: Package, label: "طرد" },
    { name: "HeartHandshake", icon: HeartHandshake, label: "شراكة" },
    { name: "Globe", icon: Globe, label: "عالم" },
    { name: "Store", icon: Store, label: "متجر" },
    // People
    { name: "Users", icon: Users, label: "مستخدمون" },
    { name: "UserCheck", icon: UserCheck, label: "عميل" },
    { name: "Smile", icon: Smile, label: "ابتسامة" },
    { name: "Heart", icon: Heart, label: "قلب" },
    { name: "Handshake", icon: Handshake, label: "تعاون" },
    { name: "ThumbsUp", icon: ThumbsUp, label: "إعجاب" },
    // Tech & Tools
    { name: "Sparkles", icon: Sparkles, label: "بريق" },
    { name: "Lightbulb", icon: Lightbulb, label: "فكرة" },
    { name: "Settings", icon: Settings, label: "إعدادات" },
    { name: "Wrench", icon: Wrench, label: "إصلاح" },
    { name: "BarChart3", icon: BarChart3, label: "إحصاء" },
    { name: "PieChart", icon: PieChart, label: "رسم بياني" },
    // Misc
    { name: "MapPin", icon: MapPin, label: "موقع" },
    { name: "Phone", icon: Phone, label: "هاتف" },
    { name: "Mail", icon: Mail, label: "بريد" },
    { name: "Bell", icon: Bell, label: "إشعار" },
    { name: "Gift", icon: Gift, label: "هدية" },
    { name: "Gem", icon: Gem, label: "جوهرة" },
  ];

/** Helper: get the LucideIcon component from a stored name string */
export function getIconComponent(
  name: string | null | undefined,
): LucideIcon | null {
  if (!name) return null;
  const lookup = name.toLowerCase();
  const canonicalName = lookup === "building" ? "building2" : lookup;
  return (
    ICON_OPTIONS.find((o) => o.name.toLowerCase() === canonicalName)?.icon ??
    null
  );
}
