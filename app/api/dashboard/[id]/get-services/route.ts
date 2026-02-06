// app/api/dashboard/[id]/get-services/route.ts
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

    // Get project with services section and services
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        servicesSection: {
          include: {
            services: {
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

    if (!project.servicesSection) {
      return NextResponse.json(
        { error: "Services section not found for this project" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Services data retrieved successfully",
        data: {
          servicesSection: {
            id: project.servicesSection.id,
            label: project.servicesSection.label,
            title: project.servicesSection.title,
            description: project.servicesSection.description,
            services: project.servicesSection.services.map((service) => ({
              id: service.id,
              sectionId: service.sectionId,
              icon: service.icon,
              title: service.title,
              description: service.description,
              createdAt: service.createdAt.toISOString(),
              updatedAt: service.updatedAt.toISOString(),
            })),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching services data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch services data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
