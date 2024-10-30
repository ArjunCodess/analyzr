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
import { supabase } from "@/config/supabase";
import { WebsiteCard } from "@/components/website-card";
import Loading from "@/components/loading";
import { Analytics, Website, CountResult } from "@/types";

export default function Dashboard() {
  const { user } = useUser();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (
    websiteId: string,
    websiteName: string
  ): Promise<Analytics> => {
    try {
      // Get unique visitors count
      const { count: visitorsCount } = (await supabase
        .from("visits")
        .select("*", { count: "exact", head: true })
        .eq("website_id", websiteName)) as CountResult;

      // Get pageviews count
      const { count: pageviewsCount } = (await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("domain", websiteName)) as CountResult;

      // Calculate bounce rate (users who viewed only one page)
      const { data: pageViewsPerVisit } = await supabase
        .from("page_views")
        .select("domain")
        .eq("domain", websiteName)
        .order("created_at", { ascending: true });

      const totalVisits = visitorsCount || 0;
      const singlePageVisits = pageViewsPerVisit
        ? totalVisits - pageViewsPerVisit.length
        : 0;
      const bounceRate =
        totalVisits > 0 ? (singlePageVisits / totalVisits) * 100 : 0;

      return {
        visitors_count: visitorsCount || 0,
        pageviews_count: pageviewsCount || 0,
        bounce_rate: Math.max(Number(bounceRate.toFixed(2)), 0),
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return {
        visitors_count: 0,
        pageviews_count: 0,
        bounce_rate: 0,
      };
    }
  };

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);

        const { data: websitesData, error } = await supabase
          .from("websites")
          .select("id, name, user_id, created_at")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false })
          .returns<Pick<Website, "id" | "name" | "user_id" | "created_at">[]>();

        if (error) throw error;
        if (!websitesData) return;

        const websitesWithAnalytics = await Promise.all(
          websitesData.map(
            async (
              website: Pick<Website, "id" | "name" | "user_id" | "created_at">
            ) => {
              const analytics = await fetchAnalytics(website.id, website.name);
              return {
                ...website,
                visitors_count: analytics.visitors_count,
                pageviews_count: analytics.pageviews_count,
                bounce_rate: analytics.bounce_rate,
              } satisfies Website;
            }
          )
        );

        setWebsites(websitesWithAnalytics);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user || !supabase) return;
    fetchWebsites();
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
                <Plus className="mr-2 h-4 w-4" /> Add Website
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 p-4">
              <DialogTitle className="sr-only">Add Website</DialogTitle>
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
