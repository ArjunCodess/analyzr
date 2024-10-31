import { supabase } from "@/config/supabase";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface TrackingData {
  domain: string;
  url: string;
  event: 'session_start' | 'pageview' | 'session_end';
  source?: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const data = await request.json() as TrackingData;
  const { domain, url, event, source } = data;
  
  if (!url.includes(domain)) {
    return NextResponse.json(
      { error: "The script points to a different domain than the current URL. Make sure they match." },
      { headers: corsHeaders }
    );
  }

  try {
    if (event === "session_start") {
      await supabase
        .from("visits")
        .insert([{ website_id: domain, source: source ?? "Direct" }])
        .select();
    }

    if (event === "pageview") {
      await supabase
        .from("page_views")
        .insert([{ domain, page: url }]);
    }

    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error processing tracking request:', error);
    return NextResponse.json(
      { error: "Failed to process tracking request" },
      { status: 500, headers: corsHeaders }
    );
  }
}
