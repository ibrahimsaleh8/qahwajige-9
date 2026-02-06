// app/api/project/[projectId]/metadata/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const siteSettings = await prisma.siteSettings.findFirst({
      where: {
        project: {
          id,
        },
      },
      select: {
        siteTitle: true,
        siteDescription: true,
        siteKeywords: true,
        brandName: true,
      },
    });

    if (!siteSettings) {
      return NextResponse.json(
        { error: "Metadata not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        title: siteSettings.siteTitle,
        description: siteSettings.siteDescription,
        keywords: siteSettings.siteKeywords,
        brandName: siteSettings.brandName,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET METADATA ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
