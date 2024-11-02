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
      .select('*, city, region, country, operating_system')
      .eq("domain", website);

    let visitsQuery = supabase
      .from("visits")
      .select()
      .eq("website_id", website);

    if (filter_duration && filter_duration !== "0") {
      viewsQuery = viewsQuery.gte(
        "created_at",
        ThatTimeAgo.toISOString()
      );
      visitsQuery = visitsQuery.gte(
        "created_at",
        ThatTimeAgo.toISOString()
      );
    }

    const customEventsQuery = supabase
      .from("events")
      .select()
      .eq("website_id", website)
      .order('created_at', { ascending: false })
      .returns<CustomEvent[]>();

    const [viewsResponse, visitsResponse, customEventsResponse] = await Promise.all([
      viewsQuery.returns<PageView[]>(),
      visitsQuery.returns<Visit[]>(),
      customEventsQuery
    ]);

    if (viewsResponse.error) throw new Error(viewsResponse.error.message);
    if (visitsResponse.error) throw new Error(visitsResponse.error.message);
    if (customEventsResponse.error) throw new Error(customEventsResponse.error.message);

    return {
      pageViews: viewsResponse.data || [],
      visits: visitsResponse.data || [],
      customEvents: customEventsResponse.data || [],
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