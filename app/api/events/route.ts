import { supabase } from "@/config/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const { name, domain, description } = await req.json();

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const apiKey = authHeader.split("Bearer ")[1];
      const { data } = await supabase.from("users").select().eq("api", apiKey);

      if (!data)
        return NextResponse.json(
          { error: "Unauthorized - Invalid API" },
          { status: 403, headers: corsHeaders }
        );

      if (data.length > 0) {
        if (name.trim() === "" || domain.trim() === "")
          return NextResponse.json(
            { error: "Name or Domain Fields Must NOT Be Empty." },
            { status: 400, headers: corsHeaders }
          );
        else {
          const { error } = await supabase.from("events").insert([
            {
              event_name: name.toLowerCase(),
              website_id: domain,
              message: description,
            },
          ]);

          if (error)
            return NextResponse.json(
              { error: error },
              { status: 400, headers: corsHeaders }
            );
          else
            return NextResponse.json(
              { message: "success" },
              { status: 200, headers: corsHeaders }
            );
        }
      }
    }

    return NextResponse.json(
      { error: "Unauthorized - Invalid API" },
      { status: 401, headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
