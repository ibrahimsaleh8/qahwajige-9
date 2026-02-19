import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import ServicesForm from "./_components/ServicesForm";
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

export interface GetServicesResponse {
  success: boolean;
  message: string;
  data: {
    servicesSection: ServicesSection;
  };
}

export default async function Services() {
  const res = await fetch(
    `${APP_URL}/api/dashboard/${CurrentProjectId}/get-services`,
    {
      cache: "no-store",
    }
  );
  const data: GetServicesResponse = await res.json();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة قسم الخدمات</h1>
      <ServicesForm
        projectId={CurrentProjectId}
        servicesSection={data.data.servicesSection}
      />
    </div>
  );
}
