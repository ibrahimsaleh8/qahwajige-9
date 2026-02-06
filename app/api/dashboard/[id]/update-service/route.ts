// app/api/dashboard/[id]/update-service/route.ts
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
    const { serviceId, title, description, icon } = body ?? {};

    if (!serviceId || !title || !description || !icon) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "serviceId, title, description, and icon are required",
        },
        { status: 400 },
      );
    }

    // Verify the service exists and belongs to this project
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        section: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (existingService.section.projectId !== id) {
      return NextResponse.json(
        { error: "Service does not belong to this project" },
        { status: 403 },
      );
    }

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
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
        message: "Service updated successfully",
        data: {
          service: {
            id: updatedService.id,
            sectionId: updatedService.sectionId,
            title: updatedService.title,
            description: updatedService.description,
            icon: updatedService.icon,
            createdAt: updatedService.createdAt.toISOString(),
            updatedAt: updatedService.updatedAt.toISOString(),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      {
        error: "Failed to update service",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
