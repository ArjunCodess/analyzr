"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/config/supabase";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Snippet from "./snippet";

export default function AddWebsite() {
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [error, setError] = useState("");

  const addWebsite = async () => {
    if (website.trim() === "" || loading) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("websites")
        .insert([{ name: website.trim(), user_id: user?.id }])
        .select();

      if (error) throw error;
      setStep(2);
    } catch (err) {
      console.error("Error adding website:", err);
      setError("Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkDomainAddedBefore = async () => {
    try {
      const { data: websites, error } = await supabase
        .from("websites")
        .select("*")
        .eq("name", website.trim());

      if (error) throw error;

      if (websites && websites.length > 0) {
        setError("This domain has already been added.");
        return;
      }

      addWebsite();
    } catch (err) {
      console.error("Error checking domain:", err);
      setError("Failed to check domain. Please try again.");
    }
  };

  useEffect(() => {
    const invalidChars = ["http", "://", "/", "https"];
    const hasInvalidChars = invalidChars.some((char) =>
      website.trim().includes(char)
    );

    if (hasInvalidChars) {
      setError("Please enter the domain only (e.g., google.com).");
    } else {
      setError("");
    }
  }, [website]);

  return (
    <Card className="bg-transparent border-0 text-neutral-50 overflow-hidden">
      <CardHeader>
        <CardTitle>Add Website</CardTitle>
        <CardDescription className="text-neutral-300">
          Add your website to start tracking analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Domain</label>
              <Input
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value.trim().toLowerCase())
                }
                placeholder="example.com"
                className={`text-black ${error ? "border-red-500" : ""}`}
              />
              {error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-neutral-300">
                  Enter the domain or subdomain without &quot;www&quot;
                </p>
              )}
            </div>
            {!error && (
              <Button
                variant="secondary"
                onClick={checkDomainAddedBefore}
                disabled={loading || !website.trim()}
              >
                {loading ? "Adding..." : "Add Website"}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <Snippet />
            <Button
              onClick={() => router.push(`/site/${website.trim()}`)}
              variant="secondary"
            >
              Continue to See Analytics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
