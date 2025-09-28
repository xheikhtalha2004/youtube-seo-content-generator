export interface KeywordMetrics {
  searchVolume: string;
  competition: 'Low' | 'Medium' | 'High';
  overallScore: number;
  ctr: string;
  clicks: string;
  volume: number;
  globalVolume: string;
  rankabilityRating: 'Excellent' | 'Good' | 'Fair' | 'Difficult';
  keywordDifficulty: number;
  trend: 'Growing' | 'Stable' | 'Declining';
  suggestedContentType: string;
}

export interface TopVideo {
  title: string;
  url: string;
  channelName: string;
  views: string;
  publishDate: string;
}

export interface SeoResult {
  metrics: KeywordMetrics;
  titles: string[];
  descriptions: string[];
  tags: string[];
  scriptOutline: {
    hook: string;
    introduction: string;
    mainPoints: string[];
    callToAction: string;
    conclusion: string;
  };
  relatedKeywords: string[];
}

export interface AnalysisResult {
    seoData: SeoResult;
    videoData: TopVideo[];
}
