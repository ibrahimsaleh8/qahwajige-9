import { CurrentProjectId } from "@/lib/ProjectId";
import MainDashboardData from "./_components/MainDashboardData";
export type ProjectMainData = {
  data: {
    project: {
      id: string;
      name: string;
      description: string;
    };
    siteSettings: {
      brandName: string;
      siteTitle: string;
      email: string;
      phone: string;
      whatsapp: string;
      address: string;
    };
    heroSection: {
      headline: string;
      subheadline: string;
    };
  };
};
export default async function Dashboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard/${CurrentProjectId}/get-project-main-data`,
  );
  const data = (await res.json()) as ProjectMainData;
  return (
    <div>
      <MainDashboardData
        project={data.data.project}
        siteSettings={data.data.siteSettings}
        heroSectionData={data.data.heroSection}
      />
    </div>
  );
}
