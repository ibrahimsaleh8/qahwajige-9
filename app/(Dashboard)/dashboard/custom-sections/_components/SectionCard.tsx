"use client";

import { useState } from "react";
import { CustomSection, CustomSectionCard } from "../page";
import { APP_URL } from "@/lib/ProjectId";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  CreditCard,
} from "lucide-react";
import CardItem from "./CardItem";
import AddCardModal from "./AddCardModal";
import ArticleEditor from "../../articles/_components/ArticleEditor";

interface SectionCardProps {
  section: CustomSection;
  projectId: string;
  onUpdated: (section: CustomSection) => void;
  onDeleted: (sectionId: string) => void;
}

export default function SectionCard({
  section,
  projectId,
  onUpdated,
  onDeleted,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: section.title,
    description: section.description,
  });
  const [cards, setCards] = useState<CustomSectionCard[]>(section.cards);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/custom-sections/${section.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        },
      );

      if (res.ok) {
        const data = await res.json();
        onUpdated({ ...data.data, cards });
        await fetch("/api/revalidate-main-data");

        Toast({ icon: "success", message: "تم تحديث القسم بنجاح" });
        setIsEditing(false);
      } else {
        const err = await res.json().catch(() => null);
        Toast({ icon: "error", message: err?.message || "فشل تحديث القسم" });
      }
    } catch {
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع بطاقاته أيضاً."))
      return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/custom-sections/${section.id}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        await fetch("/api/revalidate-main-data");

        Toast({ icon: "success", message: "تم حذف القسم بنجاح" });
        onDeleted(section.id);
      } else {
        Toast({ icon: "error", message: "فشل حذف القسم" });
      }
    } catch {
      Toast({ icon: "error", message: "حدث خطأ أثناء الحذف" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardAdded = (newCard: CustomSectionCard) => {
    const updated = [...cards, newCard];
    setCards(updated);
    onUpdated({ ...section, cards: updated });
  };

  const handleCardUpdated = (updatedCard: CustomSectionCard) => {
    const updated = cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c,
    );
    setCards(updated);
    onUpdated({ ...section, cards: updated });
  };

  const handleCardDeleted = (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId);
    setCards(updated);
    onUpdated({ ...section, cards: updated });
  };

  const handleCancelEdit = () => {
    setEditData({ title: section.title, description: section.description });
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-100">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                العنوان
              </label>
              <Input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="عنوان القسم"
                disabled={isSaving}
                className="text-lg font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                الوصف
              </label>
              <ArticleEditor
                content={editData.description}
                onChange={(html) =>
                  setEditData((prev) => ({ ...prev, description: html }))
                }
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                {isSaving ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex items-center gap-1">
                <X className="w-4 h-4" />
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {section.title}
              </h2>

              <div
                className="mt-1 text-sm text-gray-500 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  <CreditCard className="w-3 h-3" />
                  {cards.length} بطاقة
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(section.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1">
                <Pencil className="w-3.5 h-3.5" />
                تعديل
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? "..." : "حذف"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cards Section (expanded) */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">البطاقات</h3>
            <Button
              size="sm"
              onClick={() => setIsAddCardOpen(true)}
              className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              إضافة بطاقة
            </Button>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-white">
              <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">لا توجد بطاقات بعد</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setIsAddCardOpen(true)}>
                أضف أول بطاقة
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  projectId={projectId}
                  sectionId={section.id}
                  onUpdated={handleCardUpdated}
                  onDeleted={handleCardDeleted}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        projectId={projectId}
        sectionId={section.id}
        onCreated={handleCardAdded}
      />
    </div>
  );
}
