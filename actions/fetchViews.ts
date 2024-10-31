'use server'

import { supabase } from "@/config/supabase";
import { PageView, Visit, CustomEvent } from "@/types";

interface FetchViewsResult {
  pageViews: PageView[];
  visits: Visit[];
  customEvents: CustomEvent[];
  error?: string;
}

export async function fetchViews(
  website: string,
  filter_duration?: string
): Promise<FetchViewsResult> {
  const ThatTimeAgo = new Date();

  if (filter_duration && filter_duration !== "0") {
    const onlyNumber_filter_duration = parseInt(
      filter_duration.match(/\d+/)?.[0] || "0"
    );
    ThatTimeAgo.setDate(ThatTimeAgo.getDate() - onlyNumber_filter_duration);
  }

  try {
    let viewsQuery = supabase
      .from("page_views")
      .select()
      .eq("domain", website);

    let visitsQuery = supabase
      .from("visits")
      .select()
      .eq("website_id", website);

    if (filter_duration && filter_duration !== "0") {
      viewsQuery = viewsQuery.filter(
        "created_at",
        "gte",
        ThatTimeAgo.toISOString()
      );
      visitsQuery = visitsQuery.filter(
        "created_at",
        "gte",
        ThatTimeAgo.toISOString()
      );
    }

    const [viewsResponse, visitsResponse] = await Promise.all([
      viewsQuery,
      visitsQuery,
    ]);

    if (viewsResponse.error) throw new Error(viewsResponse.error.message);
    if (visitsResponse.error) throw new Error(visitsResponse.error.message);

    return {
      pageViews: viewsResponse.data as unknown as PageView[],
      visits: visitsResponse.data as unknown as Visit[],
      customEvents: [],
    };
  } catch (error) {
    console.error("Error fetching views:", error);
    return {
      pageViews: [],
      visits: [],
      customEvents: [],
      error: error instanceof Error ? error.message : 'An error occurred while fetching data'
    };
  }
}