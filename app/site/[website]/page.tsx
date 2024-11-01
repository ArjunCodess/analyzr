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
import {
  groupPageViews,
  groupPageSources,
} from "@/lib/utils";
import SiteSettings from "@/components/site-settings";
import SiteCustomEvents from "@/components/site-custom-events";
import NoPageViewsState from "@/components/no-page-views";
import GeneralAnalytics from "@/components/general-analytics";

export default function AnalyticsPage() {
  const { website } = useParams();

  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [totalVisits, setTotalVisits] = useState<Visit[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedPageViews, setGroupedPageViews] = useState<GroupedView[]>([]);
  const [groupedPageSources, setGroupedPageSources] = useState<GroupedSource[]>([]);
  const [groupedCustomEvents, setGroupedCustomEvents] = useState<Record<string, number>>({});
  const [activeCustomEventTab, setActiveCustomEventTab] = useState("");
  const [filterValue, setFilterValue] = useState("0");

  const handleFilterChange = useCallback(async (value: string) => {
    setLoading(true);
    try {
      const result = await fetchViews(website as string, value);
      if (result.error) {
        console.error(result.error);
        return;
      }
      
      setPageViews(result.pageViews);
      setTotalVisits(result.visits);
      setCustomEvents(result.customEvents);
      setGroupedPageViews(groupPageViews(result.pageViews));
      setGroupedPageSources(groupPageSources(result.visits));
      
      const newGroupedEvents = result.customEvents.reduce<Record<string, number>>(
        (acc, event) => {
          if (event.event_name) {
            acc[event.event_name] = (acc[event.event_name] || 0) + 1;
          }
          return acc;
        },
        {}
      );
      setGroupedCustomEvents(newGroupedEvents);
      setFilterValue(value);
    } catch (error) {
      console.error("Error updating views:", error);
    } finally {
      setLoading(false);
    }
  }, [website]);

  useEffect(() => {
    if (!website) return;
    
    handleFilterChange("0");
    
    const interval = setInterval(() => {
      handleFilterChange("0");
    }, 30000);
    
    return () => clearInterval(interval);
  }, [website, handleFilterChange]);

  if (loading) return <Loading text="Getting your data..." />;

  if (pageViews?.length === 0 && !loading) {
    return <NoPageViewsState />;
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex flex-row">
              Analytics for {website}
              <Link href={`https://${website}`} target="_blank">
                <ArrowUpRightIcon className="md:w-10 md:h-10" />
              </Link>
            </h1>
            <p className="text-sm text-neutral-100">
              Track your website performance and user engagement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              value={filterValue}
              onValueChange={handleFilterChange}
            >
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
              onClick={() => handleFilterChange("0")}
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
          <TabsList className="mb-8 grid w-full grid-cols-3 bg-neutral-900/30 border border-neutral-900 p-1 backdrop-blur-sm">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="custom-events"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralAnalytics
              pageViews={pageViews}
              totalVisits={totalVisits}
              groupedPageViews={groupedPageViews}
              groupedPageSources={groupedPageSources}
              filterValue={filterValue}
              website={website as string}
            />
          </TabsContent>

          <TabsContent value="custom-events">
            <SiteCustomEvents
              customEvents={customEvents}
              groupedCustomEvents={groupedCustomEvents}
              activeCustomEventTab={activeCustomEventTab}
              setActiveCustomEventTab={setActiveCustomEventTab}
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