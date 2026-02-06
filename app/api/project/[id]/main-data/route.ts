// app/api/projects/[projectId]/content/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        heroSection: true,
        aboutSection: true,
        servicesSection: {
          include: { services: true },
        },
        whyUsSection: {
          include: { features: true },
        },
        contactSection: true,
        galleryImages: true,
        siteSettings: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const response = {
      header: {
        brandName: project.siteSettings?.brandName ?? "",
      },

      hero: project.heroSection
        ? {
            headline: project.heroSection.headline,
            subheadline: project.heroSection.subheadline,
            whatsApp: project.siteSettings?.whatsapp ?? "",
          }
        : null,

      about: project.aboutSection
        ? {
            label: project.aboutSection.label,
            title: project.aboutSection.title,
            description1: project.aboutSection.description1,
            image: project.aboutSection.image ?? null,
          }
        : null,

      services: project.servicesSection
        ? {
            label: project.servicesSection.label,
            title: project.servicesSection.title,
            description: project.servicesSection.description,
            items: project.servicesSection.services.map((s) => ({
              id: s.id,
              icon: s.icon,
              title: s.title,
              description: s.description,
            })),
          }
        : null,

      whyUs: project.whyUsSection
        ? {
            label: project.whyUsSection.label,
            title: project.whyUsSection.title,
            description: project.whyUsSection.description,
            features: project.whyUsSection.features.map((f) => ({
              icon: f.icon,
              title: f.title,
              description: f.description,
            })),
          }
        : null,

      gallery: project.galleryImages.map((img) => ({
        url: img.url,
        alt: img.alt ?? undefined,
      })),

      footer: {
        brandName: project.siteSettings?.brandName ?? "",
        phone: project.siteSettings?.phone ?? "",
        email: project.siteSettings?.email ?? "",
        address: project.siteSettings?.address ?? "",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("GET CONTENT ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
