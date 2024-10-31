import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PageView, Visit, GroupedView, GroupedSource } from "@/types";

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