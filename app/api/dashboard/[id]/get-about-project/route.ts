import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
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

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        aboutSection: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.aboutSection) {
      return NextResponse.json(
        { error: "About section not found for this project" },
        { status: 404 },
      );
    }

    const about = {
      id: project.aboutSection.id,
      label: project.aboutSection.label,
      title: project.aboutSection.title,
      description1: project.aboutSection.description1,
      image: project.aboutSection.image,
    };

    return NextResponse.json(
      {
        success: true,
        message: "About project data fetched successfully",
        data: {
          about,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching about project data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch about project data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
