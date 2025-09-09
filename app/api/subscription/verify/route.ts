import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db/db";
import { payments } from "@/lib/db/schema";

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET!;
  const body = await req.json();
  console.log("body", body);
  const {
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    userId,
  } = body;

  if (
    !razorpay_subscription_id ||
    !userId ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return NextResponse.json(
      { success: false, error: "Missing required payment parameters" },
      { status: 400 },
    );
  }
  const generated_signature = crypto
    .createHmac("sha256", keySecret)
    .update(razorpay_payment_id + "|" + razorpay_subscription_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    await db.insert(payments).values({
      razorpayPaymentId: razorpay_subscription_id,
      userId: userId,
      webhookConfirmed: false, // Will be true when webhook processes
    });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
