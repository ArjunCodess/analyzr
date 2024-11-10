import Link from "next/link";
import { Globe, Github, Instagram, Twitter } from "lucide-react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center py-12 px-4 space-y-8 border-t border-neutral-800">
      <TextHoverEffect text="analyzr." />

      <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-neutral-500">
        <Link
          href="https://github.com/ArjunCodess/analyzr#readme"
          className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Documentation
        </Link>
        <Link
          href="/dashboard"
          className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          Settings & API Keys
        </Link>
      </nav>

      <div className="flex items-center space-x-6">
        <Link
          href="https://getanalyzr.vercel.app"
          className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Website</span>
        </Link>
        <Link
          href="https://github.com/arjuncodess"
          className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </Link>
        <Link
          href="https://instagram.com/arjuncodess"
          className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-5 w-5" />
          <span className="sr-only">Instagram</span>
        </Link>
        <Link
          href="https://x.com/arjuncodess"
          className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-5 w-5" />
          <span className="sr-only">Threads</span>
        </Link>
      </div>

      <p className="text-sm text-neutral-500">
        © 2024 Analyzr. Complete analytics and monitoring for modern applications.
      </p>
    </footer>
  );
}
