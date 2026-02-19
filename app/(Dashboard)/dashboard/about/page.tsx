import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import AboutProjectForm from "./_components/AboutProjectForm";

interface AboutSection {
  id: string;
  label: string;
  title: string;
  description1: string;
  image: string | null;
}

export interface GetAboutProjectResponse {
  success: boolean;
  message: string;
  data: {
    about: AboutSection;
  };
}

export default async function AboutProject() {
  const res = await fetch(
    `${APP_URL}/api/dashboard/${CurrentProjectId}/get-about-project`,
    {
      cache: "no-store",
    }
  );
  const data: GetAboutProjectResponse = await res.json();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة قسم من نحن</h1>
      <AboutProjectForm projectId={CurrentProjectId} about={data.data.about} />
    </div>
  );
}
