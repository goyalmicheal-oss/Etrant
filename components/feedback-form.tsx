"use client";

import { useState } from "react";
import { submitFeedback } from "@/actions/user-feedback";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  feedback: z.string().min(5, "Feedback must be at least 5 characters"),
});

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = feedbackSchema.safeParse({ feedback });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const res = await submitFeedback({ feedback });
    setLoading(false);

    if ("error" in res) {
      setError(res.error as string);
    } else {
      setSuccess(true);
      setFeedback("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-300 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-white p-4 md:p-6 rounded-2xl shadow-md w-full max-w-xl md:min-w-xl"
    >
      <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-100 mb-4">
        We value your feedback
      </h2>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback..."
        className="w-full p-3 rounded-lg border border-gray-400 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
        rows={4}
      />

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 mt-2 text-sm">
          Thank you for your feedback!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Submit Feedback"}
      </button>
    </form>
  );
}
