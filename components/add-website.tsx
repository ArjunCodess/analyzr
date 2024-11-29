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
import { getPageSpeedMetrics } from "@/actions/pageSpeedMetrics";

type Website = {
  id: string;
  name: string;
  user_id: string;
};

export default function AddWebsite() {
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [error, setError] = useState("");
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const addWebsite = async () => {
    if (website.trim() === "" || loading) return;
    setLoading(true);
    setMetricsError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("websites")
        .insert([{ name: website.trim(), user_id: user?.id }])
        .select()
        .returns<Website[]>();

      if (insertError) throw insertError;

      if (data && data[0]) {
        const urlString = website.trim();
        const fullUrl = `https://${urlString}`;
        
        try {
          new URL(fullUrl);
          
          const metrics = await getPageSpeedMetrics(data[0].name, fullUrl);
          
          if (!metrics) {
            console.warn('Failed to fetch metrics for:', fullUrl);
            setMetricsError("Unable to fetch performance metrics. You can try again later from the dashboard.");
          } else {
            console.log('Successfully fetched metrics for:', fullUrl);
          }
        } catch (metricsError) {
          console.error('Metrics error:', metricsError);
          setMetricsError("Unable to analyze website performance. You can try again later from the dashboard.");
        }
      }

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
                {loading ? "Adding & Analyzing..." : "Add Website"}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {metricsError && (
              <p className="text-amber-400 text-sm bg-amber-400/10 p-3 rounded-md">
                {metricsError}
              </p>
            )}
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
