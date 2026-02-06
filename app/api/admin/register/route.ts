import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim().toLowerCase();
    const password = body?.password as string | undefined;
    const Secretpassword = body?.secretpassword as string | undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 },
      );
    }

    if (!Secretpassword) {
      return NextResponse.json(
        { error: "secret passwor is required" },
        { status: 400 },
      );
    }
    if (Secretpassword != process.env.NEXT_PUBLIC_SECRET_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid secret password" },
        { status: 400 },
      );
    }

    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true },
    });

    return NextResponse.json({ success: true, admin }, { status: 201 });
  } catch (error) {
    console.error("Admin register error:", error);
    return NextResponse.json(
      {
        error: "Failed to register admin",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
