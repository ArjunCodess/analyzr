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
  city?: string;
  region?: string;
  country?: string;
  operatingSystem?: string;
  deviceType?: string;
  browserName?: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as TrackingData;
    const { 
      domain, 
      url, 
      event, 
      source,
      city,
      region,
      country,
      operatingSystem,
      deviceType,
      browserName,
    } = data;
    
    if (!url.includes(domain)) {
      return NextResponse.json(
        { error: "Domain mismatch" },
        { headers: corsHeaders }
      );
    }

    if (event === "pageview") {
      const { error } = await supabase
        .from("page_views")
        .insert([{ 
          domain, 
          page: url,
          city: city || 'Unknown',
          region: region || 'Unknown',
          country: country || 'Unknown',
          operating_system: operatingSystem || 'Unknown',
          device_type: deviceType || 'Unknown',
          browser_name: browserName || 'Unknown',
        }]);

      if (error) throw error;
    }

    if (event === "session_start") {
      const { error } = await supabase
        .from("visits")
        .insert([{ 
          website_id: domain, 
          source: source || "direct",
        }]);

      if (error) throw error;
    }

    return NextResponse.json(
      { success: true, data }, 
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error processing tracking request:', error);
    return NextResponse.json(
      { error: "Failed to process tracking request" },
      { status: 500, headers: corsHeaders }
    );
  }
}