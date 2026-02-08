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
    const { keywords } = body ?? {};

    // Validate keywords
    if (!keywords) {
      return NextResponse.json(
        {
          error: "Missing required field",
          message: "keywords array is required",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(keywords)) {
      return NextResponse.json(
        {
          error: "Invalid data type",
          message: "keywords must be an array of strings",
        },
        { status: 400 },
      );
    }

    // Validate each keyword is a string
    const invalidKeywords = keywords.filter(
      (keyword) => typeof keyword !== "string" || keyword.trim() === "",
    );

    if (invalidKeywords.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid keywords",
          message: "All keywords must be non-empty strings",
        },
        { status: 400 },
      );
    }

    // Trim whitespace from keywords
    const trimmedKeywords = keywords.map((keyword: string) => keyword.trim());

    // Check if site settings exist
    const existingSiteSettings = await prisma.siteSettings.findUnique({
      where: { projectId: id },
    });

    if (!existingSiteSettings) {
      return NextResponse.json(
        { error: "Site settings not found for this project" },
        { status: 404 },
      );
    }

    // Update keywords
    const updatedSiteSettings = await prisma.siteSettings.update({
      where: { projectId: id },
      data: {
        siteKeywords: trimmedKeywords,
      },
      select: {
        id: true,
        siteKeywords: true,
        updatedAt: true,
      },
    });
    revalidatePath("/", "layout");

    return NextResponse.json(
      {
        success: true,
        message: "Keywords updated successfully",
        data: {
          keywords: updatedSiteSettings.siteKeywords,
          updatedAt: updatedSiteSettings.updatedAt.toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating keywords:", error);
    return NextResponse.json(
      {
        error: "Failed to update keywords",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
