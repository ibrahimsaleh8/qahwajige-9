import { CurrentProjectId } from "@/lib/ProjectId";
import WhyUsForm from "./_components/WhyUsForm";

interface WhyUsFeature {
  id: string;
  sectionId: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface WhyUsSection {
  id: string;
  label: string;
  title: string;
  description: string;
  features: WhyUsFeature[];
}

export interface GetWhyUsResponse {
  success: boolean;
  message: string;
  data: {
    whyUsSection: WhyUsSection;
  };
}

export default async function WhyUs() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${CurrentProjectId}/get-whyus`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch WhyUs data");
  }

  const data: GetWhyUsResponse = await res.json();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة قسم لماذا نحن</h1>

      <WhyUsForm
        projectId={CurrentProjectId}
        whyUsSection={data.data.whyUsSection}
      />
    </div>
  );
}
