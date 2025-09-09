import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { plans, faqs } from "@/data/data";

export default async function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-6xl font-black mb-6">
            Simple{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 md:mb-8">
            Choose the perfect plan for your learning journey. Start free and
            upgrade anytime.
          </p>
          {/* <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-700/30 rounded-full px-4 py-2"> */}
          {/*   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> */}
          {/*   <span className="text-green-400 text-xs md:text-sm font-medium"> */}
          {/*     7-day free trial on all paid plans */}
          {/*   </span> */}
          {/* </div> */}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
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
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link href="/auth" className="block">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full py-3 text-base font-semibold ${
                        plan.buttonVariant === "default"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>

                {plan.name === "Free" && (
                  <p className="text-xs text-gray-500 text-center">
                    No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="my-20 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-900/30 border border-gray-800 rounded-lg p-6"
              >
                <h3 className="md:text-lg font-semibold text-white mb-2">
                  {faq.question}
                </h3>
                <p className="max-md:text-sm text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
