export interface TrackingWindow extends Window {
  your_tracking: {
    (eventName: string, options?: TrackingOptions): void;
    q?: Array<[string, TrackingOptions?]>;
  };
}

export interface TrackingOptions {
  callback?: () => void;
}

export interface UserAgentInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  viewportSize: string;
  isMobile: boolean;
}

export interface PageMetrics {
  timeOnPage: number;
  scrollDepth: number;
  docHeight: number;
  referrer: string;
  lastActiveTime: number;
}

export interface TrackingPayload {
  event: string;
  url: string;
  domain: string | null;
  source: string | null;
  timestamp: number;
  userAgent: UserAgentInfo;
  metrics: PageMetrics;
  [key: string]: unknown;
}

export interface Session {
  sessionId: string;
  expirationTimestamp: number;
}

export interface Website {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  visitors_count?: number;
  pageviews_count?: number;
  bounce_rate?: number;
}

export interface WebsiteRow {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface Analytics {
  visitors_count: number;
  pageviews_count: number;
  bounce_rate: number;
}

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type CountResult = { count: number | null };

export interface PageView {
  page: string;
  created_at: string;
}

export interface Visit {
  session_id: string;
  event: 'session_start' | 'session_end' | 'pageview';
  created_at: string;
  source: string | null;
}

export interface CustomEvent {
  id: string;
  event_name: string;
  message: string;
  timestamp: string;
}

export interface GroupedView {
  page: string;
  visits: number;
}

export interface GroupedSource {
  source: string;
  visits: number;
}

export interface AnalyticsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface TopPagesCardProps {
  groupedPageViews: GroupedView[];
  abbreviateNumber: (n: number) => string;
}

export interface TopSourcesCardProps {
  groupedPageSources: GroupedSource[];
  abbreviateNumber: (n: number) => string;
}

export interface CustomEventsCarouselProps {
  groupedCustomEvents: Record<string, number>;
  activeCustomEventTab: string;
  setActiveCustomEventTab: (tab: string) => void;
}

export interface CustomEventsDetailsProps {
  customEvents: CustomEvent[];
  activeCustomEventTab: string;
  setActiveCustomEventTab: (tab: string) => void;
  formatTimeStamp: (date: string) => string;
}

export interface DangerZoneProps {
  isDeleting: boolean;
  onDelete: () => Promise<void>;
} 

export interface SessionDurationStats {
  averageDuration: string;
  shortestSession: string;
  longestSession: string;
}