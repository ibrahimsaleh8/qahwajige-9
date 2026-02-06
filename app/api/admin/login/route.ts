import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim().toLowerCase();
    const password = body?.password as string | undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: "بريد إلكتروني أو كلمة مرور غير صحيحة" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json(
        { error: "بريد إلكتروني أو كلمة مرور غير صحيحة" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return NextResponse.json(
        { error: "بريد إلكتروني أو كلمة مرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
      {
        expiresIn: "7d", 
      }
    );
  (await cookies()).set('token',token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
  })

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );


  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      {
        error: "Failed to login",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
