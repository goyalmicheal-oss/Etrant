import { db } from "@/lib/db/db";
import { mcqs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  console.log("filesid", fileId);
  try {
    const mcq = await db.select().from(mcqs).where(eq(mcqs.fileId, fileId));
    if (!mcq || mcq.length === 0) {
      return NextResponse.json({ error: "MCQs not found" }, { status: 404 });
    }
    return NextResponse.json(mcq);
  } catch (error) {
    console.log("Error fetching mcqs: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
