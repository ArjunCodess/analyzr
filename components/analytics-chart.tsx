"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Visit, PageView } from "@/types";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface AnalyticsChartProps {
  pageViews: PageView[];
  visits: Visit[];
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

export default function AnalyticsChart({
  pageViews,
  visits,
}: AnalyticsChartProps) {
  // Group data by date
  const groupedData = pageViews.reduce((acc, view) => {
    const date = new Date(view.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, pageViews: 0, visits: 0 };
    }
    acc[date].pageViews++;
    return acc;
  }, {} as Record<string, { date: string; pageViews: number; visits: number }>);

  // Add visits data
  visits.forEach((visit) => {
    const date = new Date(visit.created_at).toLocaleDateString();
    if (!groupedData[date]) {
      groupedData[date] = { date, pageViews: 0, visits: 0 };
    }
    groupedData[date].visits++;
  });

  // Convert to array and sort by date
  const chartData = Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
              content={<ChartTooltipContent />}
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "#E5E7EB",
              }}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              wrapperStyle={{
                color: "#E5E7EB",
              }}
            />
            <Bar
              dataKey="visits"
              fill={chartConfig.visits.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pageViews"
              fill={chartConfig.pageViews.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
