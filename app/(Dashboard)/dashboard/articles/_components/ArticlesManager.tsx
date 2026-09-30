"use client";

import { useState, useCallback, memo } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { Input } from "@/components/ui/input";
import ArticleEditor from "./ArticleEditor";
import { Category } from "./CategoriesManager";
import ImageUploader from "@/app/(Dashboard)/_components/ImageUploader";

export type Article = {
  id: string;
  title: string;
  content: string | null; // HTML
  coverImage: string | null;
  keywords: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

const ArticleCard = memo(function ArticleCard({
  article,
  isImproving,
  onEdit,
  onImprove,
  onDelete,
}: {
  article: Article;
  isImproving: boolean;
  onEdit: (article: Article) => void;
  onImprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 border border-slate-100 rounded-lg px-4 py-3">
      <div className="flex items-start gap-3 max-w-full">
        {article.coverImage && (
          <div className="w-16 h-16 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
            <Image
              src={article.coverImage}
              alt={article.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-1.5 max-w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-[#332822]">{article.title}</h3>
            {article.category && (
              <span className="text-xs bg-[#f3ede8] text-[#6B4E2F] px-2 py-0.5 rounded-full font-medium shrink-0">
                {article.category.name}
              </span>
            )}
          </div>
          {article.content && (
            <div
              className="text-xs text-slate-500 line-clamp-3 prose max-w-full"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
          {/* Keywords display */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 bg-[#f5f5f5] border border-[#6B4E2F]/20 text-[#6B4E2F] rounded-full text-xs font-medium"
                  dir="auto">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
        <button
          onClick={() => onEdit(article)}
          className="text-xs md:text-sm px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
          تعديل
        </button>
        <button
          onClick={() => onImprove(article.id)}
          disabled={isImproving}
          className="inline-flex items-center gap-1.5 text-xs md:text-sm px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-60 transition-colors">
          {isImproving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {isImproving ? "جارٍ التحسين..." : "تحسين بالذكاء الاصطناعي"}
        </button>
        <button
          onClick={() => onDelete(article.id)}
          className="text-xs md:text-sm px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600">
          حذف
        </button>
      </div>
    </div>
  );
});

export default function ArticlesManager({
  initialArticles,
  categories,
  token,
}: {
  initialArticles: Article[];
  token: string;
  categories: Category[];
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [improvingId, setImprovingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setTitle("");
    setContent("<p></p>");
    setCoverImage(null);
    setCategorySlug("");
    setKeywords([]);
    setNewKeyword("");
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  /* ---------------- keywords helpers ---------------- */

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    if (keywords.includes(trimmed)) {
      setError("هذه الكلمة المفتاحية موجودة بالفعل");
      return;
    }
    setKeywords((prev) => [...prev, trimmed]);
    setNewKeyword("");
    setError(null);
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("عنوان المقال مطلوب");
      return;
    }

    // ❌ منع الحروف الخاصة
    const specialCharRegex = /[^a-zA-Z0-9\u0600-\u06FF\s]/;
    if (specialCharRegex.test(title)) {
      setError("عنوان المقال لا يجب أن يحتوي على رموز أو حروف خاصة");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const coverImageUrl = coverImage;

      const body = editingId
        ? {
            title,
            content,
            coverImage: coverImageUrl,
            keywords,
            ...(categorySlug ? { categorySlug } : {}),
          }
        : {
            projectId: CurrentProjectId,
            title,
            content,
            coverImage: coverImageUrl,
            keywords,
            ...(categorySlug ? { categorySlug } : {}),
          };

      const res = await fetch(
        editingId
          ? `${APP_URL}/api/article/${editingId}`
          : `${APP_URL}/api/article`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed");

      const article = json.data.article;

      await fetch("/api/revalidate-metatags");

      setArticles((prev) =>
        editingId
          ? prev.map((a) => (a.id === article.id ? article : a))
          : [article, ...prev],
      );

      setSuccess(editingId ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح");
      resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ المقال");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- edit ---------------- */

  /* ---------------- edit ---------------- */

  const handleEditClick = useCallback((article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content || "<p></p>");
    setCoverImage(article.coverImage);
    setCategorySlug(article.category?.slug || "");
    setKeywords(article.keywords ?? []);
    setNewKeyword("");
    setError(null);
    setSuccess(null);
  }, []);

  /* ---------------- ai improve ---------------- */

  const handleImprove = useCallback(
    async (id: string) => {
      setImprovingId(id);
      setError(null);
      setSuccess(null);

      try {
        const res = await fetch(
          `${APP_URL}/api/admin/articles/${id}/ai-improve`,
          {
            method: "POST",
            credentials: "include",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const json = await res.json();
        if (!res.ok)
          throw new Error(json.error || json.message || "فشل تحسين المقال");

        const improved: Article = json.data;
        setArticles((prev) =>
          prev.map((a) => (a.id === improved.id ? { ...a, ...improved } : a)),
        );
        setSuccess(`✅ تم تحسين مقال "${improved.title}" بنجاح`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء تحسين المقال");
      } finally {
        setImprovingId(null);
      }
    },
    [token],
  );

  /* ---------------- delete ---------------- */

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

      setError(null);
      setSuccess(null);

      try {
        const res = await fetch(`${APP_URL}/api/article/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("فشل حذف المقال");
        await fetch("/api/revalidate-metatags");

        setArticles((prev) => prev.filter((a) => a.id !== id));
        setSuccess("تم حذف المقال بنجاح");

        setEditingId((prevId) => {
          if (prevId === id) resetForm();
          return prevId === id ? null : prevId;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "حدث خطأ أثناء حذف المقال");
      }
    },
    [resetForm],
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Create / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border p-5 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">
          {editingId ? "تعديل مقال" : "إضافة مقال"}
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {/* Title */}
        <Input
          placeholder="عنوان المقال"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Category Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#8B7D72]">
            التصنيف (اختياري)
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-white text-[#332822] focus:outline-none focus:ring-2 focus:ring-[#6B4E2F]/40"
            dir="rtl">
            <option value="">— اختر تصنيفاً (افتراضي: خدمات الضيافة) —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Image Upload */}
        <ImageUploader
          value={coverImage || ""}
          onChange={setCoverImage}
          token={token}
          label="صورة الغلاف (اختياري)"
          placeholder="انقر لإضافة صورة الغلاف"
          disabled={saving}
        />

        {/* Content Editor */}
        <ArticleEditor
          content={content}
          onChange={handleContentChange}
          token={token}
        />

        {/* Keywords Section */}
        <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#332822]">
              الكلمات المفتاحية (اختياري)
            </label>
            {keywords.length > 0 && (
              <button
                type="button"
                onClick={() => setKeywords([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">
                حذف الكل
              </button>
            )}
          </div>

          {/* Keyword input */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={handleKeywordKeyPress}
              placeholder="أدخل كلمة مفتاحية واضغط Enter أو أضف..."
              className="flex-1"
              dir="auto"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              disabled={!newKeyword.trim()}
              className="px-4 py-2 bg-[#6B4E2F] text-white text-sm rounded-md hover:bg-[#5a3f25] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
              إضافة
            </button>
          </div>

          {/* Keywords pills */}
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#6B4E2F]/30 text-[#6B4E2F] rounded-full text-sm font-medium hover:shadow-sm transition-all"
                  dir="auto">
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(index)}
                    className="text-[#6B4E2F]/60 hover:text-red-500 font-bold text-base leading-none transition-colors"
                    aria-label="حذف الكلمة المفتاحية">
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              لا توجد كلمات مفتاحية بعد. أضف كلمات لتحسين SEO للمقال.
            </p>
          )}
        </div>

        <button
          disabled={saving}
          className="bg-[#6B4E2F] text-white px-4 py-2 rounded-md">
          {saving
            ? "جارٍ الحفظ..."
            : editingId
              ? "تحديث المقال"
              : "إنشاء المقال"}
        </button>
      </form>

      {/* List of Articles */}
      <div className="bg-white border p-5 rounded-xl space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">كل المقالات</h2>
        </div>

        {articles.length === 0 ? (
          <p className="text-sm text-slate-500">لا توجد مقالات حتى الآن.</p>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isImproving={improvingId === article.id}
                onEdit={handleEditClick}
                onImprove={handleImprove}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
