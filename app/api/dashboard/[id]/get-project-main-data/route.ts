import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: id }],
      },
      select: {
        id: true,
        name: true,
        description: true,
        siteSettings: {
          select: {
            siteTitle: true,
            brandName: true,
            phone: true,
            whatsapp: true,
            email: true,
            address: true,
          },
        },
        heroSection: {
          select: {
            headline: true,
            subheadline: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const main = {
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
      },
      siteSettings: project.siteSettings,
      heroSection: project.heroSection,
    };

    return NextResponse.json({ data: main }, { status: 200 });
  } catch (error) {
    console.error("Error fetching main dashboard data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch main dashboard data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
