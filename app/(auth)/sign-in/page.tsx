"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { supabase } from "@/config/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

export default function SignIn() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const signIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `https://getanalyzr.vercel.app/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError("An error occurred during sign in. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show the sign-in page if we're already authenticated
  if (loading || user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in
          </CardTitle>
          <CardDescription className="text-center">
            Use your Google account to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="outline"
            onClick={signIn}
            disabled={isLoading}
            className="w-full max-w-sm"
          >
            {isLoading ? (
              <Image
                src="/spinner.svg"
                alt="Loading"
                width={16}
                height={16}
                className="mr-2 animate-spin"
              />
            ) : (
              <Image
                src="/google.svg"
                alt="Google"
                width={16}
                height={16}
                className="mr-2"
              />
            )}
            Sign in with Google
          </Button>
        </CardContent>
        {error && (
          <CardFooter>
            <p className="text-sm text-red-500 text-center w-full">{error}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
