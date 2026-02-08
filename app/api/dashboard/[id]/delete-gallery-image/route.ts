// app/api/dashboard/[id]/delete-gallery-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
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
    const { imageId } = body ?? {};

    if (!imageId) {
      return NextResponse.json(
        {
          error: "Missing required field",
          message: "imageId is required",
        },
        { status: 400 },
      );
    }

    // Find the gallery image
    const galleryImage = await prisma.galleryImage.findUnique({
      where: { id: imageId },
    });

    if (!galleryImage) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 },
      );
    }

    // Verify image belongs to this project
    if (galleryImage.projectId !== id) {
      return NextResponse.json(
        { error: "Gallery image does not belong to this project" },
        { status: 403 },
      );
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const urlParts = galleryImage.url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Get everything after "upload/{version}/"
      const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/");
      // Remove file extension
      const publicId = publicIdWithExt.substring(
        0,
        publicIdWithExt.lastIndexOf("."),
      );

      // Delete from Cloudinary
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id: imageId },
    });
    revalidatePath("/", "page");
    return NextResponse.json(
      {
        success: true,
        message: "Gallery image deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      {
        error: "Failed to delete gallery image",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
