import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Snippet from "@/components/snippet";

export default function NoPageViewsState() {
  return (
    <div className="min-h-screen flex justify-center items-center mx-auto p-4">
      <Card className="w-[700px]">
        <CardContent className="flex flex-col items-center space-y-4 p-6 pt-6">
          <div className="flex flex-row items-center space-x-4">
          <div className="h-4 w-4 animate-pulse rounded-full bg-neutral-950" />
          <p className="text-lg text-muted-foreground">
            Waiting for the first page view...
          </p>
          </div>
          <div className="mt-8 w-full py-4 border-t border-b">
            <Snippet />
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}