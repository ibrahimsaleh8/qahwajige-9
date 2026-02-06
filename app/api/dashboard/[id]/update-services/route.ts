// app/api/dashboard/[id]/update-services/route.ts
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
    const { label, title, description } = body ?? {};

    if (!label || !title || !description) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "label, title and description are required",
        },
        { status: 400 },
      );
    }

    // Ensure project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        servicesSection: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update or create services section
    const servicesSection = await prisma.servicesSection.upsert({
      where: { projectId: id },
      update: {
        label,
        title,
        description,
      },
      create: {
        projectId: id,
        label,
        title,
        description,
      },
    });
    revalidatePath(`project/${CurrentProjectId}/main-data`);

    return NextResponse.json(
      {
        success: true,
        message: "Services section updated successfully",
        data: {
          servicesSection: {
            id: servicesSection.id,
            label: servicesSection.label,
            title: servicesSection.title,
            description: servicesSection.description,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating services section:", error);
    return NextResponse.json(
      {
        error: "Failed to update services section",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
