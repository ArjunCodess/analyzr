"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PerformanceMetrics } from "@/types";
import {
  fetchPageSpeedMetrics,
  getPageSpeedMetrics,
} from "@/actions/pageSpeedMetrics";
import { Loader2, RefreshCw, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { DETAILED_METRICS, PERFORMANCE_METRICS } from "@/lib/constants";

interface SitePerformanceProps {
  websiteId: string;
  websiteUrl: string;
}

const CircularProgress = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  const circumference = 2 * Math.PI * 40; // 40 is the radius of the circle
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-neutral-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="text-blue-500"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-neutral-300">{label}</span>
    </div>
  );
};

const DetailedMetricCard = ({
  label,
  value,
  format,
}: {
  label: string;
  value: string | number;
  format: string;
}) => {
  const formatMetricValue = (value: string | number, format: string) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    switch (format) {
      case "time":
        return `${(numericValue / 1000).toFixed(2)}s`;
      case "shift":
        return (numericValue / 1000).toFixed(3);
      case "category":
        return numericValue.toString();
      default:
        return value;
    }
  };

  return (
    <div className="group relative rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 transition-all duration-300 ease-in-out hover:bg-neutral-800/50 hover:border-neutral-700">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-neutral-400">{label}</p>
        <p className="text-3xl tracking-tight font-semibold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
          {formatMetricValue(value, format)}
        </p>
      </div>
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const SummaryCard = ({ metrics }: { metrics: PerformanceMetrics }) => {
  const overallScore = Math.round(
    (metrics.performance +
      metrics.accessibility +
      metrics.bestPractices +
      metrics.seo) /
      4
  );
  const isGood = overallScore >= 90;

  return (
    <div className="group relative rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 transition-all duration-300 ease-in-out hover:bg-neutral-800/50 hover:border-neutral-700 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-400">
            Overall Performance
          </p>
          <p className="text-3xl tracking-tight font-semibold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
            {overallScore}
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            isGood ? "bg-green-500/20" : "bg-yellow-500/20"
          }`}
        >
          {isGood ? (
            <ArrowUpIcon className="w-6 h-6 text-green-500" />
          ) : (
            <ArrowDownIcon className="w-6 h-6 text-yellow-500" />
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-500">
        {isGood
          ? "Great job! Your website is performing well."
          : "There's room for improvement in your website's performance."}
      </p>
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default function Performance({
  websiteId,
  websiteUrl,
}: SitePerformanceProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialMetrics = async () => {
      if (!websiteId) {
        setError("Website ID is required");
        return;
      }
      const data = await fetchPageSpeedMetrics(websiteId);
      setMetrics(data);
    };

    loadInitialMetrics();
  }, [websiteId]);

  const refreshMetrics = async () => {
    if (!websiteId || !websiteUrl) {
      setError("Website ID and URL are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newMetrics = await getPageSpeedMetrics(websiteId, websiteUrl);
      setMetrics(newMetrics);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch performance metrics. Please try again later."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!metrics) {
    return (
      <Card className="bg-[#0A0A0A] border border-[#1F1F1F] text-neutral-100">
        <CardHeader className="border-b border-neutral-800">
          <CardTitle className="text-2xl font-bold">
            Performance Metrics
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Website performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <p className="text-lg text-neutral-300">
            No performance data available
          </p>
          <Button
            onClick={refreshMetrics}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Performance"
            )}
          </Button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0A0A0A] border border-[#1F1F1F]">
      <CardHeader className="border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              Performance Metrics
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Website performance analysis
            </CardDescription>
          </div>
          <Button
            onClick={refreshMetrics}
            disabled={loading}
            className="border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {PERFORMANCE_METRICS.map((metric) => (
            <CircularProgress
              key={metric}
              value={Number(metrics[metric as keyof PerformanceMetrics])}
              label={metric.charAt(0).toUpperCase() + metric.slice(1)}
            />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DETAILED_METRICS.map((item) => (
            <DetailedMetricCard
              key={item.label}
              label={item.label}
              value={metrics[item.key as keyof PerformanceMetrics]}
              format={item.format}
            />
          ))}
          <SummaryCard metrics={metrics} />
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}
