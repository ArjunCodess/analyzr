"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/config/supabase";
import {
  ArrowBigUpDash,
  ArrowRight,
  BarChart2,
  MousePointerClick,
  Users,
  Trash2,
} from "lucide-react";
import Snippet from "@/components/snippet";
import {
  GroupedSource,
  GroupedView,
  PageView,
  Visit,
  CustomEvent,
} from "@/types";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export default function WebsitePage() {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchViews = useCallback(async (filter_duration?: string) => {
    setLoading(true);
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

      let eventsQuery = supabase.from("events").select().eq("domain", website);

      // Add time filter if needed
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
        eventsQuery = eventsQuery.filter(
          "created_at",
          "gte",
          ThatTimeAgo.toISOString()
        );
      }

      const [viewsResponse, visitsResponse, customEventsResponse] =
        await Promise.all([viewsQuery, visitsQuery, eventsQuery]);

      console.log("Debug responses:", {
        viewsResponse,
        visitsResponse,
        customEventsResponse,
      });

      const views = viewsResponse.data || [];
      const visits = visitsResponse.data || [];
      const customEventsData = customEventsResponse.data || [];

      // Add type assertion here
      const typedCustomEvents = customEventsData as unknown as CustomEvent[];
      const newGroupedEvents = typedCustomEvents.reduce<Record<string, number>>(
        (acc, event) => {
          if (event.event_name) {
            acc[event.event_name] = (acc[event.event_name] || 0) + 1;
          }
          return acc;
        },
        {}
      );

      // Update states with the fetched data
      setPageViews(views as unknown as PageView[]);
      setGroupedPageViews(groupPageViews(views as unknown as PageView[]));

      setTotalVisits(visits as unknown as Visit[]);
      setGroupedPageSources(groupPageSources(visits as unknown as Visit[]));

      setCustomEvents(customEventsData as unknown as CustomEvent[]);

      // Update grouped custom events
      setGroupedCustomEvents(newGroupedEvents);
    } catch (error) {
      console.error("Error fetching views:", error);
    } finally {
      setLoading(false);
    }
  }, [website]);

  const abbreviateNumber = (number: number): string => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }

    return number.toString();
  };

  function groupPageViews(pageViews: PageView[]): GroupedView[] {
    const groupedPageViews: Record<string, number> = {};

    pageViews.forEach(({ page }) => {
      const path = page.replace(/^(?:\/\/|[^/]+)*\//, "");
      groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
    });

    return Object.entries(groupedPageViews)
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits);
  }

  function groupPageSources(visits: Visit[]): GroupedSource[] {
    const groupedPageSources: Record<string, number> = {};

    visits.forEach(({ source }) => {
      groupedPageSources[source] = (groupedPageSources[source] || 0) + 1;
    });

    return Object.entries(groupedPageSources)
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits);
  }

  const formatTimeStamp = (date: string): string => {
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
    if (!supabase || !website) return;

    fetchViews("0");

    const interval = setInterval(() => {
      setFilterValue("0");
      fetchViews("0");
    }, 30000);

    return () => clearInterval(interval);
  }, [website, fetchViews]);

  const handleDeleteWebsite = async () => {
    try {
      setIsDeleting(true);

      // Delete all related data first
      await Promise.all([
        supabase.from("page_views").delete().eq("domain", website),
        supabase.from("visits").delete().eq("website_id", website),
        supabase.from("events").delete().eq("domain", website),
      ]);

      // Then delete the website
      await supabase.from("websites").delete().eq("name", website);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting website:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loading text="Getting your data..." />;

  if (pageViews?.length == 0 && !loading) {
    return (
      <div className="min-h-screen flex justify-center items-center mx-auto p-4">
        <Card className="w-[700px]">
          <CardContent className="flex flex-col items-center space-y-4 p-6 pt-8">
            <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-950" />
            <p className="text-lg text-muted-foreground">
              Waiting for the first page view...
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Refresh
            </Button>
            <div className="mt-8 w-full border-t pt-4">
              <Snippet />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageViews)
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-1">
              <h1 className="text-base md:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Analytics for {website}
              </h1>
              <p className="text-sm text-neutral-100">
                Track your website performance and user engagement
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={filterValue}
                onValueChange={(value) => {
                  fetchViews(value);
                  setFilterValue(value);
                }}
              >
                <SelectTrigger className="w-[180px] border-neutral-800 bg-neutral-900/20 text-neutral-100 backdrop-blur-sm hover:bg-neutral-900/80">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="border-neutral-800 bg-neutral-900 text-neutral-100">
                  <SelectItem value="0">Lifetime</SelectItem>
                  <SelectItem value="last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="last 30 days">Last 30 days</SelectItem>
                  <SelectItem value="last 60 days">Last 60 days</SelectItem>
                  <SelectItem value="last 90 days">Last 90 days</SelectItem>
                  <SelectItem value="last 180 days">Last 180 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => fetchViews()}
                variant="outline"
                size="icon"
                className="border-neutral-800 bg-neutral-900/20 text-neutral-100 backdrop-blur-sm hover:bg-neutral-900/80 hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Refresh analytics</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3 bg-neutral-900/20 p-1 backdrop-blur-sm">
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
                Custom Events
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        <span className="mt-2 text-sm text-neutral-500">
                          Total Visits
                        </span>
                      </div>
                      <span className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white">
                        {abbreviateNumber(totalVisits.length)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="h-6 w-6" />
                        <span className="mt-2 text-sm text-neutral-500">
                          Page Views
                        </span>
                      </div>
                      <span className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white">
                        {abbreviateNumber(pageViews.length)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
                      <p>Top Pages</p>
                      <BarChart2 className="w-7 h-7" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {groupedPageViews.map((view, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
                        >
                          <span className="text-sm text-neutral-100">
                            /{view.page}
                          </span>
                          <span className="font-medium text-white">
                            {abbreviateNumber(view.visits)}
                          </span>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
                      <p>
                        Top Visit Sources
                        <span className="ml-2 text-xs italic text-neutral-500">
                          add ?utm={"{source}"} to track
                        </span>
                      </p>
                      <ArrowBigUpDash className="w-7 h-7" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {groupedPageSources.map((source, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
                        >
                          <span className="text-sm text-neutral-100">
                            ?utm={source.source}
                          </span>
                          <span className="font-medium text-white">
                            {abbreviateNumber(source.visits)}
                          </span>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="custom-events">
              {Object.keys(groupedCustomEvents).length > 0 ? (
                <>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {Object.entries(groupedCustomEvents).map(
                        ([eventName, count]) => (
                          <CarouselItem
                            key={eventName}
                            className="md:basis-1/2 lg:basis-1/3"
                          >
                            <Card
                              className={`cursor-pointer border-neutral-800 bg-neutral-950/20 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:shadow-lg ${
                                activeCustomEventTab === eventName
                                  ? "border-neutral-600 shadow-lg"
                                  : ""
                              }`}
                              onClick={() => setActiveCustomEventTab(eventName)}
                            >
                              <CardHeader>
                                <CardTitle className="text-neutral-300">
                                  {eventName}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white">
                                  {count}
                                </p>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        )
                      )}
                    </CarouselContent>
                    <CarouselPrevious className="border-neutral-800 bg-neutral-950/20 text-white hover:bg-neutral-900" />
                    <CarouselNext className="border-neutral-800 bg-neutral-900/20 text-white hover:bg-neutral-900" />
                  </Carousel>

                  <Card className="mt-8 border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-neutral-300">
                        Event Details
                      </CardTitle>
                      {activeCustomEventTab && (
                        <Button
                          onClick={() => setActiveCustomEventTab("")}
                          variant="outline"
                          className="border-neutral-800 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-white"
                        >
                          Show All
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        {customEvents
                          .filter((event) =>
                            activeCustomEventTab
                              ? event.event_name === activeCustomEventTab
                              : true
                          )
                          .map((event) => (
                            <div
                              key={event.id}
                              className="border-b border-neutral-800 py-4 transition-colors hover:bg-neutral-900/20"
                            >
                              <p className="mb-2 text-sm font-medium text-neutral-100">
                                {event.event_name}
                              </p>
                              <p className="text-neutral-100">
                                {event.message}
                              </p>
                              <p className="mt-2 text-xs text-neutral-500">
                                {formatTimeStamp(event.timestamp)}
                              </p>
                            </div>
                          ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-neutral-100">
                      No custom events recorded yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    <span>Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-red-900/10 bg-red-900/20 p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-red-400">
                            Delete Website
                          </p>
                          <p className="text-sm text-neutral-400">
                            Permanently delete this website and all of its data
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={isDeleting}
                              className="bg-red-900 text-red-100 hover:bg-red-900/80"
                            >
                              {isDeleting ? "Deleting..." : "Delete Website"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-neutral-800 bg-neutral-900">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-neutral-100">
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-neutral-400">
                                This action cannot be undone. This will
                                permanently delete your website analytics data
                                and remove all related resources.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-neutral-800 bg-neutral-900 text-neutral-100">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteWebsite}
                                className="bg-red-900 text-red-100 hover:bg-red-900/80"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
}
