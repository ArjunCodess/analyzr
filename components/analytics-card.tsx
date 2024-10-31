import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCardProps } from "@/types";

export function AnalyticsCard({ icon, label, value }: AnalyticsCardProps) {
  return (
    <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon}
            <span className="mt-2 text-sm text-neutral-500">{label}</span>
          </div>
          <span className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white">
            {value}
          </span>
        </CardTitle>
      </CardHeader>
    </Card>
  );
} 