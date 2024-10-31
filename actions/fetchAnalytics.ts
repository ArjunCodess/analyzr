'use server'

import { supabase } from "@/config/supabase";
import { Website } from "@/types";

interface Analytics {
  visitors_count: number;
  pageviews_count: number;
}

interface CountResult {
  count: number | null;
}

export async function fetchAnalytics(
  websiteId: string,
  websiteName: string
): Promise<Analytics> {
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

    return {
      visitors_count: visitorsCount || 0,
      pageviews_count: pageviewsCount || 0,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      visitors_count: 0,
      pageviews_count: 0,
    };
  }
}

export async function fetchWebsitesWithAnalytics(userId: string): Promise<Website[]> {
  try {
    const { data: websitesData, error } = await supabase
      .from("websites")
      .select("id, name, user_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<Pick<Website, "id" | "name" | "user_id" | "created_at">[]>();

    if (error) throw error;
    if (!websitesData) return [];

    const websitesWithAnalytics = await Promise.all(
      websitesData.map(async (website) => {
        const analytics = await fetchAnalytics(website.id, website.name);
        return {
          ...website,
          visitors_count: analytics.visitors_count,
          pageviews_count: analytics.pageviews_count,
        } satisfies Website;
      })
    );

    return websitesWithAnalytics;
  } catch (error) {
    console.error("Error fetching websites with analytics:", error);
    return [];
  }
}