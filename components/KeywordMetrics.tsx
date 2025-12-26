import React from 'react';
import { KeywordMetrics as KeywordMetricsType } from '../types';
import Speedometer from './Speedometer';

const MetricInfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => (
  <div className="relative group ml-1 inline-block">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 hover:text-primary-400 transition-colors cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3 text-xs text-center text-slate-200 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">{tooltip}</div>
  </div>
);

const getIndicatorColor = (type: 'competition' | 'trend', value: string) => {
  switch (type) {
    case 'competition':
      if (value === 'Low') return 'text-green-400 bg-green-500/10 border-green-500/20';
      if (value === 'Medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      if (value === 'High') return 'text-red-400 bg-red-500/10 border-red-500/20';
      break;
    case 'trend':
      if (value === 'Growing') return 'text-green-400 bg-green-500/10 border-green-500/20';
      if (value === 'Stable') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      if (value === 'Declining') return 'text-red-400 bg-red-500/10 border-red-500/20';
      break;
  }
  return 'text-slate-400 bg-slate-800 border-slate-700';
};

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subValue?: React.ReactNode;
  icon: React.ReactNode;
  tooltip: string;
  className?: string;
}> = ({ label, value, subValue, icon, tooltip, className = "" }) => (
  <div className={`glass-panel p-3 px-4 rounded-xl border border-slate-700/50 hover:border-primary-500/30 transition-all duration-300 group ${className}`}>
    <div className="flex justify-between items-center mb-1">
      <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
        {label} <MetricInfoIcon tooltip={tooltip} />
      </span>
      <div className="text-slate-600 group-hover:text-primary-500 transition-colors scale-90">
        {icon}
      </div>
    </div>
    <div className="text-lg font-bold text-white tracking-tight">{value}</div>
    {subValue && <div className="mt-1">{subValue}</div>}
  </div>
);

const KeywordMetrics: React.FC<{ metrics: KeywordMetricsType; keyword: string }> = ({ metrics, keyword }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-2xl font-bold text-white font-heading">
            Analysis for <span className="text-gradient-primary">"{keyword}"</span>
          </h3>
          <p className="text-slate-400 text-sm">Real-time AI valuation based on current YouTube data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        {/* Speedometer - Left Column (Col Span 4 - Compact Width) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden border border-slate-700/50 h-full min-h-[260px]">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-50"></div>
          <div className="scale-100 transform">
            <Speedometer score={metrics.overallScore} size={200} />
          </div>
        </div>

        {/* Metrics Column - Right Column (Col Span 8 - Stacked) */}
        <div className="lg:col-span-8 flex flex-col gap-3 h-full justify-between">
          <MetricCard
            label="Search Volume"
            value={metrics.searchVolume}
            tooltip="Estimated monthly searches for this keyword."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            className="flex-1 py-1.5"
          />

          <MetricCard
            label="Competition"
            value={metrics.competition}
            tooltip="The number of videos competing for this keyword."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            subValue={
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getIndicatorColor('competition', metrics.competition)}`}>
                {metrics.competition} Level
              </span>
            }
            className="flex-1 py-1.5"
          />

          <MetricCard
            label="Keyword Difficulty"
            value={metrics.keywordDifficulty}
            tooltip="How hard it is for a new video to rank (0-100). Lower is easier."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            subValue={
              <div className="w-full bg-slate-700/50 rounded-full h-1 mt-1.5">
                <div
                  className={`h-1 rounded-full ${metrics.keywordDifficulty < 40 ? 'bg-green-500' : metrics.keywordDifficulty < 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${metrics.keywordDifficulty}%` }}
                ></div>
              </div>
            }
            className="flex-1 py-1.5"
          />

          <MetricCard
            label="Search Trend"
            value={metrics.trend}
            tooltip="Is search interest growing or declining?"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
            subValue={
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getIndicatorColor('trend', metrics.trend)}`}>
                {metrics.trend} Interest
              </span>
            }
            className="flex-1 py-1.5"
          />

          <MetricCard
            label="Suggested Format"
            value={metrics.suggestedContentType}
            tooltip="The video format most likely to succeed."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
            className="flex-1 py-1.5 bg-gradient-to-br from-slate-800 to-slate-900"
          />
        </div>
      </div>
    </div>
  );
};

export default KeywordMetrics;
