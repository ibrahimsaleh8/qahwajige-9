import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import SocialMediaForm, {
  SocialMediaLinks,
} from "./_components/SocialMediaForm";

interface SocialMediaResponse {
  success: boolean;
  data: SocialMediaLinks;
}
export const dynamic = "force-dynamic";

export default async function SocialMediaPage() {
  let initialData: SocialMediaLinks | null = null;

  try {
    const res = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/social-media-links`,
      { cache: "no-store" },
    );

    if (res.ok) {
      const json: SocialMediaResponse = await res.json();
      if (json.success && json.data) {
        initialData = json.data;
      }
    }
    // If 404 (not found yet) — initialData stays null and the form will POST
  } catch (err) {
    console.error("Failed to fetch social media links:", err);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          روابط وسائل التواصل الاجتماعي
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          أضف وعدّل روابط حسابات المشروع على منصات التواصل الاجتماعي المختلفة
        </p>
      </div>

      <SocialMediaForm projectId={CurrentProjectId} initialData={initialData} />
    </div>
  );
}
