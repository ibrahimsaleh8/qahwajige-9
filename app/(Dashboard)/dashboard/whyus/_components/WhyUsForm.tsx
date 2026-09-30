"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { APP_URL } from "@/lib/ProjectId";
import IconPicker from "@/app/(Dashboard)/dashboard/custom-sections/_components/IconPicker";
import CreateWhyUsModal from "./CreateWhyUsModal";
import { getIconComponent } from "@/lib/getIconComponent";

export interface WhyUsFeature {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhyUsSection {
  id: string;
  label: string;
  title: string;
  description: string;
  features: WhyUsFeature[];
}

interface WhyUsFormProps {
  projectId: string;
  whyUsSection: WhyUsSection;
}

export default function WhyUsForm({ projectId, whyUsSection }: WhyUsFormProps) {
  const [sectionData, setSectionData] = useState({
    label: whyUsSection.label,
    title: whyUsSection.title,
    description: whyUsSection.description,
  });

  const [features, setFeatures] = useState<WhyUsFeature[]>(
    whyUsSection.features,
  );
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [deletingFeatureId, setDeletingFeatureId] = useState<string | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOperation, setLoadingOperation] = useState<
    "section" | "feature" | null
  >(null);

  // --- Section Handlers ---
  const handleSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSectionData({ ...sectionData, [e.target.name]: e.target.value });
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingOperation("section");

    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/update-why-us-section`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionData),
        },
      );

      if (res.ok) {
        Toast({ icon: "success", message: "تم حفظ بيانات القسم بنجاح" });
      } else {
        const errorData = await res.json().catch(() => null);
        Toast({
          icon: "error",
          message: errorData?.message || "حدث خطأ أثناء الحفظ",
        });
      }
      await fetch("/api/revalidate-main-data");
    } catch (error) {
      console.error("Error saving section:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsLoading(false);
      setLoadingOperation(null);
    }
  };

  const handleFeatureChange = (
    featureId: string,
    field: keyof WhyUsFeature,
    value: string,
  ) => {
    setFeatures(
      features.map((f) => (f.id === featureId ? { ...f, [field]: value } : f)),
    );
  };

  const handleCancelFeatureEdit = (featureId: string) => {
    const original = whyUsSection.features.find((f) => f.id === featureId);
    if (original) {
      setFeatures(features.map((f) => (f.id === featureId ? original : f)));
    }
    setEditingFeatureId(null);
  };

  const handleSaveFeature = async (featureId: string) => {
    setIsLoading(true);
    setLoadingOperation("feature");
    const feature = features.find((f) => f.id === featureId);
    if (!feature) return;

    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/update-why-us-feature`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            featureId: feature.id,
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.data?.feature) {
          setFeatures(
            features.map((f) =>
              f.id === featureId ? { ...f, ...data.data.feature } : f,
            ),
          );
        }
        Toast({ icon: "success", message: "تم حفظ الميزة بنجاح" });
        setEditingFeatureId(null);
        await fetch("/api/revalidate-main-data");
      } else {
        const errorData = await res.json().catch(() => null);
        Toast({
          icon: "error",
          message: errorData?.message || "حدث خطأ أثناء الحفظ",
        });
      }
    } catch (error) {
      console.error("Error saving feature:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsLoading(false);
      setLoadingOperation(null);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    const result = await Swal.fire({
      title: "حذف الميزة",
      text: "هل أنت متأكد من رغبتك في حذف هذه الميزة؟ لا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "الغاء",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsLoading(true);
    setLoadingOperation("feature");
    setDeletingFeatureId(featureId);

    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/delete-why-us-feature`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featureId }),
        },
      );

      if (res.ok) {
        setFeatures((prev) =>
          prev.filter((feature) => feature.id !== featureId),
        );
        if (editingFeatureId === featureId) {
          setEditingFeatureId(null);
        }
        Toast({ icon: "success", message: "تم حذف الميزة بنجاح" });
        await fetch("/api/revalidate-main-data");
      } else {
        Toast({
          icon: "error",
          message: "حدث خطأ أثناء الحذف",
        });
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحذف" });
    } finally {
      setIsLoading(false);
      setLoadingOperation(null);
      setDeletingFeatureId(null);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = getIconComponent(iconName);
    return Icon ? (
      <Icon className="w-6 h-6 text-[hsl(var(--primary))]" />
    ) : null;
  };

  return (
    <div className="space-y-8">
      {/* Section Form */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-2xl font-semibold">معلومات قسم لماذا نحن</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSaveSection} className="flex flex-col gap-6">
            <Input
              name="label"
              value={sectionData.label}
              onChange={handleSectionChange}
              placeholder="تصنيف القسم"
              disabled={isLoading}
            />
            <Input
              name="title"
              value={sectionData.title}
              onChange={handleSectionChange}
              placeholder="العنوان الرئيسي"
              disabled={isLoading}
            />
            <Textarea
              name="description"
              value={sectionData.description}
              onChange={handleSectionChange}
              placeholder="وصف القسم"
              rows={4}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-40">
              {loadingOperation === "section" ? "جاري الحفظ..." : "حفظ القسم"}
            </Button>
          </form>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">الميزات المتاحة</h2>
            <span className="text-sm text-gray-500">
              {features.length} {features.length === 1 ? "ميزة" : "ميزات"}
            </span>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-1.5 cursor-pointer">
            إضافة ميزة جديدة
          </Button>
        </div>

        {features.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6 py-8 text-center text-gray-500">
              لا توجد ميزات متاحة حالياً
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
            {features.map((feature) => {
              const isEditing = editingFeatureId === feature.id;
              const isLoadingThis =
                isLoading && loadingOperation === "feature" && isEditing;

              return (
                <div
                  key={feature.id}
                  className="relative flex gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete feature"
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteFeature(feature.id)}
                    disabled={isLoading && deletingFeatureId === feature.id}>
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Icon */}
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
                    {getIcon(feature.icon)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            عنوان الميزة
                          </label>
                          <Input
                            value={feature.title}
                            onChange={(e) =>
                              handleFeatureChange(
                                feature.id,
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder="عنوان الميزة"
                            disabled={isLoadingThis}
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            الوصف
                          </label>
                          <Textarea
                            value={feature.description}
                            onChange={(e) =>
                              handleFeatureChange(
                                feature.id,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={3}
                            placeholder="وصف الميزة"
                            disabled={isLoadingThis}
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            الأيقونة
                          </label>
                          <IconPicker
                            value={feature.icon}
                            onChange={(iconName) =>
                              handleFeatureChange(feature.id, "icon", iconName)
                            }
                            disabled={isLoadingThis}
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleSaveFeature(feature.id)}
                            disabled={isLoadingThis}
                            className="cursor-pointer">
                            {isLoadingThis ? "جاري الحفظ..." : "حفظ"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCancelFeatureEdit(feature.id)}
                            disabled={isLoadingThis}
                            className="cursor-pointer">
                            إلغاء
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => setEditingFeatureId(feature.id)}>
                            تعديل
                          </Button>
                          <span className="text-xs text-gray-500">
                            آخر تحديث:{" "}
                            {new Date(feature.updatedAt).toLocaleDateString(
                              "ar-EG",
                            )}
                          </span>
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

      <CreateWhyUsModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={projectId}
        onCreated={(newFeature) => setFeatures((prev) => [...prev, newFeature])}
      />
    </div>
  );
}
