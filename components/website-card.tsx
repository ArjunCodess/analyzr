import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Users, Globe } from "lucide-react";
import Link from "next/link";

interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    visitors_count?: number;
    pageviews_count?: number;
    bounce_rate?: number;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Link href={`/site/${website.name}`}>
      <Card className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {website.name}
          </CardTitle>
          <Globe className="h-4 w-4 text-neutral-400" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <span className="text-2xl font-bold">
                {website.visitors_count?.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 flex items-center">
                <Users className="mr-1 h-3 w-3" /> Visitors
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-2xl font-bold">
                {website.pageviews_count?.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 flex items-center">
                <BarChart2 className="mr-1 h-3 w-3" /> Page Views
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bounce Rate</span>
              <span className="text-sm font-bold">
                {website.bounce_rate}%
              </span>
            </div>
            <div className="mt-2 h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-50 rounded-full"
                style={{ width: `${website.bounce_rate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 