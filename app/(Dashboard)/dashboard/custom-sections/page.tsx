import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import CustomSectionsClient from "./_components/CustomSectionsClient";
export const dynamic = "force-dynamic";

export interface CustomSectionCard {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomSection {
  id: string;
  projectId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  cards: CustomSectionCard[];
}

interface CustomSectionsResponse {
  success: boolean;
  data: CustomSection[];
}

export default async function CustomSectionsPage() {
  let sections: CustomSection[] = [];

  try {
    const res = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/custom-sections`,
      { cache: "no-store" },
    );

    if (res.ok) {
      const json: CustomSectionsResponse = await res.json();
      if (json.success && Array.isArray(json.data)) {
        sections = json.data;
      }
    }
  } catch (err) {
    console.error("Failed to fetch custom sections:", err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الأقسام المخصصة</h1>
        <p className="mt-1 text-sm text-gray-500">
          أنشئ وأدر الأقسام المخصصة وبطاقاتها على الموقع
        </p>
      </div>

      <CustomSectionsClient
        projectId={CurrentProjectId}
        initialSections={sections}
      />
    </div>
  );
}
