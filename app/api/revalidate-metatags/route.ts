import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    revalidateTag("metadata", "max");
    revalidatePath("/", "layout");
    return NextResponse.json({ message: "Revalidation done" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "internal Error" }, { status: 500 });
  }
}
