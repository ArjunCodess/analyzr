import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Globe } from "lucide-react";
import Link from "next/link";

interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    visitors_count?: number;
    pageviews_count?: number;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
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
                <span className="font-medium">Visitors</span>
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
                <span className="font-medium">Page Views</span>
              </span>
            </div>
          </div>

          <div className="absolute inset-0 -translate-x-full rotate-12 transform bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100" />
        </CardContent>
      </Card>
    </Link>
  );
}