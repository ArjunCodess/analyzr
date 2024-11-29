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
    const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!API_KEY) {
      console.error('PageSpeed API key is missing');
      return null;
    }

    // Clean the website ID
    const cleanWebsiteId = websiteId.replace(/^(https?:\/\/)?(www\.)?/, '').trim();

    // Construct the PageSpeed API URL
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${API_KEY}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;

    // Make the API request with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const response = await fetch(apiUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('PageSpeed API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.lighthouseResult) {
      console.error('No lighthouse results in response');
      return null;
    }

    // Extract metrics
    const metrics: PerformanceMetrics = {
      firstContentfulPaint: Math.round(data.lighthouseResult.audits['first-contentful-paint'].numericValue),
      largestContentfulPaint: Math.round(data.lighthouseResult.audits['largest-contentful-paint'].numericValue),
      timeToInteractive: Math.round(data.lighthouseResult.audits['interactive'].numericValue),
      cumulativeLayoutShift: Math.round(data.lighthouseResult.audits['cumulative-layout-shift'].numericValue * 1000) / 1000,
      totalBlockingTime: Math.round(data.lighthouseResult.audits['total-blocking-time'].numericValue),
      performance: Math.round(data.lighthouseResult.categories.performance.score * 100),
      accessibility: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
      bestPractices: Math.round(data.lighthouseResult.categories['best-practices'].score * 100),
      seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
      speedIndex: Math.round(data.lighthouseResult.audits['speed-index'].numericValue)
    };

    // Update the database
    const { error: updateError } = await supabase
      .from('websites')
      .update(metrics)
      .eq('name', cleanWebsiteId);

    if (updateError) {
      console.error('Error updating metrics in database:', updateError);
      return null;
    }

    return metrics;
  } catch (error) {
    console.error('Error in getPageSpeedMetrics:', error);
    return null;
  }
}