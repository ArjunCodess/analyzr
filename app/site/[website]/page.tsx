"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRightIcon,
  RefreshCcw,
} from "lucide-react";
import {
  GroupedSource,
  GroupedView,
  PageView,
  Visit,
  CustomEvent,
} from "@/types";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchViews } from "@/actions/fetchViews";
import { groupPageViews, groupPageSources } from "@/lib/utils";
import SiteSettings from "@/components/site-settings";
import SiteCustomEvents from "@/components/site-custom-events";
import NoPageViewsState from "@/components/no-page-views";
import GeneralAnalytics from "@/components/site-general-analytics";
import Performance from "@/components/site-performance";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import StatsBox from "@/components/24hour-stats-box";
import useSWR from 'swr';

export default function AnalyticsPage() {
  const { website } = useParams();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("0");
  const [showStatsBox, setShowStatsBox] = useState(true);

  // Website ownership check with SWR
  const { data: authorized, isLoading: authLoading } = useSWR(
    user ? ['websiteOwnership', user.id, website] : null,
    async () => {
      try {
        const { data, error } = await supabase
          .from("websites")
          .select("id")
          .eq("name", website)
          .eq("user_id", user!.id)
          .single();

        if (error || !data) {
          router.push("/dashboard");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error checking website ownership:", error);
        router.push("/dashboard");
        return false;
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Analytics data fetching with SWR
  const { data: analyticsData, isLoading: dataLoading, mutate: refreshAnalytics } = useSWR(
    authorized ? ['analytics', website, filterValue] : null,
    async () => {
      try {
        const result = await fetchViews(website as string, filterValue);
        if (result.error) {
          console.error(result.error);
          return null;
        }

        return {
          pageViews: result.pageViews || [],
          visits: result.visits || [],
          customEvents: result.customEvents || [],
          groupedPageViews: groupPageViews(result.pageViews || []),
          groupedPageSources: groupPageSources(result.visits || []),
          groupedCustomEvents: (result.customEvents || []).reduce<Record<string, number>>(
            (acc, event) => {
              if (event?.event_name) {
                acc[event.event_name] = (acc[event.event_name] || 0) + 1;
              }
              return acc;
            },
            {}
          ),
        };
      } catch (error) {
        console.error("Error updating views:", error);
        return null;
      }
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, userLoading, router]);

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilterValue(value);
      refreshAnalytics();
    },
    [refreshAnalytics]
  );

  if (userLoading || authLoading || dataLoading) {
    return <Loading text="Getting your data..." />;
  }

  if (!authorized) {
    return null;
  }

  if (!analyticsData?.pageViews || analyticsData.pageViews.length === 0) {
    return <NoPageViewsState website={website as string} />;
  }

  const pageViews24h = analyticsData.pageViews.filter(
    (pv) => new Date(pv.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  const totalVisits24h = analyticsData.visits.filter(
    (v) => new Date(v.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {showStatsBox && (
          <StatsBox
            pageViews24h={pageViews24h}
            totalVisits24h={totalVisits24h}
            pageViews={analyticsData.pageViews.length}
            totalVisits={analyticsData.visits.length}
            onClose={() => setShowStatsBox(false)}
          />
        )}

        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex flex-row">
              Analytics for {website}
              <Link href={`https://${website}`} target="_blank">
                <ArrowUpRightIcon className="w-6 h-6 md:w-9 md:h-9 md:-mt-1" />
              </Link>
            </h1>
            <p className="text-sm text-neutral-100">
              Track your website performance and user engagement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={filterValue} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] border-neutral-800 bg-neutral-900/20 text-neutral-100 backdrop-blur-sm hover:bg-neutral-900/80">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="border-neutral-800 bg-neutral-900 text-neutral-100">
                <SelectItem value="0">Lifetime</SelectItem>
                <SelectItem value="last 1 hour">Last 1 hour</SelectItem>
                <SelectItem value="last 1 day">Last 1 day</SelectItem>
                <SelectItem value="last 7 days">Last 7 days</SelectItem>
                <SelectItem value="last 30 days">Last 30 days</SelectItem>
                <SelectItem value="last 90 days">Last 90 days</SelectItem>
                <SelectItem value="last 365 days">Last 365 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleFilterChange(filterValue)}
              variant="outline"
              size="icon"
              className="border-neutral-800 bg-neutral-900/20 text-neutral-100 backdrop-blur-sm hover:bg-neutral-900/80 hover:text-white"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Refresh analytics</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-2 w-full bg-neutral-900/30 border border-neutral-900 p-1 backdrop-blur-sm">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white w-1/4"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white w-1/4"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="custom-events"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white w-1/4"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white w-1/4"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralAnalytics
              pageViews={analyticsData.pageViews}
              totalVisits={analyticsData.visits}
              groupedPageViews={analyticsData.groupedPageViews}
              groupedPageSources={analyticsData.groupedPageSources}
              filterValue={filterValue}
              website={website as string}
            />
          </TabsContent>

          <TabsContent value="performance">
            <Performance
              websiteId={website as string}
              websiteUrl={`https://${website}`}
            />
          </TabsContent>

          <TabsContent value="custom-events">
            <SiteCustomEvents
              customEvents={analyticsData.customEvents}
              groupedCustomEvents={analyticsData.groupedCustomEvents}
              activeCustomEventTab=""
              setActiveCustomEventTab={() => {}}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettings website={website as string} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
