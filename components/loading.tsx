import Image from "next/image";
import React from "react";

export default function Loading({ text }: { text: string }) {
  return (
    <div className="min-h-screen flex bg-neutral-900/10 p-4 sm:p-6 lg:p-8 items-center justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/spinner.svg"
              alt="Loading"
              width={24}
              height={24}
              className="animate-spin"
            />
            <p className="text-neutral-400 text-lg">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
