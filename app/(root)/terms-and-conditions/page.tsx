import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen text-white px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 max-md:text-sm">
            Welcome to Etrant. By accessing and using our platform, you agree to
            the following Terms and Conditions.
          </p>
          <p className="text-gray-500 text-xs md:text-sm mt-2">
            Last updated: July 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 max-md:text-sm">
                By signing in and using Etrant, you agree to be bound by these
                Terms and Conditions and our Privacy Policy. If you do not
                agree, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                2. Eligibility
              </h2>
              <div className="text-gray-300 max-md:text-sm space-y-3">
                <p>You must be at least 13 years old to use Etrant.</p>
                <p>
                  If you are under 18, you confirm that you have permission from
                  a parent or legal guardian.
                </p>
              </div>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                3. Use of the Platform
              </h2>
              <p className="text-gray-300 max-md:text-sm space-y-3">
                Etrant provides AI-powered learning content including reels,
                quizzes, and summaries. By using our platform, you agree to:
              </p>
              <ul className="text-gray-300 max-md:text-sm space-y-2 mt-2 ml-6">
                <li>• Use Etrant for personal and educational purposes only</li>
                <li>• Not attempt to hack, misuse, or disrupt the platform</li>
                <li>
                  • Respect the intellectual property rights of Etrant and
                  third-party sources
                </li>
              </ul>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                4. Account & Authentication
              </h2>
              <div className="text-gray-300 max-md:text-sm space-y-3">
                <p>You can sign in to Etrant using Google Sign-In.</p>
                <p>
                  You are responsible for maintaining the security of your
                  account.
                </p>
                <p>
                  Etrant is not responsible for unauthorized access caused by
                  negligence in safeguarding login credentials.
                </p>
              </div>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                5. Content Disclaimer
              </h2>
              <div className="text-gray-300 max-md:text-sm space-y-3">
                <p>
                  Etrant generates summaries and quizzes using AI technology.
                  While we strive for accuracy, we do not guarantee 100%
                  correctness.
                </p>
                <p>
                  The platform is for educational and informational purposes
                  only and should not be treated as a replacement for official
                  study material.
                </p>
              </div>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                6. Privacy
              </h2>
              <p className="text-gray-300 max-md:text-sm space-y-3">
                Your personal information is handled in accordance with our
                Privacy Policy. By using Etrant, you consent to the collection
                and use of your data as outlined in the policy.
              </p>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                7. Limitation of Liability
              </h2>
              <div className="text-gray-300 max-md:text-sm space-y-3">
                <p>
                  Etrant is provided "as is" without warranties of any kind.
                </p>
                <p>
                  We are not liable for any direct, indirect, or incidental
                  damages arising from the use of our platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-gray-300 max-md:text-sm">
                We may update these Terms & Conditions from time to time.
                Continued use of the platform after updates means you accept the
                revised terms.
              </p>
            </section>

            <section>
              <h2 className="md:text-xl font-semibold text-white mb-4">
                9. Contact Us
              </h2>
              <p className="text-gray-300 max-md:text-sm mb-3">
                If you have any questions regarding these Terms & Conditions,
                please contact us at:
              </p>
              <div className="flex items-center gap-2 text-blue-400">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:support@wikireel.in"
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
          <div className="flex flex-col sm:flex-row gap-4 max-md:text-sm justify-center mb-6">
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                I Agree - Start Learning
              </Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            By continuing to use Etrant, you acknowledge that you have read and
            agree to these Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
