// app/dashboard/[id]/gallery/_components/GalleryManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import { Toast } from "@/app/(Dashboard)/_components/Toast";

interface GalleryImage {
  id: string;
  projectId: string;
  url: string;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GalleryManagerProps {
  projectId: string;
  initialImages: GalleryImage[];
}

export default function GalleryManager({
  projectId,
  initialImages,
}: GalleryManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      Toast({ icon: "error", message: "الرجاء اختيار صورة" });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (alt.trim()) {
        formData.append("alt", alt.trim());
      }

      const response = await fetch(
        `/api/dashboard/${projectId}/add-gallery-image`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        Toast({
          icon: "error",
          message: result.message || "فشل في رفع الصورة",
        });
      }

      if (result.success && result.data.galleryImage) {
        // Add new image to the list
        setImages([result.data.galleryImage, ...images]);

        // Reset form
        setPreviewUrl(null);
        setAlt("");
        setSelectedFile(null);
        const fileInput = document.getElementById(
          "gallery-file-input",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Refresh page data
        router.refresh();

        Toast({
          icon: "success",
          message: "تم رفع الصورة بنجاح",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في رفع الصورة";
      Toast({
        icon: "error",
        message: `خطأ: ${errorMessage}`,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      return;
    }

    setDeleting(imageId);

    try {
      const response = await fetch(
        `/api/dashboard/${projectId}/delete-gallery-image`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageId }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        Toast({
          icon: "error",
          message: result.message || "فشل في حذف الصورة",
        });
        return;
      }

      // Remove image from list
      setImages(images.filter((img) => img.id !== imageId));

      // Refresh page data
      router.refresh();

      Toast({
        icon: "success",
        message: "تم حذف الصورة بنجاح",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في حذف الصورة";
      Toast({
        icon: "error",
        message: `خطأ: ${errorMessage}`,
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setAlt("");
    setSelectedFile(null);
    const fileInput = document.getElementById(
      "gallery-file-input",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">إضافة صورة جديدة</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Input */}
          <div>
            <label
              htmlFor="gallery-file-input"
              className="flex gap-2 text-lg w-full border cursor-pointer p-10 border-dashed items-center justify-center font-medium text-gray-700 mb-2">
              <ImageUp className="w-5 h-5" />
              ارفع صورة
            </label>
            <input
              type="file"
              id="gallery-file-input"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              الصيغ المدعومة: JPEG, PNG, WebP, GIF (حد أقصى 10 ميجابايت)
            </p>
          </div>

          {/* Alt Text Input */}
          <div className="w-96">
            <label
              htmlFor="alt-text"
              className="block text-sm font-medium text-gray-700 mb-2">
              النص البديل (اختياري)
            </label>
            <input
              type="text"
              id="alt-text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="وصف الصورة..."
              disabled={uploading}
              className="w-full px-3 py-2 border text-right border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              dir="auto"
            />
            <p className="mt-1 text-xs text-gray-500">
              النص البديل يحسن من السيو وإمكانية الوصول
            </p>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="mt-4 w-fit">
              <p className="text-sm font-medium text-gray-700 mb-2">
                معاينة الصورة:
              </p>
              <div className="relative w-96 h-64 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="معاينة"
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-fit min-w-40 cursor-pointer py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium">
              {uploading ? "جاري الرفع..." : "رفع الصورة"}
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="px-4 py-2 cursor-pointer w-fit border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors">
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Gallery Images List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            معرض الصور ({images.length})
          </h2>
        </div>

        {images.length === 0 ? (
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium">لا توجد صور في المعرض</p>
            <p className="text-sm mt-1">ابدأ بإضافة صور لمعرض الصور</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group h-96 w-96 relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative w-full h-full bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || "صورة المعرض"}
                    fill
                    className="object-cover w-full"
                  />
                </div>

                {/* Alt Text */}
                {image.alt && (
                  <div className="p-3 bg-white">
                    <p
                      className="text-sm text-gray-700 line-clamp-2"
                      dir="auto">
                      {image.alt}
                    </p>
                  </div>
                )}

                {/* Delete Button Overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deleting === image.id}
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors shadow-lg"
                    title="حذف الصورة">
                    {deleting === image.id ? (
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* View Full Size Button */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-lg inline-block"
                    title="عرض بالحجم الكامل">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                {/* Date */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
