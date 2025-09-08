"use client";
import { Check, Loader2 } from "lucide-react";
import { plans, IPlan } from "@/data/data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/lib/store/useUserStore";
import CircleLoader from "./loader/simple-loader-circle";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingCard() {
  return (
    <div className="grid md:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <PayCard plan={plan} key={plan.name} />
      ))}
    </div>
  );
}

const PayCard = ({ plan }: { plan: IPlan }) => {
  const [loading, setLoading] = useState(false);
  const [afterLoading, setAfterLoading] = useState(false);
  const { user } = useUserStore();
  const { data: session } = useSession();

  const subscribe = async (plan: string) => {
    setLoading(true);
    const res = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, userMail: session?.user?.email }),
    });

    const data = await res.json();

    if (data.id) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.id,
        name: "Etrant",
        description:
          plan === "Pro" ? "Pro Plan Subscription" : "Max Plan Subscription",
        image:
          "https://raw.githubusercontent.com/akhil683/wiki-reel/refs/heads/main/public/etrant.png",
        handler: async function (response: any) {
          setAfterLoading(true);

          const verify = await fetch("/api/subscription/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, userId: user?.id }),
          });

          const result = await verify.json();
          console.log("result", result);
          setAfterLoading(false);
          if (result.success) {
            window.location.href = `subscription/success?payment_id=${response.razorpay_payment_id}`;
          } else {
            alert("Payment verification failed!");
          }
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
        },
        upi: {
          flow: "collect", // to show QR + enter UPI ID option
        },
        theme: { color: plan === "Pro" ? "#ec4899 " : "#ec4899 " },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
    setLoading(false);
  };
  return (
    <>
      <Card
        key={plan.name}
        className={`relative bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 ${
          plan.popular ? "ring-2 ring-blue-500/50 scale-105" : ""
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
          </div>
        )}

        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                plan.name === "Free"
                  ? "bg-gray-700"
                  : plan.name === "Pro"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}
            >
              <plan.icon className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            {plan.name}
          </CardTitle>
          <div className="mb-4">
            <span className="text-4xl font-black text-white">
              ₹{plan.price}
            </span>
            <span className="text-gray-400 ml-1">/month</span>
          </div>
          <p className="text-gray-400 text-sm">{plan.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features */}
          <div className="space-y-3">
            {plan.features.map((feature: string) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              onClick={() => subscribe(plan.name)}
              variant={plan.buttonVariant}
              disabled={user?.plan === plan.name}
              className={`w-full py-3 text-base font-semibold ${
                plan.buttonVariant === "default"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              }`}
            >
              {user?.plan === plan.name ? (
                "Already a Member"
              ) : loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                plan.buttonText
              )}
              {}
            </Button>
          </div>

          {plan.name === "Free" && (
            <p className="text-xs text-gray-500 text-center">
              No credit card required
            </p>
          )}
        </CardContent>
      </Card>
      {afterLoading && <CircleLoader />}
    </>
  );
};
