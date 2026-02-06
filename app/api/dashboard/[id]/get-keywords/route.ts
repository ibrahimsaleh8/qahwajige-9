// app/api/dashboard/[id]/get-keywords/route.ts
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

    // Get site settings with keywords
    const siteSettings = await prisma.siteSettings.findUnique({
      where: { projectId: id },
      select: {
        id: true,
        siteKeywords: true,
        siteTitle: true,
        siteDescription: true,
        updatedAt: true,
      },
    });

    if (!siteSettings) {
      return NextResponse.json(
        { error: "Site settings not found for this project" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          keywords: siteSettings.siteKeywords,
          siteTitle: siteSettings.siteTitle,
          siteDescription: siteSettings.siteDescription,
          updatedAt: siteSettings.updatedAt.toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch keywords",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
