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

const countryToCode: Record<string, string> = {
  'Afghanistan': 'af',
  'Albania': 'al',
  'Algeria': 'dz',
  'Andorra': 'ad',
  'Angola': 'ao',
  'Antigua and Barbuda': 'ag',
  'Argentina': 'ar',
  'Armenia': 'am',
  'Australia': 'au',
  'Austria': 'at',
  'Azerbaijan': 'az',
  'Bahamas': 'bs',
  'Bahrain': 'bh',
  'Bangladesh': 'bd',
  'Barbados': 'bb',
  'Belarus': 'by',
  'Belgium': 'be',
  'Belize': 'bz',
  'Benin': 'bj',
  'Bhutan': 'bt',
  'Bolivia': 'bo',
  'Bosnia and Herzegovina': 'ba',
  'Botswana': 'bw',
  'Brazil': 'br',
  'Brunei': 'bn',
  'Bulgaria': 'bg',
  'Burkina Faso': 'bf',
  'Burundi': 'bi',
  'Cabo Verde': 'cv',
  'Cambodia': 'kh',
  'Cameroon': 'cm',
  'Canada': 'ca',
  'Central African Republic': 'cf',
  'Chad': 'td',
  'Chile': 'cl',
  'China': 'cn',
  'Colombia': 'co',
  'Comoros': 'km',
  'Congo (Congo-Brazzaville)': 'cg',
  'Congo (DRC)': 'cd',
  'Costa Rica': 'cr',
  'Croatia': 'hr',
  'Cuba': 'cu',
  'Cyprus': 'cy',
  'Czechia (Czech Republic)': 'cz',
  'Denmark': 'dk',
  'Djibouti': 'dj',
  'Dominica': 'dm',
  'Dominican Republic': 'do',
  'Ecuador': 'ec',
  'Egypt': 'eg',
  'El Salvador': 'sv',
  'Equatorial Guinea': 'gq',
  'Eritrea': 'er',
  'Estonia': 'ee',
  'Eswatini (fmr. "Swaziland")': 'sz',
  'Ethiopia': 'et',
  'Fiji': 'fj',
  'Finland': 'fi',
  'France': 'fr',
  'Gabon': 'ga',
  'Gambia': 'gm',
  'Georgia': 'ge',
  'Germany': 'de',
  'Ghana': 'gh',
  'Greece': 'gr',
  'Grenada': 'gd',
  'Guatemala': 'gt',
  'Guinea': 'gn',
  'Guinea-Bissau': 'gw',
  'Guyana': 'gy',
  'Haiti': 'ht',
  'Honduras': 'hn',
  'Hungary': 'hu',
  'Iceland': 'is',
  'India': 'in',
  'Indonesia': 'id',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Ireland': 'ie',
  'Israel': 'il',
  'Italy': 'it',
  'Jamaica': 'jm',
  'Japan': 'jp',
  'Jordan': 'jo',
  'Kazakhstan': 'kz',
  'Kenya': 'ke',
  'Kiribati': 'ki',
  'Kuwait': 'kw',
  'Kyrgyzstan': 'kg',
  'Laos': 'la',
  'Latvia': 'lv',
  'Lebanon': 'lb',
  'Lesotho': 'ls',
  'Liberia': 'lr',
  'Libya': 'ly',
  'Liechtenstein': 'li',
  'Lithuania': 'lt',
  'Luxembourg': 'lu',
  'Madagascar': 'mg',
  'Malawi': 'mw',
  'Malaysia': 'my',
  'Maldives': 'mv',
  'Mali': 'ml',
  'Malta': 'mt',
  'Marshall Islands': 'mh',
  'Mauritania': 'mr',
  'Mauritius': 'mu',
  'Mexico': 'mx',
  'Micronesia': 'fm',
  'Moldova': 'md',
  'Monaco': 'mc',
  'Mongolia': 'mn',
  'Montenegro': 'me',
  'Morocco': 'ma',
  'Mozambique': 'mz',
  'Myanmar (formerly Burma)': 'mm',
  'Namibia': 'na',
  'Nauru': 'nr',
  'Nepal': 'np',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'Nicaragua': 'ni',
  'Niger': 'ne',
  'Nigeria': 'ng',
  'North Korea': 'kp',
  'North Macedonia': 'mk',
  'Norway': 'no',
  'Oman': 'om',
  'Pakistan': 'pk',
  'Palau': 'pw',
  'Palestine State': 'ps',
  'Panama': 'pa',
  'Papua New Guinea': 'pg',
  'Paraguay': 'py',
  'Peru': 'pe',
  'Philippines': 'ph',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Qatar': 'qa',
  'Romania': 'ro',
  'Russia': 'ru',
  'Rwanda': 'rw',
  'Saint Kitts and Nevis': 'kn',
  'Saint Lucia': 'lc',
  'Saint Vincent and the Grenadines': 'vc',
  'Samoa': 'ws',
  'San Marino': 'sm',
  'Sao Tome and Principe': 'st',
  'Saudi Arabia': 'sa',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'Seychelles': 'sc',
  'Sierra Leone': 'sl',
  'Singapore': 'sg',
  'Slovakia': 'sk',
  'Slovenia': 'si',
  'Solomon Islands': 'sb',
  'Somalia': 'so',
  'South Africa': 'za',
  'South Korea': 'kr',
  'South Sudan': 'ss',
  'Spain': 'es',
  'Sri Lanka': 'lk',
  'Sudan': 'sd',
  'Suriname': 'sr',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Syria': 'sy',
  'Taiwan': 'tw',
  'Tajikistan': 'tj',
  'Tanzania': 'tz',
  'Thailand': 'th',
  'Timor-Leste': 'tl',
  'Togo': 'tg',
  'Tonga': 'to',
  'Trinidad and Tobago': 'tt',
  'Tunisia': 'tn',
  'Turkey': 'tr',
  'Turkmenistan': 'tm',
  'Tuvalu': 'tv',
  'Uganda': 'ug',
  'Ukraine': 'ua',
  'United Arab Emirates': 'ae',
  'United Kingdom': 'gb',
  'United States': 'us',
  'Uruguay': 'uy',
  'Uzbekistan': 'uz',
  'Vanuatu': 'vu',
  'Vatican City': 'va',
  'Venezuela': 've',
  'Vietnam': 'vn',
  'Yemen': 'ye',
  'Zambia': 'zm',
  'Zimbabwe': 'zw'
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