"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Visit, PageView } from "@/types";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface AnalyticsChartProps {
  pageViews: PageView[];
  visits: Visit[];
  timePeriod: string;
}

const chartConfig = {
  visits: {
    label: "Visitors",
    color: "#60a5fa",
  },
  pageViews: {
    label: "Page Views",
    color: "#2979ff",
  },
} satisfies ChartConfig;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(/(\d+)(?=(st|nd|rd|th))/, (match) => {
    const num = parseInt(match);
    const suffix = ['th', 'st', 'nd', 'rd'][(num % 10 > 3 ? 0 : num % 10)];
    return `${num}${suffix}`;
  });
};

export default function AnalyticsChart({
  pageViews,
  visits,
  timePeriod,
}: AnalyticsChartProps) {
  const filterDataByTimePeriod = (date: Date) => {
    if (timePeriod === "0") return true;
    
    const now = new Date();
    const timeAgo = new Date(date);
    const diffInHours = (now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60);

    switch (timePeriod) {
      case "last 1 hour":
        return diffInHours <= 1;
      case "last 1 day":
        return diffInHours <= 24;
      case "last 7 days":
        return diffInHours <= 24 * 7;
      case "last 30 days":
        return diffInHours <= 24 * 30;
      case "last 90 days":
        return diffInHours <= 24 * 90;
      case "last 365 days":
        return diffInHours <= 24 * 365;
      default:
        return true;
    }
  };

  const groupedData = pageViews
    .filter(view => filterDataByTimePeriod(new Date(view.created_at)))
    .reduce((acc, view) => {
      const date = new Date(view.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, pageViews: 0, visits: 0 };
      }
      acc[date].pageViews++;
      return acc;
    }, {} as Record<string, { date: string; pageViews: number; visits: number }>);

  visits
    .filter(visit => filterDataByTimePeriod(new Date(visit.created_at)))
    .forEach(visit => {
      const date = new Date(visit.created_at).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = { date, pageViews: 0, visits: 0 };
      }
      groupedData[date].visits++;
    });

  const chartData = Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: {
    active?: boolean;
    payload?: Array<{
      fill: string;
      name: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-lg">
          <p className="text-neutral-300 mb-2">{formatDate(label!)}</p>
          {payload.map((pld, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pld.fill }}
              />
              <span className="text-neutral-300">
                {pld.name}: {pld.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
          Visitors / Page Views Graph
          <Eye className="w-7 h-7" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex -ml-6 mr-4">
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            style={{
              backgroundColor: "transparent",
            }}
          >
            <CartesianGrid vertical={false} stroke="#374151" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9CA3AF" }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9CA3AF" }}
            />
            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              wrapperStyle={{
                color: "#E5E7EB",
              }}
            />
            <Bar
              dataKey="visits"
              name={chartConfig.visits.label}
              fill={chartConfig.visits.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pageViews"
              name={chartConfig.pageViews.label}
              fill={chartConfig.pageViews.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
