"use client";

import { useState } from "react";
import Image from "next/image";
import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { Input } from "@/components/ui/input";
import ArticleEditor from "./ArticleEditor";

export type Article = {
  id: string;
  title: string;
  content: string | null; // HTML
  coverImage: string | null;
};

export default function ArticlesManager({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- helpers ---------------- */

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("<p></p>");
    setCoverImage(null);
    setFile(null);
    setPreview("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${APP_URL}/api/upload-images`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    return result.data.url;
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
      let coverImageUrl = coverImage;
      if (file) {
        coverImageUrl = await uploadImage(file);
      }

      const body = editingId
        ? { title, content, coverImage: coverImageUrl }
        : {
            projectId: CurrentProjectId,
            title,
            content,
            coverImage: coverImageUrl,
          };

      const res = await fetch(
        editingId
          ? `${APP_URL}/api/article/${editingId}`
          : `${APP_URL}/api/article`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed");

      const article = json.data.article;

      await fetch("/api/revalidate-articles");

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

  const handleEditClick = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content || "<p></p>");
    setCoverImage(article.coverImage);
    setPreview(article.coverImage || "");
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  /* ---------------- delete ---------------- */

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${APP_URL}/api/article/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("فشل حذف المقال");
      await fetch("/api/revalidate-articles");

      setArticles((prev) => prev.filter((a) => a.id !== id));
      setSuccess("تم حذف المقال بنجاح");

      if (editingId === id) resetForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حذف المقال");
    }
  };

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

        {/* Cover Image Upload */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500"
          onClick={() => document.getElementById("coverInput")?.click()}>
          {preview || coverImage ? (
            <Image
              src={preview || (coverImage as string)}
              width={600}
              height={400}
              alt="معاينة صورة الغلاف"
              className="max-h-32 object-contain"
            />
          ) : (
            <p className="text-gray-500 text-xs">انقر لإضافة صورة الغلاف</p>
          )}
          <Input
            id="coverInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Content Editor */}
        <ArticleEditor content={content} onChange={setContent} />

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
              <div
                key={article.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-100 rounded-lg px-4 py-3">
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
                  <div className="space-y-1 max-w-full">
                    <h3 className="font-medium text-[#332822]">
                      {article.title}
                    </h3>
                    {article.content && (
                      <div
                        className="text-xs text-slate-500 line-clamp-3 prose max-w-full"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(article)}
                    className="text-xs md:text-sm px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50">
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-xs md:text-sm px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600">
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
