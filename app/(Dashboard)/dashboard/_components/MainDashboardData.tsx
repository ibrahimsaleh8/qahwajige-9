"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Toast } from "../../_components/Toast";
import { APP_URL } from "@/lib/ProjectId";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface HeroSectionData {
  headline: string;
  subheadline: string;
}

interface SiteSettings {
  brandName: string;
  siteTitle: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

interface MainDashboardDataProps {
  project: Project;
  siteSettings: SiteSettings;
  heroSectionData: HeroSectionData;
}

export default function MainDashboardData({
  project,
  siteSettings,
  heroSectionData,
}: MainDashboardDataProps) {
  const [formData, setFormData] = useState({
    // Project
    projectName: project.name,
    projectDescription: project.description,

    // Site Settings
    brandName: siteSettings.brandName,
    siteTitle: siteSettings.siteTitle,
    email: siteSettings.email,
    phone: siteSettings.phone,
    whatsapp: siteSettings.whatsapp,
    address: siteSettings.address,

    heroHeadline: heroSectionData.headline,
    heroSubheadline: heroSectionData.subheadline,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        `${APP_URL}/api/dashboard/${project.id}/update-project-main-data`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        Toast({ icon: "success", message: "تم حفظ البيانات بنجاح" });
      } else {
        const errorData = await res.json().catch(() => null);
        console.error("Error response:", errorData);
        Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
      }
      await fetch("/api/revalidate-main-data");
    } catch (error) {
      console.error("Error saving data:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Project Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">بيانات المشروع</h2>

        <div>
          <label htmlFor="projectName" className="block mb-2 font-medium">
            اسم المشروع
          </label>
          <Input
            id="projectName"
            name="projectName"
            type="text"
            placeholder="اسم المشروع"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="projectDescription"
            className="block mb-2 font-medium">
            وصف المشروع
          </label>
          <Textarea
            id="projectDescription"
            name="projectDescription"
            placeholder="وصف المشروع"
            value={formData.projectDescription}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">القسم الرئيسى</h2>

        <div>
          <label htmlFor="heroHeadline" className="block mb-2 font-medium">
            العنوان الرئيسي
          </label>
          <Input
            id="heroHeadline"
            name="heroHeadline"
            type="text"
            placeholder="العنوان الرئيسي في الهيرو"
            value={formData.heroHeadline}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="heroSubheadline" className="block mb-2 font-medium">
            العنوان الفرعي
          </label>
          <Textarea
            id="heroSubheadline"
            name="heroSubheadline"
            placeholder="الوصف أو العنوان الفرعي"
            value={formData.heroSubheadline}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
      </div>

      {/* Site Settings Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">إعدادات الموقع</h2>

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <div>
            <label htmlFor="brandName" className="block mb-2 font-medium">
              اسم العلامة التجارية
            </label>
            <Input
              id="brandName"
              name="brandName"
              type="text"
              placeholder="اسم العلامة التجارية"
              value={formData.brandName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="siteTitle" className="block mb-2 font-medium">
              عنوان الموقع
            </label>
            <Input
              id="siteTitle"
              name="siteTitle"
              type="text"
              placeholder="عنوان الموقع"
              value={formData.siteTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block mb-2 font-medium">
                رقم الهاتف
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block mb-2 font-medium">
                واتساب
              </label>
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="رقم واتساب"
                value={formData.whatsapp}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block mb-2 font-medium">
              العنوان
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="العنوان"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-40 cursor-pointer">
        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
