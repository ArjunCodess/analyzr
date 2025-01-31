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
  Smartphone,
  Laptop,
  Tablet,
  MapPin,
} from "lucide-react";
import { PageView, Visit, GroupedView, GroupedSource } from "@/types";
import AnalyticsChart from "@/components/analytics-chart";
import {
  abbreviateNumber,
  calculatePagesPerSession,
  getCountryFlagUrl,
  groupByBrowser,
  groupByDeviceType,
  groupByLocation,
  groupByOS,
  capitalizeFirstLetter,
} from "@/lib/utils";
import { fetchActiveUsers } from "@/actions/fetchActiveUsers";
import { useEffect, useState } from "react";
import {
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaMobile,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaOpera,
} from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  const [showOnlyCountries, setShowOnlyCountries] = useState(false);

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
      <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
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
    const totalVisitsCount = sources.reduce(
      (sum, source) => sum + source.visits,
      0
    );
    return sources.map((source) => ({
      ...source,
      percentage: Number(((source.visits / totalVisitsCount) * 100).toFixed(1)),
    }));
  };

  const sourcesWithPercentages = calculateSourcePercentages(groupedPageSources);

  const locationStats = groupByLocation(pageViews);
  const osStats = groupByOS(pageViews);

  const getOSIcon = (os: string) => {
    switch (os.toLowerCase()) {
      case "windows":
        return <FaWindows className="w-4 h-4 text-blue-400" />;
      case "macos":
        return <FaApple className="w-4 h-4 text-gray-300" />;
      case "linux":
        return <FaLinux className="w-4 h-4 text-yellow-400" />;
      case "android":
        return <FaAndroid className="w-4 h-4 text-green-400" />;
      case "ios":
        return <FaMobile className="w-4 h-4 text-gray-300" />;
      default:
        return <BsQuestionCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "desktop":
        return <Monitor className="w-4 h-4 text-blue-400" />;
      case "laptop":
        return <Laptop className="w-4 h-4 text-green-400" />;
      case "tablet":
        return <Tablet className="w-4 h-4 text-purple-400" />;
      case "mobile":
        return <Smartphone className="w-4 h-4 text-red-400" />;
      default:
        return <BsQuestionCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getBrowserIcon = (browserName: string) => {
    switch (browserName.toLowerCase()) {
      case "chrome":
        return <FaChrome className="w-4 h-4 text-blue-400" />;
      case "firefox":
        return <FaFirefox className="w-4 h-4 text-orange-400" />;
      case "safari":
        return <FaSafari className="w-4 h-4 text-blue-300" />;
      case "edge":
        return <FaEdge className="w-4 h-4 text-blue-500" />;
      case "opera":
        return <FaOpera className="w-4 h-4 text-red-400" />;
      default:
        return <BsQuestionCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  // First, calculate the grouped country stats
  const countryStats = locationStats.reduce((acc, location) => {
    const existing = acc.find(l => l.country === location.country);
    if (existing) {
      existing.visits += location.visits;
      return acc;
    }
    return [...acc, { 
      country: location.country, 
      visits: location.visits,
      city: '',
      region: ''
    }];
  }, [] as typeof locationStats);

  // Get grouped data
  const deviceStats = groupByDeviceType(pageViews);
  const browserStats = groupByBrowser(pageViews);

  // Add this near the top of the component where other calculations are done
  const maxPageViews = Math.max(...groupedPageViews.map((view) => view.visits));
  const maxSourceViews = Math.max(
    ...sourcesWithPercentages.map((source) => source.visits)
  );
  const maxLocationViews = showOnlyCountries 
    ? Math.max(...countryStats.map(location => location.visits))
    : Math.max(...locationStats.map(location => location.visits));
  const maxOSViews = Math.max(...osStats.map((os) => os.visits));
  const maxDeviceViews = Math.max(...deviceStats.map((device) => device.count));
  const maxBrowserViews = Math.max(
    ...browserStats.map((browser) => browser.count)
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <span className="mt-2 text-sm text-neutral-500">
                  Total Visits
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-base md:text-lg font-bold tracking-tight text-white">
                  {abbreviateNumber(totalVisits.length)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-6 w-6" />
                <span className="mt-2 text-sm text-neutral-500">
                  Page Views
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-base md:text-lg font-bold tracking-tight text-white">
                  {abbreviateNumber(pageViews.length)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                <span className="mt-2 text-sm text-neutral-500">
                  Pages/Session
                </span>
              </div>
              <span className="text-base md:text-lg font-bold tracking-tight text-white">
                {calculatePagesPerSession(pageViews, totalVisits)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-neutral-300 text-base md:text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                <span className="mt-2 text-sm text-neutral-500">
                  Active Users (~10 mins)
                </span>
              </div>
              <span className="text-base md:text-lg font-bold tracking-tight text-white">
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
        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader className="py-0 pt-4 pb-2">
            <CardTitle className="text-neutral-300 text-base md:text-lg flex flex-row justify-between">
              <p>Top Pages</p>
              <BarChart2 className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 relative">
            <ScrollArea className="h-[300px]">
              <div className="px-4 pb-4">
                {groupedPageViews.map((view, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#111111] px-3 py-2 rounded-md relative mb-2"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-neutral-800/50 rounded-md"
                      style={{
                        width: `${(view.visits / maxPageViews) * 100}%`,
                      }}
                    />
                    <span className="text-sm text-neutral-100 truncate max-w-[80%] relative z-10">
                      /{view.page}
                    </span>
                    <span className="text-sm text-white relative z-10">
                      {abbreviateNumber(view.visits)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader className="py-0 pt-4 pb-2">
            <CardTitle className="text-neutral-300 text-base md:text-lg flex flex-row justify-between">
              <p>Top Visit Sources</p>
              <ArrowBigUpDash className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 relative">
            <ScrollArea className="h-[300px]">
              <div className="px-4 pb-4">
                {sourcesWithPercentages.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#111111] px-3 py-2 rounded-md relative mb-2"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-neutral-800/50 rounded-md"
                      style={{ width: `${(source.visits / maxSourceViews) * 100}%` }}
                    />
                    <span className="text-sm text-neutral-100 relative z-10">
                      {source.source === "" || source.source === "direct" ? "Direct Traffic" : source.source}
                    </span>
                    <span className="text-sm text-white relative z-10">
                      {abbreviateNumber(source.visits)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader className="py-0 pt-4 pb-2">
            <CardTitle className="text-neutral-300 text-base md:text-lg flex flex-row justify-between items-center">
              <div className="flex items-center gap-4">
                <p>Visitor Locations</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowOnlyCountries(!showOnlyCountries)}
                  className="text-xs h-6"
                >
                  {showOnlyCountries ? "Show All Info" : "Show Countries Only"}
                </Button>
              </div>
              <MapPin className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 relative">
            <ScrollArea className="h-[300px]">
              <div className="px-4 pb-4">
                {(showOnlyCountries ? countryStats : locationStats)
                  .sort((a, b) => b.visits - a.visits)
                  .map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#111111] px-3 py-2 rounded-md relative mb-2"
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-neutral-800/50 rounded-md"
                        style={{ width: `${(location.visits / maxLocationViews) * 100}%` }}
                      />
                      <div className="flex items-center gap-4 flex-1 relative z-10">
                        <div className="flex-shrink-0">
                          <Image
                            src={getCountryFlagUrl(location.country)}
                            alt={`${location.country} flag`}
                            width="20"
                            height="15"
                            className="shadow-sm"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex flex-row items-baseline gap-1.5">
                          {showOnlyCountries ? (
                            <span className="text-sm font-medium text-neutral-100">
                              {location.country}
                            </span>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-neutral-100">
                                {location.city}
                              </span>
                              <span className="text-[11px] text-neutral-400 truncate">
                                {location.region}, {location.country}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-white relative z-10">
                        {abbreviateNumber(location.visits)}
                      </span>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader className="py-0 pt-4 pb-2">
            <CardTitle className="text-neutral-300 text-base md:text-lg flex flex-row justify-between">
              <p>Operating Systems</p>
              <Monitor className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 relative">
            <ScrollArea className="h-[300px]">
              <div className="px-4 pb-4">
                {osStats.map((os, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#111111] px-3 py-2 rounded-md relative mb-2"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-neutral-800/50 rounded-md"
                      style={{ width: `${(os.visits / maxOSViews) * 100}%` }}
                    />
                    <div className="flex items-center gap-2 relative z-10">
                      {getOSIcon(os.operating_system)}
                      <span className="text-sm text-neutral-100">
                        {os.operating_system}
                      </span>
                    </div>
                    <span className="text-sm text-white relative z-10">
                      {abbreviateNumber(os.visits)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader className="py-0 pt-4 pb-2">
            <CardTitle className="text-neutral-300 text-base md:text-lg flex flex-row justify-between">
              <p>Device Types</p>
              <Smartphone className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 relative">
            <ScrollArea className="h-[300px]">
              <div className="px-4 pb-4">
                {deviceStats.map(({ deviceType, count }) => (
                  <div
                    key={deviceType}
                    className="flex items-center justify-between bg-[#111111] px-3 py-2 rounded-md relative mb-2"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-neutral-800/50 rounded-md"
                      style={{ width: `${(count / maxDeviceViews) * 100}%` }}
                    />
                    <div className="flex items-center gap-2 relative z-10">
                      {getDeviceIcon(deviceType)}
                      <span className="text-sm text-neutral-100">
                        {capitalizeFirstLetter(deviceType)}
                      </span>
                    </div>
                    <span className="text-sm text-white relative z-10">
                      {abbreviateNumber(count)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
          <CardHeader className="py-0 pt-4 pb-2">
            <CardTitle className="text-neutral-300 text-base md:text-lg flex flex-row justify-between">
              <p>Browsers</p>
              <Globe className="w-6 h-6" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2 relative">
            <ScrollArea className="h-[300px]">
              <div className="px-4 pb-4">
                {browserStats.map(({ browser, count }) => (
                  <div
                    key={browser}
                    className="flex items-center justify-between bg-[#111111] px-3 py-2 rounded-md relative mb-2"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-neutral-800/50 rounded-md"
                      style={{ width: `${(count / maxBrowserViews) * 100}%` }}
                    />
                    <div className="flex items-center gap-2 relative z-10">
                      {getBrowserIcon(browser)}
                      <span className="text-sm text-neutral-100">
                        {browser}
                      </span>
                    </div>
                    <span className="text-sm text-white relative z-10">
                      {abbreviateNumber(count)}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
