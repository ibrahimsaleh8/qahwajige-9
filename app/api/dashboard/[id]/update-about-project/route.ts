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
    const { label, title, description1, image } = body ?? {};

    if (!label || !title || !description1) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "label, title and description1 are required",
        },
        { status: 400 },
      );
    }

    // Ensure project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        aboutSection: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const aboutSection = await prisma.aboutSection.upsert({
      where: { projectId: id },
      update: {
        label,
        title,
        description1,
        image: image ?? existingProject.aboutSection?.image ?? null,
      },
      create: {
        projectId: id,
        label,
        title,
        description1,
        image: image ?? null,
      },
    });

    const about = {
      id: aboutSection.id,
      label: aboutSection.label,
      title: aboutSection.title,
      description1: aboutSection.description1,
      image: aboutSection.image,
    };
    revalidatePath(`project/${CurrentProjectId}/main-data`);
    return NextResponse.json(
      {
        success: true,
        message: "About project data updated successfully",
        data: {
          about,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating about project data:", error);
    return NextResponse.json(
      {
        error: "Failed to update about project data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
