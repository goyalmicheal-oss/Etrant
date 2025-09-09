"use client";

import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";

const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be atleast 5 characters"),
});

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error as string);
    } else {
      setSuccess(true);
      setEmail("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" text-white rounded-2xl w-full max-w-md"
    >
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Join our waitlist"
        className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 mt-2 text-sm">
          Thank you for joining our waitlist!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Join Waitlist"}
      </button>
    </form>
  );
}
