// app/layout.tsx
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CurrentProjectId } from "@/lib/ProjectId";
import { getProjectMetadata } from "@/server-actions/metatags";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
const cairoFont = Cairo({
  weight: ["1000", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getProjectMetadata(CurrentProjectId);

    const title = data.title || data.brandName;
    const description = data.description;
    const brandName = data.brandName;
    const keywords = data.keywords || [brandName];

    return {
      title,
      description,
      keywords,
      creator: brandName,
      publisher: brandName,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "ar_SA",
        siteName: brandName,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: process.env.NEXT_PUBLIC_APP_URL,
      },
    };
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "قهوجيين الرياض",
      description: "خدمات الضيافة العربية في الرياض",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getProjectMetadata(CurrentProjectId);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <StructuredData
          name={data.brandName}
          description={data.description}
          url={process.env.NEXT_PUBLIC_APP_URL as string}
          phone={data.phone}
        />
      </head>
      <body className={`${cairoFont.className} antialiased`}>
        {children}
        <Analytics />
        <Script id="clixtell-tracking" strategy="afterInteractive">
          {`
            var script = document.createElement('script');
            var prefix = document.location.protocol;
            script.async = true;
            script.type = 'text/javascript';
            var target = prefix + '//scripts.clixtell.com/track.js';
            script.src = target;
            document.head.appendChild(script);
          `}
        </Script>

        <noscript>
          <img
            src="//tracker.clixtell.com/track/t.gif"
            alt="clixtell-tracker"
          />
        </noscript>
      </body>
    </html>
  );
}
