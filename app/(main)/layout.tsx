import FloatedIcons from "@/components/FloatedIcons";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import PreventCopy from "@/components/PreventCopy";
import { FetchProjectData } from "@/lib/FetchProjectData";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await FetchProjectData();

  return (
    <>
      <Header brandName={data.header.brandName} telephone={data.footer.phone} />
      {children}
      <FloatedIcons
        whatsapp={data.hero?.whatsApp ?? ""}
        telephone={data.footer.phone ?? ""}
      />
      <PreventCopy />
      <Footer {...data.footer} description={data.hero?.subheadline} />
    </>
  );
}
