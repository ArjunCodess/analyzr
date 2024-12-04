"use client";

import { X, Users, BarChart2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { abbreviateNumber } from "@/lib/utils";

interface StatsBoxProps {
  totalVisits24h: number;
  pageViews24h: number;
  totalVisits: number;
  pageViews: number;
  onClose: () => void;
}

export default function StatsBox({
  totalVisits24h,
  totalVisits,
  pageViews24h,
  pageViews,
  onClose,
}: StatsBoxProps) {
  return (
    <Card className="bg-black/95 border-neutral-800 text-white backdrop-blur-sm mb-8">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm font-medium mb-2 sm:mb-0">Last 24-hour stats:</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <StatItem
              icon={<Users className="h-5 w-5 text-neutral-400" />}
              value={totalVisits24h}
              percentage={(totalVisits24h * 100) / totalVisits}
            />
            <StatItem
              icon={<BarChart2 className="h-5 w-5 text-neutral-400" />}
              value={pageViews24h}
              percentage={(pageViews24h * 100) / pageViews}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-neutral-800 hover:text-white self-end sm:self-auto"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close 24-hour stats</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ icon, value, percentage }: { icon: React.ReactNode; value: number; percentage: number }) {
  const isZeroValue = value === 0 || Math.floor(percentage) === 0;
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium">{value.toLocaleString()}</span>
        <div className={`flex items-center ${isZeroValue ? 'text-neutral-400' : 'text-emerald-500'} text-sm font-medium`}>
          <TrendingUp className="h-4 w-4 mr-0.5" />
          {abbreviateNumber(percentage)}%
        </div>
      </div>
    </div>
  );
}
