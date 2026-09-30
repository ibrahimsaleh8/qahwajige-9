"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, XCircle, Save } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Category } from "../../articles/_components/CategoriesManager";
import ArticleEditor from "../../articles/_components/ArticleEditor";
import { APP_URL } from "@/lib/ProjectId";

type GeneratedArticle = {
  id: string;
  title: string;
  content: string;
  description?: string;
  keywords: string[];
  status: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string } | null;
  coverImage?: string | null;
  createdAt: string;
};

export default function AIArticleGenerator({
  categories,
  token,
}: {
  categories: Category[];
  token: string;
}) {
  /* ── generate form state ── */
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  /* ── UI state ── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedArticle | null>(null);

  /* ── edit form state for generated article ── */
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("<p></p>");
  const [editCategorySlug, setEditCategorySlug] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editCoverImage, setEditCoverImage] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  /* ──────────────────────────────── generate ──────────────────────────────── */
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("عنوان المقال مطلوب");
      return;
    }
    if (!categoryId) {
      setError("يجب اختيار تصنيف");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setResult(null);

    try {
      const res = await fetch(`${APP_URL}/api/admin/articles/ai-generate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          categoryId,
          description: description || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || json.message || "فشل توليد المقال");

      const generated: GeneratedArticle = json.data;
      setResult(generated);
      setSuccess("✅ تم توليد المقال بنجاح وحفظه كمسودة");
      setTitle("");
      setCategoryId("");
      setDescription("");

      // Initialize edit fields
      setEditTitle(generated.title || "");
      setEditContent(generated.content || "<p></p>");
      const matchedCat =
        generated.category?.slug ||
        categories.find((c) => c.id === generated.categoryId)?.slug ||
        "";
      setEditCategorySlug(matchedCat);
      setEditKeywords(
        Array.isArray(generated.keywords) ? generated.keywords.join(", ") : "",
      );
      setEditCoverImage(generated.coverImage || null);
      setEditFile(null);
      setEditPreview(generated.coverImage || "");
      setEditSuccess(null);
      setEditError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء توليد المقال");
    } finally {
      setLoading(false);
    }
  };

  /* ──────────────────────────────── image upload ──────────────────────────────── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setEditFile(selectedFile);
      setEditPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async (fileToUpload: File) => {
    const data = new FormData();
    data.append("file", fileToUpload);

    const res = await fetch(`${APP_URL}/api/upload-images`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resJson = await res.json();
    return resJson.data.url;
  };

  /* ──────────────────────────────── save edit ──────────────────────────────── */
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;

    if (!editTitle.trim()) {
      setEditError("عنوان المقال مطلوب");
      return;
    }

    setSavingEdit(true);
    setEditError(null);
    setEditSuccess(null);

    try {
      let coverImageUrl = editCoverImage;
      if (editFile) {
        coverImageUrl = await uploadImage(editFile);
      }

      const keywordsArray = editKeywords
        ? editKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: Record<string, any> = {
        title: editTitle,
        content: editContent,
        coverImage: coverImageUrl,
        keywords: keywordsArray,
      };
      if (editCategorySlug) {
        body.categorySlug = editCategorySlug;
      }

      const res = await fetch(`${APP_URL}/api/article/${result.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || json.message || "فشل حفظ التعديلات");

      const updatedArticle = json.data?.article || json.data;
      await fetch("/api/revalidate-metatags");

      setResult((prev) => (prev ? { ...prev, ...updatedArticle } : null));
      setEditSuccess("✅ تم حفظ التعديلات على المقال بنجاح");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setEditError(err.message || "حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setSavingEdit(false);
    }
  };

  /* ──────────────────────────────── UI ──────────────────────────────── */
  return (
    <div className="space-y-6" dir="rtl">
      {/* ── Generation Alerts ── */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* ══════════════════ GENERATE FORM ══════════════════ */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#6B4E2F]/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#6B4E2F]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#332822]">
              توليد مقال جديد بالذكاء الاصطناعي
            </h2>
            <p className="text-xs text-[#8B7D72]">
              يُنشئ مقالاً SEO عربياً كاملاً ويحفظه كمسودة
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#8B7D72]">
              عنوان المقال *
            </label>
            <Input
              id="ai-title"
              placeholder="مثال: أفضل خدمات القهوة العربية في الرياض"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              dir="rtl"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#8B7D72]">
              التصنيف *
            </label>
            <select
              id="ai-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-white text-[#332822] focus:outline-none focus:ring-2 focus:ring-[#6B4E2F]/40 disabled:opacity-60"
              dir="rtl">
              <option value="">— اختر تصنيفاً —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description (optional) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#8B7D72]">
              تعليمات إضافية للذكاء الاصطناعي{" "}
              <span className="text-slate-400">(اختياري)</span>
            </label>
            <textarea
              id="ai-description"
              placeholder="مثال: ركّز على المناسبات الرسمية والضيافة الفاخرة"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-white text-[#332822] focus:outline-none focus:ring-2 focus:ring-[#6B4E2F]/40 resize-none disabled:opacity-60"
              dir="rtl"
            />
          </div>

          <button
            id="ai-generate-btn"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-main-color hover:bg-main-color/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "جارٍ التوليد..." : "توليد بالذكاء الاصطناعي"}
          </button>
        </form>
      </section>

      {/* ══════════════════ GENERATED ARTICLE EDITOR ══════════════════ */}
      {result && (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-[#332822]">
                محرر المقال المُنشأ
              </h2>
            </div>
            <a
              href="/dashboard/articles"
              className="text-xs text-[#6B4E2F] hover:underline font-medium">
              عرض جميع المقالات ←
            </a>
          </div>

          {/* Edit alerts */}
          {editError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{editError}</span>
            </div>
          )}
          {editSuccess && (
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{editSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#8B7D72]">
                عنوان المقال
              </label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                disabled={savingEdit}
                dir="rtl"
              />
            </div>

            {/* Category & Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#8B7D72]">
                  التصنيف
                </label>
                <select
                  value={editCategorySlug}
                  onChange={(e) => setEditCategorySlug(e.target.value)}
                  disabled={savingEdit}
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-white text-[#332822] focus:outline-none focus:ring-2 focus:ring-[#6B4E2F]/40 disabled:opacity-60"
                  dir="rtl">
                  <option value="">— اختر تصنيفاً —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keywords */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#8B7D72]">
                  الكلمات المفتاحية (فصل الكلمات بفاصلة)
                </label>
                <Input
                  placeholder="مثال: قهوة عربية, ضيافة الرياض, خدمات"
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  disabled={savingEdit}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#8B7D72]">
                صورة الغلاف
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-slate-50/50"
                onClick={() =>
                  document.getElementById("editCoverInput")?.click()
                }>
                {editPreview || editCoverImage ? (
                  <Image
                    src={editPreview || (editCoverImage as string)}
                    width={600}
                    height={300}
                    alt="معاينة صورة الغلاف"
                    className="max-h-40 object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500 text-xs py-3">
                    انقر لاختيار صورة غلاف للمقال
                  </p>
                )}
                <Input
                  id="editCoverInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={savingEdit}
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#8B7D72]">
                محتوى المقال
              </label>
              <ArticleEditor content={editContent} onChange={setEditContent} />
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <button
                type="submit"
                disabled={savingEdit}
                className="inline-flex items-center gap-2 bg-[#6B4E2F] hover:bg-[#5a3f24] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
                {savingEdit ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {savingEdit ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </button>

              <p className="text-xs text-[#8B7D72]">
                تُحفظ التعديلات مباشرة في قاعدة البيانات.
              </p>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
