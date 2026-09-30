import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Category } from "../articles/_components/CategoriesManager";
import AIArticleGenerator from "./_components/AIArticleGenerator";

type GetCategoriesResponse = {
  success: boolean;
  data: {
    categories: Category[];
    count: number;
  };
};

export default async function AIArticlesPage() {
  const token = (await cookies()).get("token");
  if (!token) {
    redirect("/login");
  }

  const categoriesRes = await fetch(
    `${APP_URL}/api/project/${CurrentProjectId}/categories`,
    { cache: "no-store" },
  );

  const categoriesData: GetCategoriesResponse = categoriesRes.ok
    ? await categoriesRes.json()
    : { success: true, data: { categories: [], count: 0 } };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#332822]">
          إنشاء مقالات بالذكاء الاصطناعي
        </h1>
        <p className="text-sm text-[#8B7D72] mt-1">
          ولّد مقالات SEO عربية احترافية بضغطة زر، أو حسّن مقالاتك الحالية
          تلقائياً.
        </p>
      </div>

      <AIArticleGenerator
        categories={categoriesData.data.categories}
        token={token.value}
      />
    </div>
  );
}
