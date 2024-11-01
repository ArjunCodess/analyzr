import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PageView, Visit, GroupedView, GroupedSource, GroupedLocation, GroupedOS } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbreviateNumber(number: number): string {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
}

export function calculatePagesPerSession(pageViews: PageView[], totalVisits: Visit[]): string {
  if (totalVisits.length === 0) return "0";
  return (pageViews.length / totalVisits.length).toFixed(1);
}

export function groupPageViews(pageViews: PageView[]): GroupedView[] {
  const groupedPageViews: Record<string, number> = {};

  pageViews.forEach(({ page }) => {
    const path = page.replace(/^(?:\/\/|[^/]+)*\//, "");
    groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
  });

  return Object.entries(groupedPageViews)
    .map(([page, visits]) => ({ page, visits }))
    .sort((a, b) => b.visits - a.visits);
}

export function groupPageSources(visits: Visit[]): GroupedSource[] {
  const groupedPageSources: Record<string, number> = {};

  visits.forEach(({ source }) => {
    groupedPageSources[source!] = (groupedPageSources[source!] || 0) + 1;
  });

  return Object.entries(groupedPageSources)
    .map(([source, visits]) => ({ source, visits }))
    .sort((a, b) => b.visits - a.visits);
}

export function formatTimeStamp(date: string): string {
  return new Date(date).toLocaleString();
}

export function groupByLocation(pageViews: PageView[]): GroupedLocation[] {
  const grouped: Record<string, GroupedLocation> = {};

  pageViews.forEach((view) => {
    const key = `${view.city}-${view.region}-${view.country}`;
    if (!grouped[key]) {
      grouped[key] = {
        city: view.city || 'Unknown',
        region: view.region || 'Unknown',
        country: view.country || 'Unknown',
        visits: 0
      };
    }
    grouped[key].visits++;
  });

  return Object.values(grouped).sort((a, b) => b.visits - a.visits);
}

export function groupByOS(pageViews: PageView[]): GroupedOS[] {
  const grouped: Record<string, number> = {};

  pageViews.forEach((view) => {
    const os = view.operating_system || 'Unknown';
    grouped[os] = (grouped[os] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([operating_system, visits]) => ({ operating_system, visits }))
    .sort((a, b) => b.visits - a.visits);
}

// Add country code mapping
const countryToCode: Record<string, string> = {
  'India': 'in',
  'United States': 'us',
  'United Kingdom': 'gb',
  'Canada': 'ca',
  'Australia': 'au',
  'Germany': 'de',
  'France': 'fr',
  'Japan': 'jp',
  'China': 'cn',
  'Brazil': 'br',
  'Russia': 'ru',
  'South Korea': 'kr',
  'Italy': 'it',
  'Spain': 'es',
  'Mexico': 'mx',
  'Indonesia': 'id',
  'Netherlands': 'nl',
  'Singapore': 'sg',
  'Sweden': 'se',
  'Switzerland': 'ch',
};

export function getCountryFlagUrl(countryName: string): string {
  const countryCode = countryToCode[countryName]?.toLowerCase() || 'un';
  return `https://flagcdn.com/256x192/${countryCode}.png`;
}

export function groupByDeviceType(pageViews: PageView[]) {
  const grouped = pageViews.reduce((acc: Record<string, number>, view) => {
    const deviceType = view.device_type || 'Unknown';
    acc[deviceType] = (acc[deviceType] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([deviceType, count]) => ({
    deviceType,
    count
  }));
}

export function groupByBrowser(pageViews: PageView[]) {
  const grouped = pageViews.reduce((acc: Record<string, number>, view) => {
    const browser = view.browser_name || 'Unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([browser, count]) => ({
    browser,
    count
  }));
}

export function groupByScreenResolution(pageViews: PageView[]) {
  const grouped = pageViews.reduce((acc: Record<string, number>, view) => {
    const resolution = view.screen_resolution || 'Unknown';
    acc[resolution] = (acc[resolution] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([resolution, count]) => ({
    resolution,
    count
  }));
}