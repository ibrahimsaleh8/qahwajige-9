"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toast } from "@/app/(Dashboard)/_components/Toast";
import Image from "next/image";

interface AboutSection {
  id: string;
  label: string;
  title: string;
  description1: string;
  image: string | null;
}

interface AboutProjectFormProps {
  projectId: string;
  about: AboutSection;
}

export default function AboutProjectForm({
  projectId,
  about,
}: AboutProjectFormProps) {
  const [formData, setFormData] = useState({
    label: about.label,
    title: about.title,
    description1: about.description1,
    image: about.image ?? "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(about.image ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/upload-images`,
      {
        method: "POST",
        body: data,
      },
    );

    const result = await res.json();
    return result.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image;
      let res;
      if (file) {
        imageUrl = await uploadImage(file);

        res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${projectId}/update-about-project`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, image: imageUrl }),
          },
        );
      } else {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${projectId}/update-about-project`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData }),
          },
        );
      }

      if (res.ok) {
        Toast({ icon: "success", message: "تم حفظ بيانات من نحن بنجاح" });
      } else {
        const errorData = await res.json().catch(() => null);
        console.error("Error response:", errorData);
        Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
      }
    } catch (error) {
      console.error("Error saving about project data:", error);
      Toast({ icon: "error", message: "حدث خطأ أثناء الحفظ" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">قسم من نحن</h2>

        <div>
          <label htmlFor="label" className="block mb-2 font-medium">
            التصنيف
          </label>
          <Input
            id="label"
            name="label"
            type="text"
            placeholder="عنوان صغير للقسم"
            value={formData.label}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block mb-2 font-medium">
            العنوان
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="عنوان رئيسي للقسم"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description1" className="block mb-2 font-medium">
            الوصف
          </label>
          <Textarea
            id="description1"
            name="description1"
            placeholder="وصف قسم من نحن"
            value={formData.description1}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        {/* Image Upload Box */}
        <div>
          <label className="block mb-2 font-medium">صورة القسم الرئيسى</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition"
            onClick={() => document.getElementById("fileInput")?.click()}>
            {preview ? (
              <Image
                width={1000}
                height={1000}
                src={preview}
                alt="معاينة الصورة"
                className="max-h-48 object-contain"
              />
            ) : (
              <p className="text-gray-500">انقر أو اسحب لإضافة صورة</p>
            )}
            <Input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-40 cursor-pointer">
        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
