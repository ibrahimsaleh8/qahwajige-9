// app/api/dashboard/[id]/update-why-us-section/route.ts
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
        whyUsSection: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update or create why us section
    const whyUsSection = await prisma.whyUsSection.upsert({
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
    revalidatePath("/", "page");

    return NextResponse.json(
      {
        success: true,
        message: "Why Us section updated successfully",
        data: {
          whyUsSection: {
            id: whyUsSection.id,
            label: whyUsSection.label,
            title: whyUsSection.title,
            description: whyUsSection.description,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating why us section:", error);
    return NextResponse.json(
      {
        error: "Failed to update why us section",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
