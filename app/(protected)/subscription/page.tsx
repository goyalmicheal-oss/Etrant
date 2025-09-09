import { faqs } from "@/data/data";
import PricingCard from "@/components/pricing-card";

export default async function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
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
        <PricingCard />

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
