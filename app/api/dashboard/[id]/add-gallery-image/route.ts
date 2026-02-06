// app/api/dashboard/[id]/add-gallery-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CurrentProjectId } from "@/lib/ProjectId";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
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

    // Verify project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const alt = formData.get("alt") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          message: "Only JPEG, PNG, WebP, and GIF images are allowed",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large",
          message: "File size must be less than 10MB",
        },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `projects/${id}/gallery`,
            resource_type: "image",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else if (!result) {
              reject(new Error("Cloudinary upload returned no result"));
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(buffer);
      },
    );
    const cloudinaryResult = uploadResult;

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 },
      );
    }

    // Save to database
    const galleryImage = await prisma.galleryImage.create({
      data: {
        projectId: id,
        url: cloudinaryResult.secure_url,
        alt: alt || null,
      },
    });
    revalidatePath(`project/${CurrentProjectId}/main-data`);
    return NextResponse.json(
      {
        success: true,
        message: "Gallery image added successfully",
        data: {
          galleryImage: {
            id: galleryImage.id,
            projectId: galleryImage.projectId,
            url: galleryImage.url,
            alt: galleryImage.alt,
            cloudinaryPublicId: cloudinaryResult.public_id,
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            format: cloudinaryResult.format,
            createdAt: galleryImage.createdAt.toISOString(),
            updatedAt: galleryImage.updatedAt.toISOString(),
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      {
        error: "Failed to add gallery image",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
