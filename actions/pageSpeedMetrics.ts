'use server'

import { supabase } from "@/config/supabase";
import { PerformanceMetrics, WebsiteMetrics } from "@/types";

export async function fetchPageSpeedMetrics(websiteId: string): Promise<PerformanceMetrics | null> {
  try {
    if (!websiteId?.trim()) {
      throw new Error('[fetchPageSpeedMetrics] Website ID is required');
    }

    const cleanWebsiteId = websiteId.replace(/^(https?:\/\/)?(www\.)?/, '').trim();

    const { data, error } = await supabase
      .from("websites")
      .select(`
        firstContentfulPaint,
        largestContentfulPaint,
        timeToInteractive,
        cumulativeLayoutShift,
        totalBlockingTime,
        performance,
        accessibility,
        bestPractices,
        seo,
        speedIndex
      `)
      .eq("name", cleanWebsiteId)
      .single<WebsiteMetrics>();

    if (error) {
      throw new Error(`[fetchPageSpeedMetrics] Database error: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`[fetchPageSpeedMetrics] No metrics found for website: ${cleanWebsiteId}`);
    }

    return {
      firstContentfulPaint: data.firstContentfulPaint || 0,
      largestContentfulPaint: data.largestContentfulPaint || 0,
      timeToInteractive: data.timeToInteractive || 0,
      cumulativeLayoutShift: data.cumulativeLayoutShift || 0,
      totalBlockingTime: data.totalBlockingTime || 0,
      performance: data.performance || 0,
      accessibility: data.accessibility || 0,
      bestPractices: data.bestPractices || 0,
      seo: data.seo || 0,
      speedIndex: data.speedIndex || 0,
    };
  } catch (error) {
    console.error('[fetchPageSpeedMetrics] Error:', error);
    throw error;
  }
}

export async function getPageSpeedMetrics(websiteId: string, url: string): Promise<PerformanceMetrics | null> {
  try {
    // Input validation with specific errors
    if (!websiteId?.trim()) {
      throw new Error('[getPageSpeedMetrics] Website ID is required');
    }
    
    if (!url?.trim()) {
      throw new Error('[getPageSpeedMetrics] Website URL is required');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new Error(`[getPageSpeedMetrics] Invalid URL format: ${url}`);
    }

    const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!API_KEY) {
      throw new Error('[getPageSpeedMetrics] PageSpeed API key is not configured in environment variables');
    }

    const cleanWebsiteId = websiteId.toString().replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    
    // Website existence check
    const { data: websiteExists, error: checkError } = await supabase
      .from('websites')
      .select('name')
      .eq('name', cleanWebsiteId)
      .single();

    if (checkError) {
      throw new Error(`[getPageSpeedMetrics] Database error while checking website: ${checkError.message}`);
    }

    if (!websiteExists) {
      throw new Error(`[getPageSpeedMetrics] Website not found in database: ${cleanWebsiteId}`);
    }

    // PageSpeed API call
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&category=performance&category=accessibility&category=best-practices&category=seo&key=${API_KEY}`;

    const response = await fetch(apiUrl, { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`[getPageSpeedMetrics] PageSpeed API error: ${data.error?.message || `HTTP ${response.status}`}`);
    }

    if (!data.lighthouseResult) {
      throw new Error('[getPageSpeedMetrics] Invalid PageSpeed API response: Missing lighthouse results');
    }

    // Process metrics and update database
    const metrics = {
      firstContentfulPaint: Math.round(data.lighthouseResult.audits['first-contentful-paint'].numericValue),
      largestContentfulPaint: Math.round(data.lighthouseResult.audits['largest-contentful-paint'].numericValue),
      timeToInteractive: Math.round(data.lighthouseResult.audits['interactive'].numericValue),
      cumulativeLayoutShift: Math.round(data.lighthouseResult.audits['cumulative-layout-shift'].numericValue * 1000),
      totalBlockingTime: Math.round(data.lighthouseResult.audits['total-blocking-time'].numericValue),
      performance: Math.round(data.lighthouseResult.categories.performance.score * 100),
      accessibility: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
      bestPractices: Math.round(data.lighthouseResult.categories['best-practices'].score * 100),
      seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
      speedIndex: Math.round(data.lighthouseResult.audits['speed-index'].numericValue),
    };

    const { error: updateError } = await supabase
      .from('websites')
      .update(metrics)
      .eq('name', cleanWebsiteId);

    if (updateError) {
      throw new Error(`[getPageSpeedMetrics] Failed to update metrics in database: ${updateError.message}`);
    }

    return metrics;
  } catch (error) {
    console.error('[getPageSpeedMetrics] Error:', error);
    throw error;
  }
}