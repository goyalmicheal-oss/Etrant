"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Brain,
  Map,
  Newspaper,
  Youtube,
  Gamepad2,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Instagram-Style Learning",
    description:
      "Swipe through bite-sized knowledge reels that make complex topics digestible and fun.",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    delay: 0,
  },
  {
    icon: Brain,
    title: "Smart Quiz Engine",
    description:
      "AI-powered quizzes tailored to JEE, NEET, UPSC, and other competitive exams.",
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
    delay: 0.1,
  },
  {
    icon: Newspaper,
    title: "Daily Current Affairs",
    description:
      "Automated UPSC-focused news digest delivered fresh every morning at your fingertips.",
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    delay: 0.2,
  },
  {
    icon: Map,
    title: "Visual Knowledge Maps",
    description:
      "Interactive mind maps that show your learning journey and topic connections.",
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    delay: 0.3,
  },
  {
    icon: Youtube,
    title: "Multi-Source Content",
    description:
      "Research papers, YouTube videos, and blogs converted into snackable learning reels.",
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    delay: 0.4,
  },
  {
    icon: Gamepad2,
    title: "Gamified Experience",
    description:
      "Earn XP, maintain streaks, compete on leaderboards, and unlock achievement badges.",
    color: "bg-gradient-to-br from-cyan-500 to-teal-600",
    delay: 0.5,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20 bg-gray-950">
      {" "}
      {/* Changed background */}
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            {" "}
            {/* Changed text color */}
            Why should you use
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Etrant
            </span>{" "}
            {/* Adjusted gradient for dark theme */}
          </h2>
          <p className="md:text-xl text-gray-300 max-w-3xl mx-auto">
            {" "}
            {/* Changed text color */}
            We've reimagined learning for the TikTok generation. Every feature
            is designed to make studying as addictive as social media.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-800">
                {" "}
                {/* Changed card background and border */}
                <div
                  className={`md:w-16 md:h-16 w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="md:h-8 md:w-8 h-6 w-6 text-white" />
                </div>
                <h3 className="md:text-2xl text-xl font-bold text-white mb-4">
                  {" "}
                  {/* Changed text color */}
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {" "}
                  {/* Changed text color */}
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
