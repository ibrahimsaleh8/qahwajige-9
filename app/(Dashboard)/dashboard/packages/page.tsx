import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import PackageForm from "./_components/PackageForm";

export interface Package {
  id: string;
  projectId: string;
  title: string;
  features: string[];
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetPackagesResponse {
  success: boolean;
  message?: string;
  data: Package | Package[];
}

export default async function PackagesPage() {
  let packages: Package[] = [];

  try {
    const res = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/packages`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data: GetPackagesResponse = await res.json();
      const pkgData = data.data;
      packages = Array.isArray(pkgData) ? pkgData : pkgData ? [pkgData] : [];
    }
  } catch {
    packages = [];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة الباقات</h1>
      <PackageForm projectId={CurrentProjectId} packages={packages} />
    </div>
  );
}
