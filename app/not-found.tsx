"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const FuzzyOverlay = () => {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: 'url("/noise.png")',
      }}
      className="pointer-events-none absolute -inset-[100%] opacity-[15%]"
    />
  );
};

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative grid h-screen place-content-center space-y-6 bg-neutral-950 p-8">
        <p className="text-center text-6xl font-black text-neutral-50">
          404 - Data Not Found
        </p>
        <p className="text-center text-neutral-400">
          The metrics you&apos;re looking for seem to have escaped our tracking radar 📊
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link 
            href="/"
            className="border rounded-md text-neutral-20 w-fit px-4 py-2 font-semibold text-neutral-200 transition-colors hover:bg-neutral-800"
          >
            Return to Analytics
          </Link>
          <Link 
            href="/dashboard"
            className="rounded-md w-fit bg-neutral-200 px-4 py-2 font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <FuzzyOverlay />
    </div>
  );
}