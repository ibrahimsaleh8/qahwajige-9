import { APP_URL, CurrentProjectId, currentURL } from "@/lib/ProjectId";
import type { MetadataRoute } from "next";
type Article = {
  title: string;
  updatedAt: string;
};
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: Article[] = [];
  try {
    const res = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/articles`,
    );

    if (res.ok) {
      const data = await res.json();
      articles = data.data.articles;
    }
  } catch (error) {
    console.error("Failed to fetch articles for sitemap", error);
  }

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${currentURL}/${article.title.split(" ").join("-")}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [
    {
      url: currentURL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${currentURL}/articles`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...articleRoutes,
  ];
}
