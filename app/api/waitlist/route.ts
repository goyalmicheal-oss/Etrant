import { NextResponse } from "next/server";
import { submitWaitlistEmail } from "@/actions/submitEmail";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await submitWaitlistEmail(body, req.headers);
  console.log("result", result);
  return NextResponse.json(result);
}
