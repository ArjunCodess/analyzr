import { supabase } from "@/config/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getCorsHeaders } from '@/lib/cors';
import { DiscordClient } from '@/lib/discord-client';
import { UserData } from "@/types";

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
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("api", apiKey)
        .single<UserData>();

      if (!userData) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid API" },
          { status: 403, headers: getCorsHeaders() }
        );
      }

      if (name.trim() === "" || domain.trim() === "") {
        return NextResponse.json(
          { error: "Name or Domain Fields Must NOT Be Empty." },
          { status: 400, headers: getCorsHeaders() }
        );
      }

      try {
        const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
        const dmChannel = await discord.createDM(userData.discord_id!);
        
        await discord.sendEmbed(dmChannel.id, {
          title: `🔔 New Event: ${name}`,
          description: description || `New event recorded from ${domain}`,
          color: 0x0099ff,
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: 'Website',
              value: domain,
              inline: true
            },
            {
              name: 'Event',
              value: name,
              inline: true
            }
          ]
        });

        return NextResponse.json(
          { message: "success" },
          { status: 200, headers: getCorsHeaders() }
        );
      } catch (discordError) {
        console.error('Discord delivery failed:', discordError);

        return NextResponse.json(
          { error: "Event recorded but Discord notification failed" },
          { status: 200, headers: getCorsHeaders() }
        );
      }
    }

    return NextResponse.json(
      { error: "Unauthorized - Invalid API" },
      { status: 401, headers: getCorsHeaders() }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}