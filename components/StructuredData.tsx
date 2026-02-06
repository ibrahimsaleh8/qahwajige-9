export function StructuredData({
  name,
  description,
  url,
  phone,
}: {
  name: string;
  description: string;
  url: string;
  phone?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: name,
    description: description,
    url: url,
    ...(phone && { telephone: phone }),
    address: {
      "@type": "PostalAddress",
      addressLocality: "الرياض",
      addressCountry: "SA",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
