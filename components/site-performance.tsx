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
import { Loader2, ArrowUpIcon, ArrowDownIcon, RefreshCcw } from "lucide-react";
import { DETAILED_METRICS, PERFORMANCE_METRICS } from "@/lib/constants";
import { getCategory, getRecommendations } from "@/lib/utils";

interface SitePerformanceProps {
  websiteId: string;
  websiteUrl: string;
}

const CircularProgress = ({
  value,
  label,
}: {
  value: number | null;
  label: string;
}) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - ((value ?? 0) / 100) * circumference;

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
          <span className="text-2xl font-bold text-white">
            {value === null ? 'N/A' : value}
          </span>
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
  value: string | number | null;
  format: string;
}) => {
  const formatMetricValue = (value: string | number | null, format: string) => {
    if (value === null) return 'N/A';
    
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

function PerformanceScoreCard({ metrics }: { metrics: PerformanceMetrics }) {
  const calculateOverallScore = () => {
    const scores = [
      metrics.performance,
      metrics.accessibility,
      metrics.bestPractices,
      metrics.seo
    ].filter(score => score !== null);

    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => (a ?? 0) + (b ?? 0), 0) / scores.length);
  };

  const overallScore = calculateOverallScore();
  const category = overallScore !== null ? getCategory(overallScore) : {
    isGood: false,
    label: 'No Data',
    color: 'text-neutral-400',
    bg: 'bg-neutral-800'
  };

  return (
    <div className="group relative h-full rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-2 sm:p-4 transition-all duration-300 ease-in-out hover:bg-neutral-800/50 hover:border-neutral-700">
      <div className="flex flex-col h-full items-center justify-center p-4 sm:p-6 rounded-lg bg-neutral-900/90 border border-neutral-800">
        <div className={`p-2 sm:p-3 rounded-full ${category.bg} mb-4 sm:mb-6`}>
          {category.isGood ? (
            <ArrowUpIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${category.color}`} />
          ) : (
            <ArrowDownIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${category.color}`} />
          )}
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent mb-2 sm:mb-3">
            {overallScore === null ? 'N/A' : overallScore}
          </div>
          <div className={`text-xs sm:text-sm md:text-base font-semibold ${category.color} mb-3 sm:mb-4`}>
            {category.label}
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2">
            Overall Score
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-[280px]">
            {category.isGood 
              ? "Your website is performing well across all key metrics"
              : "There's room for improvement in your website's performance"}
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

const OptimizationCard = ({ metrics }: { metrics: PerformanceMetrics }) => {
  const recommendations = getRecommendations(metrics);

  return (
    <div className="group relative h-full rounded-xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 transition-all duration-300 ease-in-out hover:bg-neutral-800/50 hover:border-neutral-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-white">Optimization Opportunities</h3>
          <p className="text-sm md:text-base text-neutral-400">Actionable recommendations to improve your site</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div
              key={index}
              className="group/card flex items-start space-x-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 transition-all duration-300 hover:bg-neutral-800/50 hover:border-neutral-700"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-neutral-800/50 text-2xl">
                {rec.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-medium text-neutral-200 truncate">{rec.title}</h4>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    typeof rec.metric === 'number' && rec.metric >= 90
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {rec.metric}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 line-clamp-2">{rec.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <ArrowUpIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-neutral-400 text-center">Great job! No immediate improvements needed.</p>
          </div>
        )}
      </div>
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
        setError("[Performance] Website ID is required");
        return;
      }
      try {
        const data = await fetchPageSpeedMetrics(websiteId);
        setMetrics(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`[Performance] Failed to load initial metrics: ${errorMessage}`);
        console.error('[Performance] Error loading initial metrics:', err);
      }
    };

    loadInitialMetrics();
  }, [websiteId]);

  const refreshMetrics = async () => {
    if (!websiteId || !websiteUrl) {
      setError("[Performance] Missing required parameters: website ID or URL");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newMetrics = await getPageSpeedMetrics(websiteId, websiteUrl);
      setMetrics(newMetrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`[Performance] Failed to fetch metrics: ${errorMessage}`);
      console.error('[Performance] Error refreshing metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!metrics || metrics == null) {
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
            <CardTitle className="text-xl font-bold text-white">
              Performance Metrics
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Website performance analysis
            </CardDescription>
          </div>
          <Button
            onClick={refreshMetrics}
            disabled={loading}
            variant="outline"
            size="icon"
            className="border-neutral-800 bg-neutral-900/20 text-neutral-100 backdrop-blur-sm hover:bg-neutral-900/80 hover:text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="sr-only">Refresh analytics</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 py-10">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 mb-12">
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
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-1 h-full">
            <PerformanceScoreCard metrics={metrics} />
          </div>
          <div className="lg:col-span-2 h-full">
            <OptimizationCard metrics={metrics} />
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}