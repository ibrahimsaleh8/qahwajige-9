"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { APP_URL } from "@/lib/ProjectId";
import { Check, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";

export interface Package {
  id: string;
  projectId: string;
  title: string;
  features: string[];
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PackageFormProps {
  projectId: string;
  packages: Package[];
}

export default function PackageForm({ projectId, packages }: PackageFormProps) {
  const [existingPackages, setExistingPackages] = useState<Package[]>(packages);

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: "",
    image: "",
    featuresText: "",
  });
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [createPreview, setCreatePreview] = useState<string>("");

  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updateLoadingId, setUpdateLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch(`${APP_URL}/api/upload-images`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (!result.data?.url) {
      throw new Error("فشل في رفع الصورة");
    }
    return result.data.url;
  };

  const parseFeatures = (text: string): string[] => {
    return text
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim() || (!createForm.image.trim() && !createFile)) {
      Toast({ icon: "warning", message: "العنوان والصورة مطلوبان" });
      return;
    }

    setIsCreateLoading(true);
    try {
      let imageUrl = createForm.image.trim();

      if (createFile) {
        imageUrl = await uploadImage(createFile);
      }

      const features = parseFeatures(createForm.featuresText);

      const res = await fetch(`${APP_URL}/api/package`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: createForm.title.trim(),
          image: imageUrl,
          features,
        }),
      });

      const data = await res.json();

      if (res.ok && data.data) {
        setExistingPackages((prev) => [data.data, ...prev]);
        setCreateForm({ title: "", image: "", featuresText: "" });
        setCreateFile(null);
        setCreatePreview("");
        Toast({ icon: "success", message: "تم إنشاء الباقة بنجاح" });
      } else {
        Toast({
          icon: "error",
          message: data.message || data.error || "فشل في إنشاء الباقة",
        });
      }
      await fetch("/api/revalidate-main-data");
    } catch (err) {
      Toast({
        icon: "error",
        message: err instanceof Error ? err.message : "حدث خطأ",
      });
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleCreateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCreateFile(file);
      setCreatePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdatePackage = async (
    pkg: Package,
    updates: { title?: string; features?: string[]; image?: string },
  ) => {
    setUpdateLoadingId(pkg.id);
    try {
      const body: { title?: string; features?: string[]; image?: string } = {};
      if (updates.title !== undefined) body.title = updates.title;
      if (updates.features !== undefined) body.features = updates.features;
      if (updates.image !== undefined) body.image = updates.image;

      const res = await fetch(`${APP_URL}/api/package/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.data) {
        setExistingPackages((prev) =>
          prev.map((x) => (x.id === pkg.id ? data.data : x)),
        );
        setEditingId(null);
        Toast({ icon: "success", message: "تم تحديث الباقة بنجاح" });
      } else {
        Toast({
          icon: "error",
          message: data.message || data.error || "فشل في التحديث",
        });
      }
      await fetch("/api/revalidate-main-data");
    } catch (err) {
      Toast({
        icon: "error",
        message: err instanceof Error ? err.message : "حدث خطأ",
      });
    } finally {
      setUpdateLoadingId(null);
    }
  };

  const handleEditPackage = (pkg: Package, field: string, value: string) => {
    setExistingPackages((prev) =>
      prev.map((x) => {
        if (x.id !== pkg.id) return x;
        if (field === "featuresText") {
          const features = parseFeatures(value);
          return { ...x, features };
        }
        return { ...x, [field]: value };
      }),
    );
  };

  const handleDeletePackage = async (pkg: Package) => {
    const result = await Swal.fire({
      title: "حذف الباقة؟",
      text: `هل أنت متأكد من حذف "${pkg.title}"؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) return;

    setDeleteLoadingId(pkg.id);
    try {
      const res = await fetch(`${APP_URL}/api/package/${pkg.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setExistingPackages((prev) => prev.filter((x) => x.id !== pkg.id));
        setEditingId((id) => (id === pkg.id ? null : id));
        Toast({ icon: "success", message: "تم حذف الباقة بنجاح" });
      } else {
        Toast({
          icon: "error",
          message: data.message || data.error || "فشل في الحذف",
        });
      }
      await fetch("/api/revalidate-main-data");
    } catch (err) {
      Toast({
        icon: "error",
        message: err instanceof Error ? err.message : "حدث خطأ",
      });
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create New Package */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold">إنشاء باقة جديدة</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                العنوان *
              </label>
              <Input
                placeholder="اسم الباقة"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={isCreateLoading}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                الصورة *
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCreateFileChange}
                disabled={isCreateLoading}
                className="mb-2"
              />
              <Input
                placeholder="أو رابط الصورة"
                value={createForm.image}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, image: e.target.value }))
                }
                disabled={isCreateLoading}
              />
              {createPreview && (
                <div className="mt-2 w-24 h-24 relative rounded overflow-hidden border">
                  <img
                    src={createPreview}
                    alt="معاينة"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                المميزات (سطر لكل ميزة)
              </label>
              <Textarea
                placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
                value={createForm.featuresText}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    featuresText: e.target.value,
                  }))
                }
                disabled={isCreateLoading}
                rows={5}
              />
            </div>

            <Button type="submit" disabled={isCreateLoading} className="w-40">
              {isCreateLoading ? "جاري الإنشاء..." : "إنشاء الباقة"}
            </Button>
          </form>
        </div>
      </div>

      {/* Existing Packages - Update */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">الباقات الحالية</h2>
          <span className="text-sm text-gray-500">
            {existingPackages.length} باقة
          </span>
        </div>

        {existingPackages.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-8 text-center text-gray-500">
            لا توجد باقات حالياً. أنشئ باقة جديدة من النموذج أعلاه.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingPackages.map((pkg) => {
              const isEditing = editingId === pkg.id;
              const isLoading = updateLoadingId === pkg.id;
              const isDeleting = deleteLoadingId === pkg.id;
              const featuresText = Array.isArray(pkg.features)
                ? pkg.features.join("\n")
                : "";

              return (
                <div
                  key={pkg.id}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            العنوان
                          </label>
                          <Input
                            value={pkg.title}
                            onChange={(e) =>
                              handleEditPackage(pkg, "title", e.target.value)
                            }
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            رابط الصورة
                          </label>
                          <Input
                            value={pkg.image}
                            onChange={(e) =>
                              handleEditPackage(pkg, "image", e.target.value)
                            }
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            المميزات (سطر لكل ميزة)
                          </label>
                          <Textarea
                            value={featuresText}
                            onChange={(e) =>
                              handleEditPackage(
                                pkg,
                                "featuresText",
                                e.target.value,
                              )
                            }
                            disabled={isLoading}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            disabled={isLoading || isDeleting}
                            onClick={() =>
                              handleUpdatePackage(pkg, {
                                title: pkg.title,
                                features: pkg.features,
                                image: pkg.image,
                              })
                            }
                            className="flex-1">
                            {isLoading ? "جاري الحفظ..." : "حفظ"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading || isDeleting}
                            onClick={() => setEditingId(null)}>
                            إلغاء
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isLoading || isDeleting}
                            onClick={() => handleDeletePackage(pkg)}
                            className="flex items-center gap-1">
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "جاري الحذف..." : "حذف"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold">{pkg.title}</h3>
                        {pkg.image && (
                          <div className="w-full h-60 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={pkg.image}
                              alt={pkg.title}
                              width={1000}
                              height={1000}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        {Array.isArray(pkg.features) &&
                          pkg.features.length > 0 && (
                            <ul className="space-y-1 text-sm">
                              {pkg.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))}
                              {pkg.features.length > 3 && (
                                <li className="text-gray-500">
                                  +{pkg.features.length - 3} ميزة أخرى
                                </li>
                              )}
                            </ul>
                          )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading || isDeleting}
                            onClick={() => setEditingId(pkg.id)}>
                            تعديل
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isLoading || isDeleting}
                            onClick={() => handleDeletePackage(pkg)}
                            className="flex items-center gap-1">
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? "جاري الحذف..." : "حذف"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
