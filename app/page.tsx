// app/page.tsx
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { GallerySection } from "@/components/GallerySection";
import { Header } from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import FAQSection from "@/components/FAQSection";
import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { ProjectContentResponse } from "@/lib/responseType";
import PremiumPackagesSection from "@/components/PremiumPackagesSection";
import RatingSection from "@/components/RatingSection";
import FloatedIcons from "@/components/FloatedIcons";

export default async function HomePage() {
  let data;
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
    };
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-main-background))] text-slate-100 overflow-x-hidden">
      <Header brandName={data.header.brandName} telephone={data.footer.phone} />
      <HeroSection {...data.hero} />
      <AboutSection {...data.about} />
      <ServicesSection {...data.services} />
      <WhyUsSection {...data.whyUs} />
      <PremiumPackagesSection
        packages={data.packages ?? []}
        whatsapp={data.hero?.whatsApp ?? ""}
      />
      <RatingSection
        projectId={CurrentProjectId}
        averageRating={data.rating?.averageRating ?? 0}
        totalRatings={data.rating?.totalRatings ?? 0}
      />
      <FloatedIcons
        whatsapp={data.hero?.whatsApp ?? ""}
        telephone={data.footer.phone ?? ""}
      />

      <GallerySection gallery={data.gallery} />
      <FAQSection />
      <ContactSection {...data.footer} whatsapp={data.hero?.whatsApp ?? ""} />
      <Footer {...data.footer} description={data.hero?.subheadline} />
    </div>
  );
}
