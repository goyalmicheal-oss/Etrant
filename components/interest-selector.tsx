"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { InterestCategory } from "@/types";
import { setInterests } from "@/actions/setInterest";
import { useUserStore } from "@/lib/store/useUserStore";
import { INTERESTS } from "@/data/interest";
import { toast } from "sonner";

export function InterestSelector() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] =
    useState<InterestCategory | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const userData = await res.json();
      if (userData) {
        setSelectedInterests(userData.interest);
      }
    };
    fetchUser();
  }, []);

  const toggleInterest = (interestId: InterestCategory) => {
    setSelectedInterests(interestId);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      if (selectedInterests) {
        const res = await setInterests(
          selectedInterests,
          user?.email as string,
        );
        console.log("res", res);
        setUser({ ...user, interest: selectedInterests as string });
        if (res.success) {
          // router.push("/ai-questions");
          toast.success("Successfully updated the interest.");
        }
      }
    } catch (error) {
      console.log("interest selection error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-950">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="md:text-4xl text-2xl font-bold text-gray-950 dark:text-white mb-4">
            What interests you?
          </h1>
          <p className="text-gray-700 dark:text-gray-300 md:text-lg">
            Select your interests to get personalized question discoveries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {INTERESTS.map((interest) => (
            <Card
              key={interest.id}
              className={`md:p-4 p-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedInterests === interest.id
                  ? "bg-indigo-600 text-white border-2 border-white"
                  : "bg-gray-700 dark:bg-white/10 text-white border-2 border-white/20 hover:bg-gray-800 dark:hover:bg-white/20"
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="md:text-xl text-lg">{interest.emoji}</span>
                  <span className="font-medium text-sm">{interest.label}</span>
                </div>
                {selectedInterests === interest.id && (
                  <Check className="w-5 h-5" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={loading}
            className="bg-indigo-500 text-white hover:bg-indigo-700 px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
