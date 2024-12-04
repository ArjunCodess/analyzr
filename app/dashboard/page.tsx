"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddWebsite from "@/components/add-website";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { WebsiteCard } from "@/components/website-card";
import Loading from "@/components/loading";
import { Website } from "@/types";
import { fetchWebsitesWithAnalytics } from "@/actions/fetchAnalytics";
import { supabase } from "@/config/supabase";

interface WebsiteWithAnalytics extends Website {
  visitors_24h?: number;
  pageviews_24h?: number;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [websites, setWebsites] = useState<WebsiteWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWebsites = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const websitesData = await fetchWebsitesWithAnalytics(user.id);
        
        // Fetch 24h stats for each website
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const websitesWith24hStats = await Promise.all(
          websitesData.map(async (website) => {
            // Get 24h visitors
            const { count: visitors24h } = await supabase
              .from("visits")
              .select("*", { count: "exact", head: true })
              .eq("website_id", website.name)
              .gte("created_at", twentyFourHoursAgo);

            // Get 24h pageviews
            const { count: pageviews24h } = await supabase
              .from("page_views")
              .select("*", { count: "exact", head: true })
              .eq("domain", website.name)
              .gte("created_at", twentyFourHoursAgo);

            return {
              ...website,
              visitors_24h: visitors24h || 0,
              pageviews_24h: pageviews24h || 0,
            };
          })
        );

        setWebsites(websitesWith24hStats);
      } catch (error) {
        console.error("Error loading websites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWebsites();
  }, [user]);

  if (loading) return <Loading text="Getting your websites..." />;

  return (
    <div className="min-h-screen bg-neutral-900/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral-100">Your Websites</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 p-4 max-w-lg sm:max-w-xl mx-auto">
              <DialogTitle className="sr-only">Add a new website</DialogTitle>
              <AddWebsite />
            </DialogContent>
          </Dialog>
        </div>
        {websites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400">No websites added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
        )}
      </div>
    </div>
  );
}