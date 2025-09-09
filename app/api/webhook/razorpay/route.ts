import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db/db";
import { payments, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";
import { subscriptions } from "@/data/subscription-plan";
import sendSubscriptionEmail from "@/lib/email/subscription-email";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    if (!secret) {
      console.error("Webhook secret missing");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 },
      );
    }

    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const subscription = event.payload?.subscription?.entity;
    const planId = subscription?.plan_id;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      console.warn("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payment = (
      await db
        .select()
        .from(payments)
        .where(eq(payments.razorpayPaymentId, subscription.id))
    )[0];
    console.log("payment schema", payment);
    if (!payment) {
      console.error("Missing customer_id in event");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const current_plan = subscriptions.find((pln) => pln.plan_id == planId);

    if (!current_plan) {
      console.error("Invalid plan id");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    switch (event.event) {
      case "subscription.activated": {
        const user = (
          await db
            .select()
            .from(users)
            .where(eq(users.id, payment.userId as string))
        )[0];
        await sendSubscriptionEmail(
          user?.email,
          user?.name,
          current_plan?.name,
        );
        await db
          .update(users)
          .set({
            plan: current_plan.name,
            subscriptionActive: true,
            subscriptionEnd: format(
              new Date(subscription.current_end * 1000),
              "dd-MM-yyyy",
            ),
          })
          .where(eq(users.id, payment.userId as string));
        break;
      }

      case "subscription.charged": {
        await db
          .update(users)
          .set({
            subscriptionActive: true,
            subscriptionEnd: format(
              new Date(subscription.current_end * 1000),
              "dd-MM-yyyy",
            ),
          })
          .where(eq(users.id, payment.userId as string));
        break;
      }

      case "subscription.halted":
      case "subscription.cancelled": {
        await db
          .update(users)
          .set({ subscriptionActive: false })
          .where(eq(users.id, payment.userId as string));
        break;
      }

      case "payment.failed": {
        console.error("Payment failed:", event.payload.payment.entity);
        await db
          .update(users)
          .set({ subscriptionActive: false })
          .where(eq(users.id, payment.userId as string));
        break;
      }

      default:
        console.log("Unhandled event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
