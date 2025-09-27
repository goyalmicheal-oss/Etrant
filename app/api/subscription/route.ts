import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { subscriptions } from "@/data/subscription-plan";
import { studentEmailDomains } from "@/data/student-email-domains";

export async function POST(req: Request) {
  try {
    const { plan, userMail } = await req.json();

    const student = studentEmailDomains.filter(
      (email) => userMail.split("@")[1] === email,
    );
    // const final_subscriptions = student.length > 0 ? discount_price : plans;

    if (!plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 });
    }

    const userPlan = subscriptions.find((p) => p.name === plan);
    if (!userPlan) {
      return NextResponse.json(
        { error: `Plan '${plan}' not found` },
        { status: 400 },
      );
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: userPlan.plan_id,
      total_count: 12, // 12 billing cycles (1 year if monthly)
      customer_notify: 1,
      notes: {
        userMail: userMail,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (err: any) {
    console.error("Razorpay subscription error:", err);

    return NextResponse.json(
      { error: "Failed to create subscription. Please try again later." },
      { status: 500 },
    );
  }
}
