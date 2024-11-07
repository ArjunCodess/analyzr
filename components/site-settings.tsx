"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import { Trash2, Download, BarChart2, Activity, Code } from "lucide-react";
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
import Snippet from "@/components/snippet";

interface SiteSettingsProps {
  website: string;
}

interface CustomEvent {
  event_name: string;
  message: string;
  created_at: string;
  domain: string;
  id: string;
}

export default function SiteSettings({ website }: SiteSettingsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadingAnalytics, setIsDownloadingAnalytics] = useState(false);
  const [isDownloadingEvents, setIsDownloadingEvents] = useState(false);

  const handleDownloadAnalytics = async () => {
    try {
      setIsDownloadingAnalytics(true);
      const [pageViewsRes, visitsRes] = await Promise.all([
        supabase.from("page_views").select("*").eq("domain", website),
        supabase.from("visits").select("*").eq("website", website),
      ]);

      if (pageViewsRes.data) downloadCSV(convertToCSV(pageViewsRes.data as unknown as Record<string, unknown>[]), `${website}-page-views.csv`);
      if (visitsRes.data) downloadCSV(convertToCSV(visitsRes.data as unknown as Record<string, unknown>[]), `${website}-visits.csv`);
    } catch (error) {
      console.error("Error downloading analytics:", error);
    } finally {
      setIsDownloadingAnalytics(false);
    }
  };

  const handleDownloadEvents = async () => {
    try {
      setIsDownloadingEvents(true);
      const eventsRes = await supabase
        .from("events")
        .select("*")
        .eq("website_id", website)
        .returns<CustomEvent[]>();
      
      if (eventsRes.data && eventsRes.data.length > 0) {
        const formattedData = eventsRes.data.map((event) => ({
          id: event.id,
          event_name: event.event_name,
          message: event.message,
          domain: event.domain,
          created_at: event.created_at
        }));

        downloadCSV(convertToCSV(formattedData), `${website}-custom-events.csv`);
      } else {
        console.log("No custom events found");
      }
    } catch (error) {
      console.error("Error downloading events:", error);
    } finally {
      setIsDownloadingEvents(false);
    }
  };

  const convertToCSV = <T extends Record<string, unknown>>(data: T[]) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6 w-full max-w-[95vw] mx-auto">
      {/* Installation Section */}
      <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-neutral-300 text-sm md:text-base lg:text-lg flex items-center gap-2">
            <Code className="h-4 w-4 md:h-5 md:w-5" />
            <span>Installation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px]">
              <Snippet />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-neutral-300 text-sm md:text-base lg:text-lg flex items-center gap-2">
            <Download className="h-4 w-4 md:h-5 md:w-5" />
            <span>Export Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-medium text-neutral-100 flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Basic Analytics
                  </p>
                  <p className="text-xs md:text-sm text-neutral-400">
                    Download page views and visits data
                  </p>
                </div>
                <Button
                  onClick={handleDownloadAnalytics}
                  disabled={isDownloadingAnalytics}
                  variant="outline"
                  className="border-neutral-800 bg-neutral-900/60 text-neutral-100 hover:bg-neutral-950/40 hover:text-neutral-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloadingAnalytics ? "Downloading..." : "Download Analytics"}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs md:text-sm font-medium text-neutral-100 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Custom Events
                  </p>
                  <p className="text-xs md:text-sm text-neutral-400">
                    Download custom events data
                  </p>
                </div>
                <Button
                  onClick={handleDownloadEvents}
                  disabled={isDownloadingEvents}
                  variant="outline"
                  className="border-neutral-800 bg-neutral-900/60 text-neutral-100 hover:bg-neutral-950/40 hover:text-neutral-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloadingEvents ? "Downloading..." : "Download Events"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Section */}
      <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-neutral-300 text-sm md:text-base lg:text-lg flex items-center gap-2">
            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="rounded-lg border border-red-900/10 bg-red-900/20 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-red-400">
                  Delete Website
                </p>
                <p className="text-xs md:text-sm text-neutral-400">
                  Permanently delete this website and all of its data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    className="bg-red-900 text-red-100 hover:bg-red-900/60"
                  >
                    {isDeleting ? "Deleting..." : "Delete Website"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-neutral-800 bg-neutral-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-sm md:text-base text-neutral-100">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs md:text-sm text-neutral-400">
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
        </CardContent>
      </Card>
    </div>
  );
}
