"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { APP_URL } from "@/lib/ProjectId";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Music2,
  Save,
  Link2,
} from "lucide-react";

export interface SocialMediaLinks {
  id?: string;
  projectId?: string;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
}

interface SocialMediaFormProps {
  projectId: string;
  initialData: SocialMediaLinks | null;
}

const platforms = [
  {
    key: "instagram" as keyof SocialMediaLinks,
    label: "Instagram",
    labelAr: "انستقرام",
    placeholder: "https://instagram.com/username",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    focusRing: "focus:ring-pink-400",
  },
  {
    key: "facebook" as keyof SocialMediaLinks,
    label: "Facebook",
    labelAr: "فيسبوك",
    placeholder: "https://facebook.com/page",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    focusRing: "focus:ring-blue-400",
  },
  {
    key: "tiktok" as keyof SocialMediaLinks,
    label: "TikTok",
    labelAr: "تيك توك",
    placeholder: "https://tiktok.com/@username",
    icon: Music2,
    color: "text-slate-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    focusRing: "focus:ring-slate-400",
  },
  {
    key: "twitter" as keyof SocialMediaLinks,
    label: "Twitter / X",
    labelAr: "تويتر / X",
    placeholder: "https://twitter.com/username",
    icon: Twitter,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    focusRing: "focus:ring-sky-400",
  },
  {
    key: "youtube" as keyof SocialMediaLinks,
    label: "YouTube",
    labelAr: "يوتيوب",
    placeholder: "https://youtube.com/@channel",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    focusRing: "focus:ring-red-400",
  },
];

export default function SocialMediaForm({
  projectId,
  initialData,
}: SocialMediaFormProps) {
  const [links, setLinks] = useState<SocialMediaLinks>(
    initialData ?? {
      instagram: "",
      facebook: "",
      tiktok: "",
      twitter: "",
      youtube: "",
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  // Track whether records already exist in the DB
  const [hasExisting, setHasExisting] = useState<boolean>(!!initialData?.id);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof SocialMediaLinks
  ) => {
    setLinks((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Build payload — only send string fields, exclude id/projectId
    const payload = {
      instagram: links.instagram || null,
      facebook: links.facebook || null,
      tiktok: links.tiktok || null,
      twitter: links.twitter || null,
      youtube: links.youtube || null,
    };

    try {
      const method = "PUT" ;
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/social-media-links`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Update local state with returned data
        if (data?.data) {
          setLinks(data.data);
          setHasExisting(true);
        }
              await fetch("/api/revalidate-main-data");

        Toast({
          icon: "success",
          message: hasExisting
            ? "تم تحديث روابط وسائل التواصل الاجتماعي بنجاح"
            : "تم إنشاء روابط وسائل التواصل الاجتماعي بنجاح",
        });
      } else if (res.status === 409) {
        // Already exists — switch to PUT next time
        setHasExisting(true);
        Toast({
          icon: "info",
          message: "الروابط موجودة بالفعل، يتم التحديث...",
        });
        // Retry as PUT
        const retryRes = await fetch(
          `${APP_URL}/api/dashboard/${projectId}/social-media-links`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const retryData = await retryRes.json();
        if (retryRes.ok && retryData?.data) {
          setLinks(retryData.data);
          Toast({ icon: "success", message: "تم تحديث الروابط بنجاح" });
        } else {
          Toast({ icon: "error", message: retryData?.error || "حدث خطأ" });
        }
      } else {
        Toast({ icon: "error", message: data?.error || "حدث خطأ أثناء الحفظ" });
      }
    } catch (err) {
      console.error(err);
      Toast({ icon: "error", message: "حدث خطأ في الاتصال بالخادم" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-100 bg-blue-50 text-blue-700 text-sm">
        <Link2 className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          أدخل روابط حسابات وسائل التواصل الاجتماعي. يمكنك ترك أي حقل فارغاً
          إذا لم يكن الحساب متاحاً. ستظهر الروابط على موقعك الإلكتروني تلقائياً.
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {platforms.map(
          ({ key, label, labelAr, placeholder, icon: Icon, color, bgColor, borderColor }) => {
            const value =
              key === "id" || key === "projectId"
                ? ""
                : (links[key] as string | null) ?? "";
            return (
              <div
                key={key}
                className={`rounded-xl border ${borderColor} bg-white shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow`}
              >
                {/* Card header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{labelAr}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                  {/* Status indicator */}
                  <div className="mr-auto">
                    {value ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        مفعّل
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                        غير مفعّل
                      </span>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div>
                  <label
                    htmlFor={key}
                    className="block mb-1.5 text-sm font-medium text-gray-600"
                  >
                    رابط الحساب
                  </label>
                  <Input
                    id={key}
                    name={key}
                    type="url"
                    dir="ltr"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => handleChange(e, key)}
                    disabled={isLoading}
                    className="text-sm"
                  />
                </div>

                {/* Preview link */}
                {value && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs ${color} hover:underline`}
                  >
                    <Link2 className="w-3 h-3" />
                    معاينة الرابط
                  </a>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-start pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-8"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </form>
  );
}
