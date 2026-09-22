export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  image_url: string;
  published_at: string;
  category: string;
  sectors?: string[];
  companies?: string[];
  initial_sentiment?: "Positive" | "Neutral" | "Negative";
  sentiment_score?: number;
  saved_at?: string;
}

export interface FinancialTerm {
  term: string;
  simple_meaning: string;
  example: string;
}

export interface SimplifiedAnalysis {
  article_id?: string;
  language: "en" | "hi" | "mr";
  summary: string;
  key_points: string[];
  why_it_matters: string;
  market_impact: string;
  affected_sectors: string[];
  affected_companies: string[];
  important_numbers: string[];
  financial_terms: FinancialTerm[];
  sentiment: "Positive" | "Neutral" | "Negative";
  sentiment_score: number;
  sentiment_reason: string;
  uncertainty: string;
  takeaway: string;
  disclaimer?: string;
  analyzed_at?: string;
  is_ai_generated?: boolean;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
  currency: string;
  lastUpdated: string;
  sparkline: number[];
  dayRange: { low: number; high: number };
  volume?: string;
}

export interface SectorPerformance {
  name: string;
  change: number;
  direction: "up" | "down";
}

export interface LiveMarketData {
  symbol: string;
  name: string;
  query: string;
  value: number;
  valueFormatted: string;
  change: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
  currency: string;
  unit?: string;
  ratesBreakdown?: {
    gold24k_10g?: string;
    gold22k_10g?: string;
    gold18k_10g?: string;
    goldSpotUsdOz?: string;
    silver1kg?: string;
  };
  lastUpdated: string;
  source: string;
  dayRange?: { low: number; high: number };
  note?: string;
}

export interface ChatCitation {
  title: string;
  url: string;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  citations?: ChatCitation[];
}

export type LanguageCode = "en" | "hi" | "mr";
export type NavTab = "home" | "latest" | "markets" | "saved" | "about";

export const CATEGORIES = [
  "All",
  "Stock Market",
  "Business",
  "Economy",
  "Technology",
  "Banking",
  "Cryptocurrency",
  "Global Markets",
  "Startups",
] as const;

export const INTEREST_OPTIONS = [
  "Stock Market",
  "Technology",
  "Banking",
  "Startups",
  "Crypto",
  "Global Economy",
  "Indian Economy",
  "AI",
] as const;
