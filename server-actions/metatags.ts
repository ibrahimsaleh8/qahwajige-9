// app/server-actions/getMetadata.ts
import prisma from "@/lib/prisma";

export async function getProjectMetadata(projectId: string) {
  try {
    const siteSettings = await prisma.siteSettings.findFirst({
      where: {
        project: { id: projectId },
      },
      select: {
        siteTitle: true,
        siteDescription: true,
        siteKeywords: true,
        brandName: true,
        phone: true,
        email: true,
        address: true,
      },
    });

    if (!siteSettings) {
      throw new Error("Metadata not found");
    }

    return {
      title: siteSettings.siteTitle,
      description: siteSettings.siteDescription,
      keywords: siteSettings.siteKeywords,
      brandName: siteSettings.brandName,
      phone: siteSettings.phone,
      email: siteSettings.email,
      address: siteSettings.address,
    };
  } catch (error) {
    console.error("GET METADATA ERROR:", error);
    throw error;
  }
}
