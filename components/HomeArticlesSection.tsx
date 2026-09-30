import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type HomeArticle = {
  id: string;
  title: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  content: string | null;
};

interface HomeArticlesSectionProps {
  articles: HomeArticle[];
}

export default function HomeArticlesSection({
  articles,
}: HomeArticlesSectionProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section id="home-articles" className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Articles Grid */}
        <div className="grid md:gap-6 gap-3 grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <Link
              href={`/${article.title.split(" ").join("-")}`}
              key={article.id}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white"
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
                <h3
                  className="font-black md:text-lg text-base mb-3 line-clamp-2"
                  style={{ color: "var(--main-color)" }}>
                  {article.title}
                </h3>

                {article.content && (
                  <p
                    className="md:text-sm text-xs leading-relaxed line-clamp-3 flex-1 mb-4"
                    style={{ color: "var(--main-color-dark)" }}>
                    {article.content.replace(/<[^>]+>/g, "")}
                  </p>
                )}

                <div
                  className="flex items-center justify-center text-center mt-auto text-white py-1.5 rounded-md border-t bg-main-color text-sm md:text-base"
                  style={{ borderColor: "var(--border-warm)" }}>
                  اقرأ المقال
                  <ArrowLeft className="size-4" strokeWidth={2} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
