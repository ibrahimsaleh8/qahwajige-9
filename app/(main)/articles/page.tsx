import { APP_URL, CurrentProjectId, currentURL } from "@/lib/ProjectId";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

type Article = {
  id: string;
  title: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  content: string | null;
};

type GetArticlesResponse = {
  success: boolean;
  data: {
    articles: Article[];
    count: number;
  };
};

export const metadata: Metadata = {
  title: "خدمات الضيافة العربية | مقالات ونصائح في القهوة وتنظيم المناسبات",
  description:
    "استكشف محتوى متخصص في خدمات الضيافة، القهوة العربية، وتنظيم المناسبات، مع مقالات ونصائح عملية تساعدك على تقديم ضيافة احترافية وتجربة مميزة لضيوفك.",
  alternates: {
    canonical: `${currentURL}/articles`,
  },
  openGraph: {
    title: "خدمات الضيافة العربية | مقالات ونصائح في القهوة وتنظيم المناسبات",
    description:
      "استكشف محتوى متخصص في خدمات الضيافة، القهوة العربية، وتنظيم المناسبات، مع مقالات ونصائح عملية تساعدك على تقديم ضيافة احترافية وتجربة مميزة لضيوفك.",
    url: `${currentURL}/articles`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "خدمات الضيافة العربية | مقالات ونصائح في القهوة وتنظيم المناسبات",
    description:
      "استكشف محتوى متخصص في خدمات الضيافة، القهوة العربية، وتنظيم المناسبات، مع مقالات ونصائح عملية تساعدك على تقديم ضيافة احترافية وتجربة مميزة لضيوفك.",
  },
};

export default async function ArticlesPage() {
  const res = await fetch(
    `${APP_URL}/api/project/${CurrentProjectId}/articles/category/خدمات-الضيافة`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data: GetArticlesResponse = await res.json();
  const articles = data.data.articles;

  return (
    <section id="articles" className="py-10 min-h-[60vh] pt-25">
      <div className="px-4 md:px-6 lg:px-8 container mx-auto text-black">
        {/* Header */}
        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex text-main-color items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70">
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            الصفحة الرئيسية
          </Link>
          <div className="text-center">
            <h1
              className="font-black text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-6"
              style={{ color: "var(--main-color)" }}>
              خدمات الضيافة
            </h1>
          </div>
        </div>

        {articles.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              backgroundColor: "var(--card-background)",
              border: "1px solid var(--border-warm)",
            }}>
            <p
              className="text-base"
              style={{ color: "var(--main-color-dark)" }}>
              لا توجد مقالات متاحة حالياً.
            </p>
          </div>
        ) : (
          <div className="grid md:gap-6 gap-3 grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <Link
                href={`/${article.title.split(" ").join("-")}`}
                key={article.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid var(--border-warm)",
                  boxShadow: "0 4px 20px rgba(44,24,16,0.06)",
                }}>
                {article.coverImage && (
                  <div className="relative w-full md:aspect-4/3 aspect-3/2 overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 md:p-6 p-2">
                  <h2
                    className="font-black md:text-lg text-base mb-3 line-clamp-2"
                    style={{ color: "var(--main-color)" }}>
                    {article.title}
                  </h2>

                  {article.content && (
                    <p
                      className="md:text-sm text-xs leading-relaxed line-clamp-3 flex-1 mb-4"
                      style={{ color: "var(--main-color-dark)" }}>
                      {article.content.replace(/<[^>]+>/g, "")}
                    </p>
                  )}
                  <span className="text-xs text-black/90 mb-2">
                    {new Date(article.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-semibold flex items-center justify-center w-full text-center bg-main-color py-2 rounded-2xl gap-1 ">
                    اقرأ المقال
                    <ArrowLeft className="w-3 h-3" strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
