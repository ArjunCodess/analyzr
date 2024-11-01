import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowBigUpDash,
  BarChart2,
  MousePointerClick,
  Users,
  Activity,
  Clock,
  Globe,
  Monitor,
} from "lucide-react";
import { PageView, Visit, GroupedView, GroupedSource } from "@/types";
import AnalyticsChart from "@/components/analytics-chart";
import {
  abbreviateNumber,
  calculatePagesPerSession,
  groupByLocation,
  groupByOS,
} from "@/lib/utils";
import { fetchActiveUsers } from "@/actions/fetchActiveUsers";
import { useEffect, useState } from "react";
import { 
  FaWindows, 
  FaApple, 
  FaLinux, 
  FaAndroid, 
  FaMobile 
} from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";

interface GeneralAnalyticsProps {
  pageViews: PageView[];
  totalVisits: Visit[];
  groupedPageViews: GroupedView[];
  groupedPageSources: GroupedSource[];
  filterValue: string;
  website: string;
}

export default function GeneralAnalytics({
  pageViews,
  totalVisits,
  groupedPageViews,
  groupedPageSources,
  filterValue,
  website,
}: GeneralAnalyticsProps) {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const loadActiveUsers = async () => {
      const count = await fetchActiveUsers(website);
      setActiveUsers(count);
    };

    loadActiveUsers();
    
    // Refresh active users count every minute
    const interval = setInterval(loadActiveUsers, 60000);
    
    return () => clearInterval(interval);
  }, [website]);

  const filterDataByTimePeriod = (date: Date) => {
    if (filterValue === "0") return true;

    const now = new Date();
    const timeAgo = new Date(date);
    const diffInHours = (now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60);

    switch (filterValue) {
      case "last 1 hour":
        return diffInHours <= 1;
      case "last 1 day":
        return diffInHours <= 24;
      case "last 7 days":
        return diffInHours <= 24 * 7;
      case "last 30 days":
        return diffInHours <= 24 * 30;
      case "last 90 days":
        return diffInHours <= 24 * 90;
      case "last 365 days":
        return diffInHours <= 24 * 365;
      default:
        return true;
    }
  };

  const filteredPageViews = pageViews.filter((view) =>
    filterDataByTimePeriod(new Date(view.created_at))
  );

  const filteredVisits = totalVisits.filter((visit) =>
    filterDataByTimePeriod(new Date(visit.created_at))
  );

  if (filteredPageViews.length === 0 && filteredVisits.length === 0) {
    return (
      <Card className="border-neutral-800 bg-neutral-900/20 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-neutral-100">
            No analytics available for the given time range.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentages for sources
  const calculateSourcePercentages = (sources: GroupedSource[]) => {
    const totalVisitsCount = sources.reduce((sum, source) => sum + source.visits, 0);
    return sources.map(source => ({
      ...source,
      percentage: Number(((source.visits / totalVisitsCount) * 100).toFixed(1))
    }));
  };

  const sourcesWithPercentages = calculateSourcePercentages(groupedPageSources);

  const locationStats = groupByLocation(pageViews);
  const osStats = groupByOS(pageViews);

  const getOSIcon = (os: string) => {
    switch(os.toLowerCase()) {
      case 'windows':
        return <FaWindows className="w-4 h-4 text-blue-400" />;
      case 'macos':
        return <FaApple className="w-4 h-4 text-gray-300" />;
      case 'linux':
        return <FaLinux className="w-4 h-4 text-yellow-400" />;
      case 'android':
        return <FaAndroid className="w-4 h-4 text-green-400" />;
      case 'ios':
        return <FaMobile className="w-4 h-4 text-gray-300" />;
      default:
        return <BsQuestionCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <>
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

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                <span className="mt-2 text-sm text-neutral-500">
                  Pages/Session
                </span>
              </div>
              <span className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white">
                {calculatePagesPerSession(pageViews, totalVisits)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <span className="mt-2 text-sm text-neutral-500">
                  Active Users (last 10 minutes)
                </span>
              </div>
              <span className="text-base md:text-lg lg:text-xl font-bold tracking-tight text-white">
                {activeUsers}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="my-6">
        <AnalyticsChart
          pageViews={pageViews}
          visits={totalVisits}
          timePeriod={filterValue}
        />
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
                  className="flex items-center justify-between border my-2 border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
                >
                  <span className="text-sm text-neutral-100">/{view.page}</span>
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
              {sourcesWithPercentages.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border my-2 border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
                >
                  <span className="text-sm text-neutral-100">
                    {source.source === "" ? "Direct Traffic" : `?utm=${source.source}`}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-400">
                      {source.percentage}%
                    </span>
                    <span className="font-medium text-white">
                      {abbreviateNumber(source.visits)}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
              <p>Visitor Locations</p>
              <Globe className="w-7 h-7" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {locationStats.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border my-2 border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-neutral-100">{location.city}</span>
                    <span className="text-xs text-neutral-400">
                      {location.region}, {location.country}
                    </span>
                  </div>
                  <span className="font-medium text-white">
                    {abbreviateNumber(location.visits)}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-950/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
              <p>Operating Systems</p>
              <Monitor className="w-7 h-7" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {osStats.map((os, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border my-2 border-neutral-800 p-4 transition-colors hover:bg-neutral-900/20 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    {getOSIcon(os.operating_system)}
                    <span className="text-sm text-neutral-100">
                      {os.operating_system}
                    </span>
                  </div>
                  <span className="font-medium text-white">
                    {abbreviateNumber(os.visits)}
                  </span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
