"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface SiteSettingsProps {
  website: string;
}

export default function SiteSettings({ website }: SiteSettingsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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
    <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          <span>Danger Zone</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-red-900/10 bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-400">
                  Delete Website
                </p>
                <p className="text-sm text-neutral-400">
                  Permanently delete this website and all of its data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    className="bg-red-900 text-red-100 hover:bg-red-900/80"
                  >
                    {isDeleting ? "Deleting..." : "Delete Website"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-neutral-800 bg-neutral-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-neutral-100">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-neutral-400">
                      This action cannot be undone. This will permanently delete
                      your website analytics data and remove all related
                      resources.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-neutral-800 bg-neutral-900 text-neutral-100">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteWebsite}
                      className="bg-red-900 text-red-100 hover:bg-red-900/80"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
