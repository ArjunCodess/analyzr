"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Visit, PageView } from "@/types";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface AnalyticsChartProps {
  pageViews: PageView[];
  visits: Visit[];
  timePeriod: string;
}

const chartConfig = {
  visits: {
    label: "Visitors",
    color: "#3b82f6",
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
  const [activeTab, setActiveTab] = useState("pageViews");

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

  const groupedData = visits
    .filter(visit => filterDataByTimePeriod(new Date(visit.created_at)))
    .reduce((acc, visit) => {
      const date = new Date(visit.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, pageViews: 0, visits: 1 };
      } else {
        acc[date].visits++;
      }
      return acc;
    }, {} as Record<string, { date: string; pageViews: number; visits: number }>);

  pageViews
    .filter(view => filterDataByTimePeriod(new Date(view.created_at)))
    .forEach(view => {
      const date = new Date(view.created_at).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = { date, pageViews: 1, visits: 0 };
      } else {
        groupedData[date].pageViews++;
      }
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
    <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
          Analytics Graph
          <Eye className="w-7 h-7" />
        </CardTitle> 
      </CardHeader>
      <CardContent className="flex -ml-12 -mr-2 pb-0">
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            style={{
              backgroundColor: "transparent",
            }}
            margin={{
              left: 12,
              right: 12,
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
              cursor={false}
            />
            {activeTab === "visitors" && (
              <Area
                dataKey="visits"
                name={chartConfig.visits.label}
                stroke={chartConfig.visits.color}
                fill={chartConfig.visits.color}
                fillOpacity={0.4}
                type="natural"
              />
            )}
            {activeTab === "pageViews" && (
              <Area
                dataKey="pageViews"
                name={chartConfig.pageViews.label}
                stroke={chartConfig.pageViews.color}
                fill={chartConfig.pageViews.color}
                fillOpacity={0.4}
                type="natural"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full px-6 pt-4 pb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-neutral-900/30 border border-neutral-900 p-1 backdrop-blur-sm">
            <TabsTrigger
              value="pageViews"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Page Views
            </TabsTrigger>
            <TabsTrigger
              value="visitors"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Visitors
            </TabsTrigger>
          </TabsList>
        </Tabs>
    </Card>
  );
}
