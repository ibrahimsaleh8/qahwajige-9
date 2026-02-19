import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import MainDashboardData from "./_components/MainDashboardData";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  // Server-side auth guard: if there is no token cookie, redirect to login
  const token = (await cookies()).get("token");

  if (!token) {
    redirect("/(Dashboard)/login");
  }

  const res = await fetch(
    `${APP_URL}/api/dashboard/${CurrentProjectId}/get-project-main-data`,
    {
      cache: "no-store",
    }
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
