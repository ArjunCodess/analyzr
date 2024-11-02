import { supabase } from "@/config/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCorsHeaders } from '@/lib/cors';

export async function GET() {
  const { data } = await supabase.from("events").select();
  return new Response(JSON.stringify(data), {
    headers: getCorsHeaders(),
  });
}

export async function OPTIONS() {
  return new Response(null, {
    headers: getCorsHeaders(),
  });
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
          { status: 403, headers: getCorsHeaders() }
        );

      if (data.length > 0) {
        if (name.trim() === "" || domain.trim() === "")
          return NextResponse.json(
            { error: "Name or Domain Fields Must NOT Be Empty." },
            { status: 400, headers: getCorsHeaders() }
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
              { status: 400, headers: getCorsHeaders() }
            );
          else
            return NextResponse.json(
              { message: "success" },
              { status: 200, headers: getCorsHeaders() }
            );
        }
      }
    }

    return NextResponse.json(
      { error: "Unauthorized - Invalid API" },
      { status: 401, headers: getCorsHeaders() }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}