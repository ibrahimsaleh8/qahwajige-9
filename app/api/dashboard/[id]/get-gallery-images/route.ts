// app/api/dashboard/[id]/get-gallery-images/route.ts
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
        { error: "Project id is required in the route" },
        { status: 400 },
      );
    }

    // Get all gallery images for the project
    const galleryImages = await prisma.galleryImage.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          galleryImages: galleryImages.map((image) => ({
            id: image.id,
            projectId: image.projectId,
            url: image.url,
            alt: image.alt,
            createdAt: image.createdAt.toISOString(),
            updatedAt: image.updatedAt.toISOString(),
          })),
          count: galleryImages.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch gallery images",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
