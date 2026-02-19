// app/dashboard/[id]/keywords/_components/KeywordsForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_URL } from "@/lib/ProjectId";

interface KeywordsFormProps {
  projectId: string;
  initialKeywords: string[];
  siteTitle: string;
  siteDescription: string;
}

export default function KeywordsForm({
  projectId,
  initialKeywords,
  siteTitle,
  siteDescription,
}: KeywordsFormProps) {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();

    if (!trimmed) {
      setError("الكلمة المفتاحية لا يمكن أن تكون فارغة");
      return;
    }

    if (keywords.includes(trimmed)) {
      setError("هذه الكلمة المفتاحية موجودة بالفعل");
      return;
    }

    setKeywords([...keywords, trimmed]);
    setNewKeyword("");
    setError(null);
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/update-keywrords`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keywords }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        Toast({
          icon: "error",
          message: result.message || "فشل في حفظ الكلمات المفتاحية",
        });
        return;
      }

      await fetch("/api/revalidate-metatags");

      // Refresh the page data
      router.refresh();

      Toast({ icon: "success", message: "تم حفظ الكلمات المفتاحية بنجاح" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ";
      setError(errorMessage);
      Toast({
        icon: "error",
        message: `خطأ: ${errorMessage}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين الكلمات المفتاحية؟")) {
      setKeywords(initialKeywords);
      setNewKeyword("");
      setError(null);
    }
  };

  const hasChanges =
    JSON.stringify(keywords) !== JSON.stringify(initialKeywords);

  return (
    <div className="space-y-6">
      {/* SEO Context Card */}
      <div className="bg-[#f4f4f4] border text-black rounded-lg p-4">
        <h3 className="text-sm font-semibold  mb-2">معلومات SEO الحالية</h3>
        <div className="space-y-2 text-sm ">
          <div>
            <span className="font-medium">عنوان الموقع:</span>
            <p className=" mt-1">{siteTitle}</p>
          </div>
          <div>
            <span className="font-medium">وصف الموقع:</span>
            <p className=" mt-1">{siteDescription}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add Keyword Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">إضافة كلمة مفتاحية جديدة</h2>

        <div className="flex gap-3">
          <Input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="أدخل الكلمة المفتاحية..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir="auto"
          />
          <Button
            className="h-11"
            onClick={handleAddKeyword}
            disabled={!newKeyword.trim()}>
            إضافة
          </Button>
        </div>
      </div>

      {/* Keywords List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            الكلمات المفتاحية الحالية ({keywords.length})
          </h2>
          {keywords.length > 0 && (
            <button
              onClick={() => {
                if (confirm("هل تريد حذف جميع الكلمات المفتاحية؟")) {
                  setKeywords([]);
                }
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium">
              حذف الكل
            </button>
          )}
        </div>

        {keywords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="text-lg font-medium">لا توجد كلمات مفتاحية</p>
            <p className="text-sm mt-1">
              ابدأ بإضافة كلمات مفتاحية لتحسين السيو
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="group inline-flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] border rounded-lg hover:shadow-md transition-all"
                dir="auto">
                <span className="text-sm font-medium text-black">
                  {keyword}
                </span>
                <button
                  onClick={() => handleRemoveKeyword(index)}
                  className="text-red-500 cursor-pointer hover:text-red-600 font-bold text-lg leading-none transition-colors"
                  aria-label="حذف الكلمة المفتاحية"
                  title="حذف">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t">
        <button
          onClick={handleReset}
          disabled={!hasChanges || saving}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          إعادة تعيين
        </button>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 font-medium">
              • لديك تغييرات غير محفوظة
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-8 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow-md">
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
}
