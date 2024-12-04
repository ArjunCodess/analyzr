import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Globe, ArrowBigUpDash } from "lucide-react";
import Link from "next/link";

interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    visitors_count?: number;
    pageviews_count?: number;
    visitors_24h?: number;
    pageviews_24h?: number;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const visitorPercentage = ((website.visitors_24h || 0) / (website.visitors_count || 1)) * 100;
  const pageviewPercentage = ((website.pageviews_24h || 0) / (website.pageviews_count || 1)) * 100;

  const formatPercentage = (percentage: number) => {
    return percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage > 0) return "text-emerald-400";
    if (percentage < 0) return "text-red-400";
    return "text-neutral-400";
  };

  return (
    <Link href={`/site/${website.name}`}>
      <Card className="px-4 hover:ring ring-slate-100 group relative overflow-hidden border border-neutral-800/50 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 flex flex-col pb-2 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        <CardHeader className="relative flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">
            <span className="bg-gradient-to-r from-neutral-50 to-neutral-400 bg-clip-text text-transparent">
              {website.name}
            </span>
          </CardTitle>
          <Globe className="h-4 w-4 text-neutral-400 transition-transform duration-500 group-hover:rotate-12 group-hover:text-primary/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-white bg-clip-text text-transparent">
                  {website.visitors_count?.toLocaleString()}
                </span>
              </span>
              <span className="flex items-center text-xs text-neutral-400">
                <Users className="mr-1 h-3 w-3" />
                <span className="font-medium">Total Visitors</span>
              </span>
              <span className="text-xs flex items-center">
                <ArrowBigUpDash className={`mr-0.5 h-3 w-3 ${getPercentageColor(visitorPercentage)}`} />
                <span className={getPercentageColor(visitorPercentage)}>
                  +{website.visitors_24h?.toLocaleString()} ({formatPercentage(visitorPercentage)}) in 24h
                </span>
              </span>
            </div>
            <div className="flex flex-col space-y-1.5">
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-white bg-clip-text text-transparent">
                  {website.pageviews_count?.toLocaleString()}
                </span>
              </span>
              <span className="flex items-center text-xs text-neutral-400">
                <BarChart2 className="mr-1 h-3 w-3" />
                <span className="font-medium">Total Views</span>
              </span>
              <span className="text-xs flex items-center">
                <ArrowBigUpDash className={`mr-0.5 h-3 w-3 ${getPercentageColor(pageviewPercentage)}`} />
                <span className={getPercentageColor(pageviewPercentage)}>
                  +{website.pageviews_24h?.toLocaleString()} ({formatPercentage(pageviewPercentage)}) in 24h
                </span>
              </span>
            </div>
          </div>
          <div className="absolute inset-0 -translate-x-full rotate-12 transform bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100" />
        </CardContent>
      </Card>
    </Link>
  );
}
