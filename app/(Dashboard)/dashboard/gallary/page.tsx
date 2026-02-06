// app/dashboard/[id]/gallery/page.tsx
import { CurrentProjectId } from "@/lib/ProjectId";
import GalleryManager from "./_components/GalleryManager";

interface GalleryImage {
  id: string;
  projectId: string;
  url: string;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetGalleryResponse {
  success: boolean;
  data: {
    galleryImages: GalleryImage[];
    count: number;
  };
}

export default async function GalleryPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${CurrentProjectId}/get-gallery-images`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch gallery data");
  }

  const data: GetGalleryResponse = await res.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إدارة معرض الصور</h1>
        <p className="text-sm text-gray-600 mt-1">
          قم بإضافة وإدارة صور المعرض الخاص بموقعك
        </p>
      </div>

      <GalleryManager
        projectId={CurrentProjectId}
        initialImages={data.data.galleryImages}
      />
    </div>
  );
}
