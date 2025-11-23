import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 max-md:text-sm">
            At Etrant, we respect your privacy and are committed to protecting
            your personal data.
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-2">
            Effective Date: August 2025
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className=" md:text-xl font-semibold text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-300 max-md:text-sm mb-3">
                When you use Etrant, we may collect:
              </p>
              <ul className="text-gray-300 space-y-2 max-md:text-sm ml-6">
                <li>
                  • Account Information: Name, email, and profile picture (from
                  Google Sign-In)
                </li>
                <li>
                  • Usage Data: Pages visited, interactions with reels/quizzes,
                  and learning activity
                </li>
                <li>
                  • Device Information: Browser type, IP address, and device
                  details (for performance and security)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="md:text-xl  font-semibold text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-300 mb-3 max-md:text-sm">
                We use the collected information to:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 max-md:text-sm">
                <li>• Provide and improve Etrant's features</li>
                <li>
                  • Personalize your experience (e.g., quizzes and topic
                  recommendations)
                </li>
                <li>• Send important updates, notifications, or reminders</li>
                <li>• Monitor performance and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className=" md:text-xl font-semibold text-white mb-4">
                3. Data Sharing & Third Parties
              </h2>
              <div className="text-gray-300 space-y-3 max-md:text-sm">
                <p>We do not sell your data to third parties.</p>
                <p>
                  Limited data may be shared with trusted services (e.g., Google
                  authentication, analytics providers) strictly for
                  functionality.
                </p>
                <p>
                  Content may include links to external sources (Wikipedia,
                  YouTube, blogs). Etrant is not responsible for their privacy
                  practices.
                </p>
              </div>
            </section>

            <section>
              <h2 className=" md:text-xl font-semibold text-white mb-4">
                4. Cookies & Tracking
              </h2>
              <p className="text-gray-300 mb-3 max-md:text-sm">
                We use cookies and similar technologies to:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 max-md:text-sm">
                <li>• Keep you signed in</li>
                <li>• Analyze traffic and improve user experience</li>
              </ul>
              <p className="text-gray-400 md:text-sm text-xs mt-3">
                You may disable cookies in your browser, but some features may
                not work properly.
              </p>
            </section>

            <section>
              <h2 className=" md:text-xl font-semibold text-white mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-300 max-md:text-sm">
                We implement reasonable security measures to protect your data.
                However, no system is 100% secure, and we cannot guarantee
                absolute protection.
              </p>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-300 mb-3 max-md:text-sm">
                You have the right to:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 max-md:text-sm">
                <li>• Access and update your personal information</li>
                <li>• Request deletion of your account and data</li>
                <li>• Withdraw consent to data usage</li>
              </ul>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-300 mb-3 max-md:text-sm">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="flex items-center gap-2 text-blue-400">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:hello@akkhil.dev"
                  className="hover:text-blue-300"
                >
                  hello@akkhil.dev
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                Start Learning
              </Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            By using Etrant, you acknowledge that you have read and understand
            this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
