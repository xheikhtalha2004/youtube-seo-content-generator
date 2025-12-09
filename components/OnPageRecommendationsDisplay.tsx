import React, { useState } from 'react';
import { OnPageRecommendations } from '../types';
import ResultCard from './ResultCard';

interface OnPageRecommendationsDisplayProps {
  recommendations: OnPageRecommendations;
}

const OnPageRecommendationsDisplay: React.FC<OnPageRecommendationsDisplayProps> = ({ recommendations }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    overview: true,
    keywordDensity: true,
    title: false,
    description: false,
    tags: false,
    script: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 75) return 'bg-green-500/10 border-green-500/30';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const ScoreIndicator = ({ score, label }: { score: number; label: string }) => (
    <div className={`p-4 rounded-lg border ${getScoreBgColor(score)}`}>
      <div className="flex items-center justify-between">
        <span className="text-slate-300 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className={`font-bold text-lg min-w-12 text-right ${getScoreColor(score)}`}>
            {score.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );

  const CollapsibleSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSection(sectionKey);
        }}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors duration-150"
      >
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            expandedSections[sectionKey] ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {expandedSections[sectionKey] && (
        <div className="border-t border-slate-700 p-4 space-y-3 bg-slate-900/30">{children}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <ResultCard title="On-Page SEO Recommendations" icon={<OptimizationIcon />}>
        <div className="space-y-6">
          {/* Overall Score */}
          <CollapsibleSection title="Overall SEO Score" sectionKey="overview">
            <ScoreIndicator score={recommendations.overallScore} label="Overall Score" />
            <p className="text-sm text-slate-400 mt-3">
              {recommendations.overallScore >= 75
                ? 'Excellent! Your content is well-optimized for SEO.'
                : recommendations.overallScore >= 50
                ? 'Good! There are some optimization opportunities available.'
                : 'Your content needs significant optimization for better SEO performance.'}
            </p>
          </CollapsibleSection>

          {/* Keyword Density */}
          <CollapsibleSection title="Keyword Density Analysis" sectionKey="keywordDensity">
            <div className="space-y-4">
              <div className="text-sm text-slate-300 bg-slate-700/30 p-3 rounded border border-slate-600">
                {recommendations.keywordDensity.summary}
              </div>

              {/* Title Density */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Title Density</span>
                  <span
                    className={`text-sm font-semibold ${getDensityStatusColor(
                      recommendations.keywordDensity.title.status
                    )}`}
                  >
                    {recommendations.keywordDensity.title.density.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {recommendations.keywordDensity.title.recommendation}
                </p>
              </div>

              {/* Description Density */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Description Density</span>
                  <span
                    className={`text-sm font-semibold ${getDensityStatusColor(
                      recommendations.keywordDensity.description.status
                    )}`}
                  >
                    {recommendations.keywordDensity.description.density.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {recommendations.keywordDensity.description.recommendation}
                </p>
              </div>

              {/* Tags Density */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Tags Density</span>
                  <span
                    className={`text-sm font-semibold ${getDensityStatusColor(
                      recommendations.keywordDensity.tags.status
                    )}`}
                  >
                    {recommendations.keywordDensity.tags.density.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {recommendations.keywordDensity.tags.recommendation}
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Title Optimization */}
          <CollapsibleSection title="Title Optimization" sectionKey="title">
            <div className="space-y-4">
              <ScoreIndicator score={recommendations.titleOptimization.score} label="Title Score" />

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Length</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.titleOptimization.length} chars
                  </p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Keyword in First 30</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.titleOptimization.keywordInFirst30 ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {recommendations.titleOptimization.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <CheckIcon />
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Description Optimization */}
          <CollapsibleSection title="Description Optimization" sectionKey="description">
            <div className="space-y-4">
              <ScoreIndicator score={recommendations.descriptionOptimization.score} label="Description Score" />

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Characters</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.descriptionOptimization.characterCount}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Words</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.descriptionOptimization.wordCount}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Has CTA</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.descriptionOptimization.hasCTA ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {recommendations.descriptionOptimization.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <CheckIcon />
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Tags Optimization */}
          <CollapsibleSection title="Tags Optimization" sectionKey="tags">
            <div className="space-y-4">
              <ScoreIndicator score={recommendations.tagsOptimization.score} label="Tags Score" />

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Tag Count</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.tagsOptimization.count}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Long-Tail</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.tagsOptimization.longTailCount}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Has Keyword</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.tagsOptimization.hasKeyword ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {recommendations.tagsOptimization.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <CheckIcon />
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Script Structure */}
          <CollapsibleSection title="Script Structure & Keywords" sectionKey="script">
            <div className="space-y-4">
              <ScoreIndicator score={recommendations.scriptStructure.score} label="Script Score" />

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Keyword in Hook</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.scriptStructure.hasKeywordInHook ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                  <p className="text-xs text-slate-400">Main Points</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {recommendations.scriptStructure.mainPointsCount}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {recommendations.scriptStructure.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <CheckIcon />
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Readability Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CollapsibleSection title="Title Readability" sectionKey="titleReadability">
              <div className="space-y-4">
                <ScoreIndicator score={recommendations.titleReadability.score} label="Readability" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Grade Level</span>
                    <span className="text-slate-200 font-semibold">
                      {recommendations.titleReadability.gradeLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Difficulty</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      {recommendations.titleReadability.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Word Count</span>
                    <span className="text-slate-200 font-semibold">
                      {recommendations.titleReadability.wordCount}
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Description Readability" sectionKey="descriptionReadability">
              <div className="space-y-4">
                <ScoreIndicator score={recommendations.descriptionReadability.score} label="Readability" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Grade Level</span>
                    <span className="text-slate-200 font-semibold">
                      {recommendations.descriptionReadability.gradeLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Difficulty</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      {recommendations.descriptionReadability.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Sentences</span>
                    <span className="text-slate-200 font-semibold">
                      {recommendations.descriptionReadability.sentenceCount}
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* All Recommendations Summary */}
          {recommendations.allRecommendations.length > 0 && (
            <div className="border border-slate-700 rounded-lg bg-slate-800/30 p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Recommendations Summary</h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {recommendations.allRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-sm">
                    <span className="text-red-400 font-bold">•</span>
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ResultCard>
    </div>
  );
};

// Helper function to get color for density status
const getDensityStatusColor = (status: string): string => {
  switch (status) {
    case 'optimal':
      return 'text-green-400';
    case 'too_low':
      return 'text-yellow-400';
    case 'too_high':
      return 'text-red-400';
    default:
      return 'text-slate-400';
  }
};

// SVG Icons
const OptimizationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default OnPageRecommendationsDisplay;
