import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Snippet from "@/components/snippet";
import { useState } from "react";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Code } from "lucide-react";

interface NoPageViewsStateProps {
  website: string;
}

export default function NoPageViewsState({ website }: NoPageViewsStateProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteWebsite = async () => {
    try {
      setIsDeleting(true);
      await Promise.all([
        supabase.from("page_views").delete().eq("domain", website),
        supabase.from("visits").delete().eq("website_id", website),
        supabase.from("events").delete().eq("domain", website),
      ]);
      await supabase.from("websites").delete().eq("name", website);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting website:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center mx-auto p-4 bg-neutral-950">
      <Card className="w-[700px] border-neutral-800 bg-neutral-900/40 shadow-2xl">
        <CardContent className="flex flex-col items-center space-y-4 p-6 pt-6">
          <div className="flex flex-row items-center space-x-4">
            <div className="h-4 w-4 animate-pulse rounded-full bg-white" />
            <p className="text-lg text-neutral-400">
              Waiting for the first page view...
            </p>
          </div>
          <div className="mt-8 w-full py-4 border-t border-b border-neutral-800">
            <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
              <CardHeader className="py-5">
                <CardTitle className="text-neutral-300 text-lg md:text-xl flex items-center gap-2">
                  <Code className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Installation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Snippet />
              </CardContent>
            </Card>
          </div>
          <div className="flex w-full gap-2">
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700"
            >
              Refresh
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-900/80 hover:bg-red-900 text-red-100 border-red-800"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Website"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-neutral-100">
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-neutral-400">
                    This action cannot be undone. This will permanently delete
                    your website and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border-neutral-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteWebsite}
                    className="bg-red-900/80 hover:bg-red-900 text-red-100 border-red-800"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
