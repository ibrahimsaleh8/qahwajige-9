// app/api/dashboard/[id]/update-why-us-feature/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CurrentProjectId } from "@/lib/ProjectId";

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
    const { featureId, title, description, icon } = body ?? {};

    if (!featureId || !title || !description || !icon) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "featureId, title, description, and icon are required",
        },
        { status: 400 },
      );
    }

    // Verify the feature exists and belongs to this project
    const existingFeature = await prisma.whyUsFeature.findUnique({
      where: { id: featureId },
      include: {
        section: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!existingFeature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    if (existingFeature.section.projectId !== id) {
      return NextResponse.json(
        { error: "Feature does not belong to this project" },
        { status: 403 },
      );
    }

    // Update the feature
    const updatedFeature = await prisma.whyUsFeature.update({
      where: { id: featureId },
      data: {
        title,
        description,
        icon,
      },
    });
    revalidatePath(`project/${CurrentProjectId}/main-data`);

    return NextResponse.json(
      {
        success: true,
        message: "Why Us feature updated successfully",
        data: {
          feature: {
            id: updatedFeature.id,
            sectionId: updatedFeature.sectionId,
            title: updatedFeature.title,
            description: updatedFeature.description,
            icon: updatedFeature.icon,
            createdAt: updatedFeature.createdAt.toISOString(),
            updatedAt: updatedFeature.updatedAt.toISOString(),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating why us feature:", error);
    return NextResponse.json(
      {
        error: "Failed to update why us feature",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
