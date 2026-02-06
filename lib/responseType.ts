// Root Response
export type ProjectContentResponse = {
  header: HeaderData;

  hero: HeroSectionData;
  about: AboutSectionData;
  services: ServicesSectionData;
  whyUs: WhyUsSectionData;
  gallery: GalleryImageData[];
  footer: FooterData;
};

// Header & Footer
export type HeaderData = {
  brandName: string;
};

export type FooterData = {
  brandName?: string | null;
  phone?: string;
  email?: string | null;
  address?: string | null;
};

// Hero Section
export type HeroSectionData = {
  headline?: string;
  subheadline?: string;
  whatsApp?: string;
};

// About Section
export type AboutSectionData = {
  label?: string;
  title?: string;
  description1?: string;
  image?: string | null;
};

// Services Section
export type ServiceItemData = {
  id: string;
  icon?: string;
  title?: string;
  description?: string;
};

export type ServicesSectionData = {
  label?: string;
  title?: string;
  description?: string;
  items?: ServiceItemData[];
};

// Why Us Section
export type WhyUsFeatureData = {
  icon?: string;
  title?: string;
  description?: string;
};

export type WhyUsSectionData = {
  label?: string;
  title?: string;
  description?: string;
  features?: WhyUsFeatureData[];
};

// Gallery Images
export type GalleryImageData = {
  url: string;
  alt?: string;
};
