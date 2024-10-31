'use server'

import { supabase } from "@/config/supabase";

export async function fetchActiveUsers(website: string, minutes: number = 10): Promise<number> {
  try {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - minutes * 60 * 1000);

    const { count } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('domain', website)
      .gte('created_at', tenMinutesAgo.toISOString())
      .lte('created_at', now.toISOString());

    return count || 0;
  } catch (error) {
    console.error('Error fetching active users:', error);
    return 0;
  }
} 