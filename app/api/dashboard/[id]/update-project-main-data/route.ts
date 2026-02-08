// /api/dashboard/[id]/update-project-main-data
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Project id is required in the route" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const {
      // Project
      projectName,
      projectDescription,

      // Site Settings
      brandName,
      siteTitle,
      email,
      phone,
      whatsapp,
      address,

      // Hero Section (NEW)
      heroHeadline,
      heroSubheadline,
    } = body ?? {};

    if (!projectName || !projectDescription) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "projectName and projectDescription are required",
        },
        { status: 400 },
      );
    }

    // Ensure project exists and load relations
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        siteSettings: true,
        heroSection: true, // 👈 make sure this relation exists
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const [updatedProject, updatedSiteSettings, updatedHeroSection] =
      await prisma.$transaction([
        // Update Project
        prisma.project.update({
          where: { id },
          data: {
            name: projectName,
            description: projectDescription,
          },
        }),

        // Update Site Settings
        prisma.siteSettings.update({
          where: { projectId: id },
          data: {
            brandName: brandName ?? existingProject.siteSettings?.brandName,
            siteTitle: siteTitle ?? existingProject.siteSettings?.siteTitle,
            email: email ?? existingProject.siteSettings?.email,
            phone: phone ?? existingProject.siteSettings?.phone,
            whatsapp: whatsapp ?? existingProject.siteSettings?.whatsapp,
            address: address ?? existingProject.siteSettings?.address,
          },
        }),

        // Update or Create Hero Section
        prisma.heroSection.upsert({
          where: {
            projectId: id,
          },
          update: {
            headline:
              heroHeadline ?? existingProject.heroSection?.headline ?? "",
            subheadline:
              heroSubheadline ?? existingProject.heroSection?.subheadline ?? "",
          },
          create: {
            projectId: id,
            headline: heroHeadline ?? "",
            subheadline: heroSubheadline ?? "",
          },
        }),
      ]);

    const main = {
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        description: updatedProject.description,
      },
      siteSettings: {
        siteTitle: updatedSiteSettings.siteTitle,
        brandName: updatedSiteSettings.brandName,
        phone: updatedSiteSettings.phone,
        whatsapp: updatedSiteSettings.whatsapp,
        email: updatedSiteSettings.email,
        address: updatedSiteSettings.address,
      },
      heroSection: {
        headline: updatedHeroSection.headline,
        subheadline: updatedHeroSection.subheadline,
      },
    };
    revalidatePath("/", "page");

    return NextResponse.json(
      {
        success: true,
        message: "Main dashboard data updated successfully",
        data: main,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating main dashboard data:", error);
    return NextResponse.json(
      {
        error: "Failed to update main dashboard data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
