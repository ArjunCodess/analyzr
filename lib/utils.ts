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