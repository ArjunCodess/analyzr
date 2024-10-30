"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { UserNav } from "@/components/ui/user-nav";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  const protectedPaths = ["/dashboard", "/settings", "/settings/api"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname?.startsWith(path)
  );

  useEffect(() => {
    if (!loading && !user && isProtectedPath) {
      router.push("/sign-in");
    }
  }, [user, loading, isProtectedPath, router]);

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/favicon.ico"
                alt="Analyzr Logo"
                width={32}
                height={32}
              />
            </Link>
            <Link href="/" className="text-xl font-bold">
              Analyzr
            </Link>
          </div>
          <div className="flex items-center md:space-x-4">
            {!loading &&
              (user ? (
                <UserNav />
              ) : (
                <Button variant="secondary" onClick={handleSignIn}>
                  Sign In
                </Button>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
