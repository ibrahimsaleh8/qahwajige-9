"use client";

import { useState } from "react";
import { CustomSection } from "../page";
import { APP_URL } from "@/lib/ProjectId";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2, CreditCard, Layers } from "lucide-react";
import IconPicker from "./IconPicker";

import ArticleEditor from "@/app/(Dashboard)/dashboard/articles/_components/ArticleEditor";

interface NewCard {
  title: string;
  description: string;
  icon: string;
}

interface CreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onCreated: (section: CustomSection) => void;
}

const emptyCard = (): NewCard => ({ title: "", description: "", icon: "" });

export default function CreateSectionModal({
  isOpen,
  onClose,
  projectId,
  onCreated,
}: CreateSectionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState<NewCard[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCard = () => {
    setCards((prev) => [...prev, emptyCard()]);
  };

  const handleRemoveCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (
    index: number,
    field: keyof NewCard,
    value: string,
  ) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isDescriptionEmpty =
      !description.replace(/<[^>]*>/g, "").trim() &&
      !description.includes("<img") &&
      !description.includes("<table");
    if (!title.trim() || isDescriptionEmpty) {
      Toast({ icon: "warning", message: "العنوان والوصف مطلوبان" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: {
        title: string;
        description: string;
        cards?: { title: string; description: string; icon?: string }[];
      } = {
        title: title.trim(),
        description: description.trim(),
      };

      if (cards.length > 0) {
        payload.cards = cards
          .filter((c) => c.title.trim() && c.description.trim())
          .map((c) => ({
            title: c.title.trim(),
            description: c.description.trim(),
            icon: c.icon.trim() || undefined,
          }));
      }

      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/custom-sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        const data = await res.json();
        onCreated(data.data);
        await fetch("/api/revalidate-main-data");

        Toast({ icon: "success", message: "تم إنشاء القسم بنجاح" });
        handleClose();
      } else {
        const err = await res.json().catch(() => null);
        Toast({ icon: "error", message: err?.message || "فشل إنشاء القسم" });
      }
    } catch {
      Toast({ icon: "error", message: "حدث خطأ أثناء الإنشاء" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCards([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
        dir="rtl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-800">
              إنشاء قسم مخصص جديد
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          id="create-section-form"
          className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* Section Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                عنوان القسم <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: مميزاتنا"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                وصف القسم <span className="text-red-500">*</span>
              </label>
              <ArticleEditor content={description} onChange={setDescription} />
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">
                  البطاقات (اختياري)
                </h3>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddCard}
                disabled={isSubmitting}
                className="flex items-center gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" />
                إضافة بطاقة
              </Button>
            </div>

            {cards.length === 0 && (
              <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400">
                لم تضف أي بطاقات بعد (يمكنك إضافتها لاحقاً)
              </div>
            )}

            {cards.map((card, index) => (
              <div
                key={index}
                className="relative border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500">
                    بطاقة #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(index)}
                    disabled={isSubmitting}
                    className="w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Input
                  value={card.title}
                  onChange={(e) =>
                    handleCardChange(index, "title", e.target.value)
                  }
                  placeholder="عنوان البطاقة"
                  disabled={isSubmitting}
                />
                <Textarea
                  value={card.description}
                  onChange={(e) =>
                    handleCardChange(index, "description", e.target.value)
                  }
                  placeholder="وصف البطاقة"
                  rows={2}
                  disabled={isSubmitting}
                />
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    الأيقونة
                  </label>
                  <IconPicker
                    value={card.icon}
                    onChange={(val) => handleCardChange(index, "icon", val)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button
            type="submit"
            form="create-section-form"
            disabled={isSubmitting}>
            {isSubmitting ? "جاري الإنشاء..." : "إنشاء القسم"}
          </Button>
        </div>
      </div>
    </div>
  );
}
