"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import { Coffee, Users, Heart, Building2, LucideIcon } from "lucide-react";
import { APP_URL } from "@/lib/ProjectId";

interface Service {
  id: string;
  sectionId: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ServicesSection {
  id: string;
  label: string;
  title: string;
  description: string;
  services: Service[];
}

interface ServicesFormProps {
  projectId: string;
  servicesSection: ServicesSection;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Users,
  Heart,
  Building2,
};

export default function ServicesForm({
  projectId,
  servicesSection,
}: ServicesFormProps) {
  const [sectionData, setSectionData] = useState({
    label: servicesSection.label,
    title: servicesSection.title,
    description: servicesSection.description,
  });

  const [services, setServices] = useState<Service[]>(servicesSection.services);

  const [isLoading, setIsLoading] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  // Track which operation is loading
  const [loadingOperation, setLoadingOperation] = useState<
    "section" | "service" | null
  >(null);

  const handleSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSectionData({
      ...sectionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceChange = (
    serviceId: string,
    field: keyof Service,
    value: string,
  ) => {
    setServices(
      services.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service,
      ),
    );
  };

  const handleSaveService = async (serviceId: string) => {
    setIsLoading(true);
    setLoadingOperation("service");
    const serviceToUpdate = services.find((s) => s.id === serviceId);

    if (!serviceToUpdate) {
      setIsLoading(false);
      setLoadingOperation(null);
      return;
    }

    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/update-service`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId,
            title: serviceToUpdate.title,
            description: serviceToUpdate.description,
            icon: serviceToUpdate.icon,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.data?.service) {
          setServices(
            services.map((service) =>
              service.id === serviceId
                ? { ...service, ...data.data.service }
                : service,
            ),
          );
        }
        Toast({ icon: "success", message: "تم حفظ الخدمة بنجاح" });
        setEditingServiceId(null);
        await fetch("/api/revalidate-main-data");
      } else {
        const errorData = await res.json().catch(() => null);
        console.error("Error response:", errorData);
        Toast({
          icon: "error",
          message: errorData?.message || "حدث خطأ أثناء الحفظ",
        });
      }
    } catch (error) {
      console.error("Error saving service:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsLoading(false);
      setLoadingOperation(null);
    }
  };

  const handleCancelEdit = (serviceId: string) => {
    // Reset service data to original
    const originalService = servicesSection.services.find(
      (s) => s.id === serviceId,
    );
    if (originalService) {
      setServices(
        services.map((service) =>
          service.id === serviceId ? originalService : service,
        ),
      );
    }
    setEditingServiceId(null);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingOperation("section");

    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${projectId}/update-services`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionData),
        },
      );

      if (res.ok) {
        Toast({ icon: "success", message: "تم حفظ بيانات القسم بنجاح" });
      } else {
        const errorData = await res.json().catch(() => null);
        console.error("Error response:", errorData);
        Toast({
          icon: "error",
          message: errorData?.message || "حدث خطأ أثناء الحفظ",
        });
      }
      await fetch("/api/revalidate-main-data");
    } catch (error) {
      console.error("Error saving section data:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsLoading(false);
      setLoadingOperation(null);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  return (
    <div className="space-y-8">
      {/* Section Form */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-2xl font-semibold">معلومات قسم الخدمات</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSaveSection} className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="label"
                  className="block mb-2 font-medium text-gray-700">
                  التصنيف
                </label>
                <Input
                  id="label"
                  name="label"
                  type="text"
                  placeholder="عنوان صغير للقسم"
                  value={sectionData.label}
                  onChange={handleSectionChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 font-medium text-gray-700">
                  العنوان الرئيسي
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="عنوان رئيسي للقسم"
                  value={sectionData.title}
                  onChange={handleSectionChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 font-medium text-gray-700">
                  الوصف
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="وصف قسم الخدمات"
                  value={sectionData.description}
                  onChange={handleSectionChange}
                  disabled={isLoading}
                  rows={4}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-40">
              {loadingOperation === "section"
                ? "جاري الحفظ..."
                : "حفظ التغييرات"}
            </Button>
          </form>
        </div>
      </div>

      {/* Services Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">الخدمات المتاحة</h2>
          <span className="text-sm text-gray-500">
            {services.length} {services.length === 1 ? "خدمة" : "خدمات"}
          </span>
        </div>

        {services.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6 py-8 text-center text-gray-500">
              لا توجد خدمات متاحة حالياً
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const isEditing = editingServiceId === service.id;
              const isThisServiceLoading =
                isLoading && loadingOperation === "service" && isEditing;

              return (
                <div
                  key={service.id}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="p-6 flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                      {getIcon(service.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <Input
                          value={service.title}
                          onChange={(e) =>
                            handleServiceChange(
                              service.id,
                              "title",
                              e.target.value,
                            )
                          }
                          className="text-lg font-semibold"
                          placeholder="عنوان الخدمة"
                          disabled={isThisServiceLoading}
                        />
                      ) : (
                        <h3 className="text-lg font-semibold truncate">
                          {service.title}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 pt-4 space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            الأيقونة
                          </label>
                          <select
                            value={service.icon}
                            onChange={(e) =>
                              handleServiceChange(
                                service.id,
                                "icon",
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isThisServiceLoading}>
                            <option value="Coffee">☕ Coffee - قهوة</option>
                            <option value="Users">👥 Users - مستخدمين</option>
                            <option value="Heart">❤️ Heart - قلب</option>
                            <option value="Building2">
                              🏢 Building2 - مبنى
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            الوصف
                          </label>
                          <Textarea
                            value={service.description}
                            onChange={(e) =>
                              handleServiceChange(
                                service.id,
                                "description",
                                e.target.value,
                              )
                            }
                            rows={4}
                            placeholder="وصف الخدمة"
                            disabled={isThisServiceLoading}
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleSaveService(service.id)}
                            disabled={isThisServiceLoading}
                            size="sm"
                            className="flex-1">
                            {isThisServiceLoading ? "جاري الحفظ..." : "حفظ"}
                          </Button>
                          <Button
                            onClick={() => handleCancelEdit(service.id)}
                            variant="outline"
                            size="sm"
                            disabled={isThisServiceLoading}
                            className="flex-1">
                            إلغاء
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            آخر تحديث:{" "}
                            {new Date(service.updatedAt).toLocaleDateString(
                              "ar-EG",
                            )}
                          </span>
                          <Button
                            onClick={() => setEditingServiceId(service.id)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}>
                            تعديل
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
