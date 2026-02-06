import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Project id is required" },
        { status: 400 },
      );
    }

    // Get project with whyUs section and features
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        whyUsSection: {
          include: {
            features: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.whyUsSection) {
      return NextResponse.json(
        { error: "WhyUs section not found for this project" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "WhyUs data retrieved successfully",
        data: {
          whyUsSection: {
            id: project.whyUsSection.id,
            label: project.whyUsSection.label,
            title: project.whyUsSection.title,
            description: project.whyUsSection.description,
            features: project.whyUsSection.features.map((feature) => ({
              id: feature.id,
              sectionId: feature.sectionId,
              icon: feature.icon,
              title: feature.title,
              description: feature.description,
              createdAt: feature.createdAt.toISOString(),
              updatedAt: feature.updatedAt.toISOString(),
            })),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching whyUs data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch whyUs data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
