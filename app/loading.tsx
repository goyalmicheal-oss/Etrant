"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className=" w-20 h-20 mx-auto">
            <div className="w-full h-full border-4 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin"></div>
          </div>
        </div>

        <h1 className="text-3xl font-black bg-gray-950 dark:text-white mb-4">
          Think{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Etrant
          </span>
        </h1>

        {/* Loading Text */}
        <p className="text-gray-700 dark:text-gray-400 text-lg mb-6">
          Loading your learning experience...
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
