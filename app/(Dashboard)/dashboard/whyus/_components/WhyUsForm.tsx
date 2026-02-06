"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Award, Clock, Shield, Sparkles, LucideIcon } from "lucide-react";

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

const iconMap: Record<string, LucideIcon> = { Award, Clock, Shield, Sparkles };

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
        `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${projectId}/update-why-us-section`,
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
        `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${projectId}/update-why-us-feature`,
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

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
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
      <div className="space-y-4 grid grid-cols-2 items-start gap-3">
        {features.map((feature) => {
          const isEditing = editingFeatureId === feature.id;
          const isLoadingThis =
            isLoading && loadingOperation === "feature" && isEditing;

          return (
            <div
              key={feature.id}
              className="flex gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
                {getIcon(feature.icon)}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                {isEditing ? (
                  <>
                    <Input
                      value={feature.title}
                      onChange={(e) =>
                        handleFeatureChange(feature.id, "title", e.target.value)
                      }
                      placeholder="عنوان الميزة"
                      disabled={isLoadingThis}
                    />
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
                    <select
                      value={feature.icon}
                      onChange={(e) =>
                        handleFeatureChange(feature.id, "icon", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded-md"
                      disabled={isLoadingThis}>
                      <option value="Award">🏆 Award</option>
                      <option value="Clock">⏰ Clock</option>
                      <option value="Shield">🛡️ Shield</option>
                      <option value="Sparkles">✨ Sparkles</option>
                    </select>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleSaveFeature(feature.id)}
                        disabled={isLoadingThis}>
                        {isLoadingThis ? "جاري الحفظ..." : "حفظ"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCancelFeatureEdit(feature.id)}
                        disabled={isLoadingThis}>
                        إلغاء
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        className=""
                        size="sm"
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
    </div>
  );
}
