import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PageView, Visit, GroupedView, GroupedSource, GroupedLocation, GroupedOS, PerformanceMetrics } from "@/types";

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
  const timestamp = new Date(date);
  
  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get the day with ordinal suffix (1st, 2nd, 3rd, etc.)
  const day = timestamp.getDate();
  const ordinal = (day: number): string => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  return `${months[timestamp.getMonth()]} ${ordinal(day)}, ${timestamp.getFullYear()}`;
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

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

export const getCategory = (score: number) => {
  if (score >= 90) return { label: 'EXCELLENT', color: 'text-green-500', bg: 'bg-green-500/20', isGood: true };
  if (score >= 80) return { label: 'GOOD', color: 'text-blue-500', bg: 'bg-blue-500/20', isGood: true };
  if (score >= 70) return { label: 'AVERAGE', color: 'text-yellow-500', bg: 'bg-yellow-500/20', isGood: false };
  if (score >= 50) return { label: 'POOR', color: 'text-orange-500', bg: 'bg-orange-500/20', isGood: false };
  return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500/20', isGood: false };
};

export const getRecommendations = (metrics: PerformanceMetrics) => {
  const recommendations = [];
  
  if (metrics.performance < 90) {
    recommendations.push({
      title: "Speed Optimization",
      description: "Consider optimizing images and implementing caching strategies",
      metric: metrics.performance,
      icon: "⚡"
    });
  }
  if (metrics.firstContentfulPaint > 1800) {
    recommendations.push({
      title: "First Contentful Paint",
      description: "Reduce server response time and minimize render-blocking resources",
      metric: `${(metrics.firstContentfulPaint / 1000).toFixed(1)}s`,
      icon: "🎨"
    });
  }
  if (metrics.accessibility < 90) {
    recommendations.push({
      title: "Accessibility",
      description: "Improve ARIA labels and contrast ratios",
      metric: metrics.accessibility,
      icon: "♿"
    });
  }
  if (metrics.cumulativeLayoutShift > 0.1) {
    recommendations.push({
      title: "Layout Stability",
      description: "Reduce layout shifts by specifying image dimensions",
      metric: metrics.cumulativeLayoutShift.toFixed(3),
      icon: "📏"
    });
  }
  if (metrics.seo < 90) {
    recommendations.push({
      title: "SEO Optimization",
      description: "Ensure all pages have meta descriptions and proper heading structure",
      metric: metrics.seo,
      icon: "🔍"
    });
  }
  if (metrics.totalBlockingTime > 300) {
    recommendations.push({
      title: "Interactivity",
      description: "Reduce JavaScript execution time and split long tasks",
      metric: `${(metrics.totalBlockingTime / 1000).toFixed(1)}s`,
      icon: "⌛"
    });
  }

  return recommendations.slice(0, 6);
};