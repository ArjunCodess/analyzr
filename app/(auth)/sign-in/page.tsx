"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { supabase } from "@/config/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

export default function SignIn() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `https://getanalyzr.vercel.app/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError("An error occurred during sign in. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading('email');
      setError(null);

      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        });

        if (result.error) {
          if (result.error.message.includes('already registered')) {
            setError("This email is already registered. Please sign in instead.");
            setIsSignUp(false);
            return;
          }
          throw result.error;
        }

        if (result.data.user && !result.data.session) {
          setError("Please check your email to confirm your account.");
          return;
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error) {
          if (result.error.message.includes('Invalid login credentials')) {
            throw new Error("Invalid email or password. Please try again.");
          }
          throw result.error;
        }
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred. Please try again.";
      setError(errorMessage);
      console.error("Email auth error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  if (loading || user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center dark bg-neutral-900/50">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {isSignUp 
              ? 'Enter your email below to create your account'
              : 'Enter your email below to sign in to your account'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-accent"
              onClick={() => signInWithProvider('github')}
              disabled={isLoading !== null}
            >
              {isLoading === 'github' ? (
                <Image
                  src="/spinner.svg"
                  alt="Loading"
                  width={20}
                  height={20}
                  className="mr-2 animate-spin"
                />
              ) : (
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="mr-2"
                />
              )}
              GitHub
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-card hover:bg-accent"
              onClick={() => signInWithProvider('google')}
              disabled={isLoading !== null}
            >
              {isLoading === 'google' ? (
                <Image
                  src="/spinner.svg"
                  alt="Loading"
                  width={20}
                  height={20}
                  className="mr-2 animate-spin"
                />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">OR CONTINUE WITH</span>
            </div>
          </div>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading !== null}
                className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-card-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading !== null}
                className="bg-card border-border text-card-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button 
              type="submit"
              className="w-full"
              disabled={isLoading !== null}
            >
              {isLoading === 'email' ? (
                <Image
                  src="/spinner.svg"
                  alt="Loading"
                  width={16}
                  height={16}
                  className="mr-2 animate-spin"
                />
              ) : null}
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-muted-foreground hover:text-card-foreground"
          >
            {isSignUp 
              ? "Already analyzing? Sign in." 
              : "New to Analyzr? Start for free forever."}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}