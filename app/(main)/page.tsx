// app/page.tsx
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import { GallerySection } from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import FAQSection from "@/components/FAQSection";
import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { ProjectContentResponse } from "@/lib/responseType";
import PremiumPackagesSection from "@/components/PremiumPackagesSection";
import RatingSection from "@/components/RatingSection";
import CustomSection from "@/components/CustomSection";
import HomeArticlesSection, {
  HomeArticle,
} from "@/components/HomeArticlesSection";

export default async function HomePage() {
  let data;
  let homeArticles: HomeArticle[] = [];

  try {
    const res = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/main-data`,
    );
    data = (await res.json()) as ProjectContentResponse;
  } catch (error) {
    console.error("Failed to fetch project content:", error);

    data = {
      header: { brandName: "قهوجيين الرياض" },
      hero: { headline: "", subheadline: "", whatsApp: "" },
      about: { label: "", title: "", description1: "", image: "" },
      services: { label: "", title: "", description: "", items: [] },
      whyUs: { label: "", title: "", description: "", features: [] },
      gallery: [],
      footer: {
        brandName: "قهوجيين الرياض",
        phone: "",
        email: "",
        address: "",
      },
      customSections: [],
    };
  }

  try {
    const articlesRes = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/articles/category/${encodeURIComponent("الصفحة-الرئيسية")}`,
    );
    if (articlesRes.ok) {
      const articlesData = await articlesRes.json();
      homeArticles = articlesData.data?.articles || [];
    }
  } catch (error) {
    console.error("Failed to fetch home articles:", error);
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-main-background))] text-slate-100 overflow-x-hidden">
      <HeroSection {...data.hero} />
      <AboutSection {...data.about} />
      <ServicesSection {...data.services} />
      <WhyUsSection {...data.whyUs} />

      {data.customSections &&
        data.customSections.length > 0 &&
        data.customSections.map((customSection, index) => (
          <CustomSection
            key={customSection.id}
            {...customSection}
            index={index}
          />
        ))}

      <PremiumPackagesSection
        packages={data.packages ?? []}
        whatsapp={data.hero?.whatsApp ?? ""}
      />
      <RatingSection
        projectId={CurrentProjectId}
        averageRating={data.rating?.averageRating ?? 0}
        totalRatings={data.rating?.totalRatings ?? 0}
      />

      <GallerySection gallery={data.gallery} />
      <FAQSection />

      {data.showContactSection && (
        <ContactSection {...data.footer} whatsapp={data.hero?.whatsApp ?? ""} />
      )}

      <HomeArticlesSection articles={homeArticles} />
    </div>
  );
}
