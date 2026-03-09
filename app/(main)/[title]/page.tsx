import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ShareButtons from "./_components/ShareButtons";
import { notFound } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

type Article = {
  id: string;
  title: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  content: string | null;
};

type GetArticleResponse = {
  success: boolean;
  data: {
    article: Article;
  };
};

type Props = {
  params: Promise<{ title: string }>;
};
export async function generateStaticParams() {
  const res = await fetch(
    `${APP_URL}/api/project/${CurrentProjectId}/articles`,
    {
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  const articles = data.data.articles as { title: string }[];

  return articles.map((article) => ({
    title: article.title.split(" ").join("-"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedTitle = await (await params).title.split("-").join(" ");

  const res = await fetch(`${APP_URL}/api/article/title/${decodedTitle}`);

  if (!res.ok) {
    return {
      title: "مقال غير موجود",
      description: "هذا المقال غير متوفر حالياً",
    };
  }

  const data = await res.json();
  const article = data.data.article;

  const url = `${APP_URL}/articles/${(await params).title}`;

  return {
    title: article.title,
    openGraph: {
      title: article.title,
      url,
      type: "article",
      locale: "ar_SA",
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const res = await fetch(
    `${APP_URL}/api/article/title/${title.split("-").join(" ")}`,
  );
  if (!res.ok) {
    notFound();
  }

  const data: GetArticleResponse = await res.json();
  const article = data.data.article;

  return (
    <article className="max-w-4xl mx-auto px-4 py-10 space-y-6 pt-30 text-white">
      <Link
        href="/articles"
        className="text-sm text-white hover:underline inline-flex items-center gap-1">
        الرجوع إلى المقالات
        <IoIosArrowBack />
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {article.title}
        </h1>
        <p className="text-sm text-[#b0b0b0]">
          {new Date(article.createdAt).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {article.coverImage && (
        <div className="relative w-full h-64 md:h-130 rounded-xl overflow-hidden shadow-md">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {article.content && (
        <div
          className="article-content prose max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      )}

      <ShareButtons title={article.title} />
    </article>
  );
}
