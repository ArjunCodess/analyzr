'use server'

import { supabase } from "@/config/supabase";
import { PerformanceMetrics, WebsiteMetrics } from "@/types";

export async function fetchPageSpeedMetrics(websiteId: string): Promise<PerformanceMetrics | null> {
  try {
    const cleanWebsiteId = websiteId.replace(/^(https?:\/\/)?(www\.)?/, '').trim();

    const { data, error } = await supabase
      .from("websites")
      .select(`
        firstContentfulPaint,
        largestContentfulPaint,
        timeToInteractive,
        cumulativeLayoutShift,
        totalBlockingTime,
        overallCategory,
        performance,
        accessibility,
        bestPractices,
        seo,
        speedIndex
      `)
      .eq("name", cleanWebsiteId)
      .single<WebsiteMetrics>();

    if (error) {
      console.error("Error fetching metrics:", error);
      return null;
    }
    
    if (!data) return null;

    return {
      firstContentfulPaint: data.firstContentfulPaint || 0,
      largestContentfulPaint: data.largestContentfulPaint || 0,
      timeToInteractive: data.timeToInteractive || 0,
      cumulativeLayoutShift: data.cumulativeLayoutShift || 0,
      totalBlockingTime: data.totalBlockingTime || 0,
      overallCategory: data.overallCategory || 'AVERAGE',
      performance: data.performance || 0,
      accessibility: data.accessibility || 0,
      bestPractices: data.bestPractices || 0,
      seo: data.seo || 0,
      speedIndex: data.speedIndex || 0,
    };
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return null;
  }
}

export async function getPageSpeedMetrics(websiteId: string, url: string): Promise<PerformanceMetrics | null> {
  try {
    // Improved input validation
    if (!websiteId?.trim()) {
      throw new Error('Website ID is required');
    }
    
    if (!url?.trim()) {
      throw new Error('Website URL is required');
    }

    // Validate URL format
    try {
      new URL(url); // This will throw if URL is invalid
    } catch {
      throw new Error('Invalid website URL format');
    }

    const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!API_KEY) {
      throw new Error('PageSpeed API key is not configured');
    }

    // Clean and validate the website ID
    const cleanWebsiteId = websiteId.toString().replace(/^(https?:\/\/)?(www\.)?/, '').trim();
    
    // Verify that we have a valid website ID
    const { data: websiteExists, error: checkError } = await supabase
      .from('websites')
      .select('name')
      .eq('name', cleanWebsiteId)
      .single();

    if (checkError || !websiteExists) {
      console.error('Website check error:', checkError);
      throw new Error(`Website not found: ${cleanWebsiteId}`);
    }

    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&category=performance&category=accessibility&category=best-practices&category=seo&key=${API_KEY}`;

    console.log('Fetching PageSpeed data for:', url);

    const response = await fetch(apiUrl, { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      console.error('PageSpeed API Response:', data);
      throw new Error(`PageSpeed API error: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.lighthouseResult) {
      console.error('Invalid PageSpeed response:', data);
      throw new Error('Invalid PageSpeed API response');
    }

    const metrics: PerformanceMetrics = {
      firstContentfulPaint: Math.round(data.lighthouseResult.audits['first-contentful-paint'].numericValue),
      largestContentfulPaint: Math.round(data.lighthouseResult.audits['largest-contentful-paint'].numericValue),
      timeToInteractive: Math.round(data.lighthouseResult.audits['interactive'].numericValue),
      cumulativeLayoutShift: Math.round(data.lighthouseResult.audits['cumulative-layout-shift'].numericValue * 1000),
      totalBlockingTime: Math.round(data.lighthouseResult.audits['total-blocking-time'].numericValue),
      overallCategory: data.loadingExperience?.overall_category || 'AVERAGE',
      performance: Math.round(data.lighthouseResult.categories.performance.score * 100),
      accessibility: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
      bestPractices: Math.round(data.lighthouseResult.categories['best-practices'].score * 100),
      seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
      speedIndex: Math.round(data.lighthouseResult.audits['speed-index'].numericValue),
    };

    // Update the database with new metrics
    const { error: updateError } = await supabase
      .from('websites')
      .update({
        firstContentfulPaint: metrics.firstContentfulPaint,
        largestContentfulPaint: metrics.largestContentfulPaint,
        timeToInteractive: metrics.timeToInteractive,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift,
        totalBlockingTime: metrics.totalBlockingTime,
        overallCategory: metrics.overallCategory,
        performance: metrics.performance,
        accessibility: metrics.accessibility,
        bestPractices: metrics.bestPractices,
        seo: metrics.seo,
        speedIndex: metrics.speedIndex,
      })
      .eq('name', cleanWebsiteId);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      throw updateError;
    }

    return metrics;
  } catch (error) {
    console.error('Error in getPageSpeedMetrics:', error);
    throw error;
  }
}