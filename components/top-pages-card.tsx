import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart2 } from "lucide-react";
import { TopPagesCardProps } from "@/types";

export function TopPagesCard({ groupedPageViews, abbreviateNumber }: TopPagesCardProps) {
  return (
    <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
          <p>Top Pages</p>
          <BarChart2 className="w-7 h-7" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {groupedPageViews.map((view, index) => (
            <div
              key={index}
              className="flex items-center justify-between border my-2 border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
            >
              <span className="text-sm text-neutral-100">/{view.page}</span>
              <span className="font-medium text-white">
                {abbreviateNumber(view.visits)}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 