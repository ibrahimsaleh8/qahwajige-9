import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import ArticlesManager, { Article } from "./_components/ArticlesManager";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Category } from "./_components/CategoriesManager";
import CategoriesManagerWrapper from "./_components/CategoriesManagerWrapper";

type GetArticlesResponse = {
  success: boolean;
  data: {
    articles: Article[];
  };
};
type GetCategoriesResponse = {
  success: boolean;
  data: {
    categories: Category[];
    count: number;
  };
};
export default async function ArticlesPage() {
  const [articlesRes, categoriesRes] = await Promise.all([
    fetch(`${APP_URL}/api/project/${CurrentProjectId}/articles`, {
      cache: "no-store",
    }),
    fetch(`${APP_URL}/api/project/${CurrentProjectId}/categories`, {
      cache: "no-store",
    }),
  ]);

  if (!articlesRes.ok) {
    throw new Error("Failed to fetch articles");
  }
  const token = (await cookies()).get("token");

  if (!token) {
    redirect("/(Dashboard)/login");
  }

  const data: GetArticlesResponse = await articlesRes.json();
  const categoriesData: GetCategoriesResponse = categoriesRes.ok
    ? await categoriesRes.json()
    : { success: true, data: { categories: [], count: 0 } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#332822]">المقالات</h1>
          <p className="text-sm text-[#8B7D72] mt-1">
            إنشاء وتعديل وحذف المقالات في موقعك.
          </p>
        </div>
      </div>

      <ArticlesManager
        initialArticles={data.data.articles}
        categories={categoriesData.data.categories}
        token={token.value}
      />

      {/* <div className="space-y-2">
        <h2 className="text-xl font-bold text-[#332822]">إدارة التصنيفات</h2>
        <p className="text-sm text-[#8B7D72]">
          أضف وعدّل تصنيفات المقالات لتنظيم محتوى موقعك.
        </p>
      </div>

      <CategoriesManagerWrapper
        initialCategories={categoriesData.data.categories}
        token={token.value}
      /> */}
    </div>
  );
}
