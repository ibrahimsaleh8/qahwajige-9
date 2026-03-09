import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import ArticlesManager, { Article } from "./_components/ArticlesManager";

type GetArticlesResponse = {
  success: boolean;
  data: {
    articles: Article[];
  };
};

export default async function ArticlesPage() {
  const res = await fetch(
    `${APP_URL}/api/project/${CurrentProjectId}/articles`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data: GetArticlesResponse = await res.json();
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

      <ArticlesManager initialArticles={data.data.articles} />
    </div>
  );
}
