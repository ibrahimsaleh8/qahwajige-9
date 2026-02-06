import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.projectId || !body.name || !body.description) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "projectId, name, and description are required",
        },
        { status: 400 }
      );
    }

    // Check if projectId already exists
    const existingProject = await prisma.project.findUnique({
      where: { projectId: body.projectId },
    });

    if (existingProject) {
      return NextResponse.json(
        {
          error: "Project ID already exists",
          message: `A project with ID "${body.projectId}" already exists`,
        },
        { status: 409 }
      );
    }

    // Create project with all related sections
    const project = await prisma.project.create({
      data: {
        projectId: body.projectId,
        name: body.name,
        description: body.description,
        isActive: body.isActive ?? true,
        // Site Settings
        siteSettings: body.siteSettings
          ? {
              create: {
                siteTitle: body.siteSettings.siteTitle,
                siteDescription: body.siteSettings.siteDescription,
                siteKeywords: body.siteSettings.siteKeywords || [],
                phone: body.siteSettings.phone,
                whatsapp: body.siteSettings.whatsapp,
                email: body.siteSettings.email,
                address: body.siteSettings.address,
                brandName: body.siteSettings.brandName,
              },
            }
          : undefined,
        // Hero Section
        heroSection: body.heroSection
          ? {
              create: {
                headline: body.heroSection.headline,
                headlineHighlight: body.heroSection.headlineHighlight,
                subheadline: body.heroSection.subheadline,
                primaryCtaText: body.heroSection.primaryCtaText,
                primaryCtaLink: body.heroSection.primaryCtaLink,
                secondaryCtaText: body.heroSection.secondaryCtaText,
                secondaryCtaLink: body.heroSection.secondaryCtaLink,
                backgroundImage: body.heroSection.backgroundImage,
                isActive: body.heroSection.isActive ?? true,
              },
            }
          : undefined,
        // About Section
        aboutSection: body.aboutSection
          ? {
              create: {
                label: body.aboutSection.label,
                title: body.aboutSection.title,
                description1: body.aboutSection.description1,
                image: body.aboutSection.image,
              },
            }
          : undefined,
        // Services Section
        servicesSection: body.servicesSection
          ? {
              create: {
                label: body.servicesSection.label,
                title: body.servicesSection.title,
                description: body.servicesSection.description,
                services: body.servicesSection.services
                  ? {
                      create: body.servicesSection.services.map(
                        (service: {
                          icon: string;
                          title: string;
                          description: string;
                        }) => ({
                          icon: service.icon,
                          title: service.title,
                          description: service.description,
                        })
                      ),
                    }
                  : undefined,
              },
            }
          : undefined,
        // Why Us Section
        whyUsSection: body.whyUsSection
          ? {
              create: {
                label: body.whyUsSection.label,
                title: body.whyUsSection.title,
                description: body.whyUsSection.description,
                features: body.whyUsSection.features
                  ? {
                      create: body.whyUsSection.features.map(
                        (feature: {
                          icon: string;
                          title: string;
                          description: string;
                        }) => ({
                          icon: feature.icon,
                          title: feature.title,
                          description: feature.description,
                        })
                      ),
                    }
                  : undefined,
              },
            }
          : undefined,
        // Contact Section
        contactSection: body.contactSection
          ? {
              create: {
                label: body.contactSection.label,
                title: body.contactSection.title,
                description: body.contactSection.description,
              },
            }
          : undefined,
        // Gallery Images
        galleryImages: body.galleryImages
          ? {
              create: body.galleryImages.map(
                (image: { url: string; alt?: string }) => ({
                  url: image.url,
                  alt: image.alt,
                })
              ),
            }
          : undefined,
      },
      include: {
        siteSettings: true,
        heroSection: true,
        aboutSection: true,
        servicesSection: {
          include: {
            services: true,
          },
        },
        whyUsSection: {
          include: {
            features: true,
          },
        },
        contactSection: true,
        galleryImages: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        error: "Failed to create project",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
