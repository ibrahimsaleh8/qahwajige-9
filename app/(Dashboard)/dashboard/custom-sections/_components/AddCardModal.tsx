"use client";

import { useState } from "react";
import { CustomSectionCard } from "../page";
import { APP_URL } from "@/lib/ProjectId";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, CreditCard } from "lucide-react";
import IconPicker from "./IconPicker";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  sectionId: string;
  onCreated: (card: CustomSectionCard) => void;
}

export default function AddCardModal({
  isOpen,
  onClose,
  projectId,
  sectionId,
  onCreated,
}: AddCardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      Toast({ icon: "warning", message: "العنوان والوصف مطلوبان" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/custom-sections/${sectionId}/cards`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            icon: icon.trim() || undefined,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        onCreated(data.data);
        await fetch("/api/revalidate-main-data");

        Toast({ icon: "success", message: "تم إضافة البطاقة بنجاح" });
        handleClose();
      } else {
        const err = await res.json().catch(() => null);
        Toast({ icon: "error", message: err?.message || "فشل إضافة البطاقة" });
      }
    } catch {
      Toast({ icon: "error", message: "حدث خطأ أثناء الإضافة" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIcon("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800">إضافة بطاقة جديدة</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              عنوان البطاقة <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: توصيل سريع"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              وصف البطاقة <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً قصيراً..."
              rows={3}
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              الأيقونة <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <IconPicker
              value={icon}
              onChange={setIcon}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الإضافة..." : "إضافة البطاقة"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
