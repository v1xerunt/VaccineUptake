"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();
  const redirectPath = "/nirsevimab";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectPath);
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md px-6"
      >
        <div className="mb-8">
          <svg
            className="w-16 h-16 mx-auto text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Redirecting You
        </h2>
        <p className="text-gray-600 mb-8">
          We&apos;re taking you to the right page...
        </p>

        <div className="flex justify-center mb-6">
          <div className="loader">
            <div className="flex space-x-2">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="h-3 w-3 bg-blue-500 rounded-full"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: dot * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          If you are not redirected automatically, please
          <button
            onClick={() => router.push(redirectPath)}
            className="text-blue-500 hover:text-blue-700 font-medium ml-1 focus:outline-none"
          >
            click here
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-8 text-gray-400 text-sm"
      >
        <div className="flex items-center space-x-1">
          <span>Redirecting to</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
            {redirectPath}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
