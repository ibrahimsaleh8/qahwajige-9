"use client";

import { useState } from "react";
import { CustomSectionCard } from "../page";
import { APP_URL } from "@/lib/ProjectId";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Check, X } from "lucide-react";
import IconPicker from "./IconPicker";
import { getIconComponent } from "@/lib/getIconComponent";

interface CardItemProps {
  card: CustomSectionCard;
  projectId: string;
  sectionId: string;
  onUpdated: (card: CustomSectionCard) => void;
  onDeleted: (cardId: string) => void;
}

export default function CardItem({
  card,
  projectId,
  sectionId,
  onUpdated,
  onDeleted,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    title: card.title,
    description: card.description,
    icon: card.icon || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/custom-sections/${sectionId}/cards/${card.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editData.title,
            description: editData.description,
            icon: editData.icon || null,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        onUpdated(data.data);
        await fetch("/api/revalidate-main-data");

        Toast({ icon: "success", message: "تم تحديث البطاقة بنجاح" });
        setIsEditing(false);
      } else {
        const err = await res.json().catch(() => null);
        Toast({ icon: "error", message: err?.message || "فشل تحديث البطاقة" });
      }
    } catch {
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذه البطاقة؟")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/custom-sections/${sectionId}/cards/${card.id}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        await fetch("/api/revalidate-main-data");

        Toast({ icon: "success", message: "تم حذف البطاقة بنجاح" });

        onDeleted(card.id);
      } else {
        Toast({ icon: "error", message: "فشل حذف البطاقة" });
      }
    } catch {
      Toast({ icon: "error", message: "حدث خطأ أثناء الحذف" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      title: card.title,
      description: card.description,
      icon: card.icon || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            placeholder="عنوان البطاقة"
            disabled={isSaving}
          />
          <Textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            placeholder="وصف البطاقة"
            rows={2}
            disabled={isSaving}
          />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              الأيقونة
            </label>
            <IconPicker
              value={editData.icon}
              onChange={(val) => setEditData({ ...editData, icon: val })}
              disabled={isSaving}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {isSaving ? "جاري الحفظ..." : "حفظ"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="flex items-center gap-1">
              <X className="w-3.5 h-3.5" />
              إلغاء
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {(() => {
                  const Icon = getIconComponent(card.icon);
                  return Icon ? (
                    <span className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </span>
                  ) : null;
                })()}
                <h4 className="font-semibold text-gray-800 truncate">
                  {card.title}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                className="w-7 h-7"
                onClick={() => setIsEditing(true)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-7 h-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-3">
            {card.description}
          </p>
        </div>
      )}
    </div>
  );
}
