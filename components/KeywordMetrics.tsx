import React from 'react';
import { KeywordMetrics as KeywordMetricsType } from '../types';

interface ScoreMeterProps {
  score: number;
}

const ScoreMeter: React.FC<ScoreMeterProps> = ({ score }) => {
  const size = 160;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  const scoreColorClass = getScoreColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} className="stroke-current text-slate-700" fill="transparent"/>
        <circle cx={center} cy={center} r={radius} strokeWidth={strokeWidth} className={`stroke-current ${scoreColorClass} transition-all duration-1000 ease-out`} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-4xl font-bold ${scoreColorClass}`}>{score}</span>
      </div>
    </div>
  );
};

const MetricInfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => (
    <div className="relative group ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 text-xs text-center text-white bg-slate-900 border border-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{tooltip}</div>
    </div>
);

const getIndicatorClass = (type: 'competition' | 'rankability' | 'trend', value: string) => {
    switch(type) {
        case 'competition':
            if (value === 'Low') return 'bg-green-500/20 text-green-300';
            if (value === 'Medium') return 'bg-yellow-500/20 text-yellow-300';
            if (value === 'High') return 'bg-red-500/20 text-red-300';
            break;
        case 'rankability':
            if (value === 'Excellent' || value === 'Good') return 'bg-green-500/20 text-green-300';
            if (value === 'Fair') return 'bg-yellow-500/20 text-yellow-300';
            if (value === 'Difficult') return 'bg-red-500/20 text-red-300';
            break;
        case 'trend':
            if (value === 'Growing') return 'bg-green-500/20 text-green-300';
            if (value === 'Stable') return 'bg-blue-500/20 text-blue-300';
            if (value === 'Declining') return 'bg-red-500/20 text-red-300';
            break;
    }
    return 'bg-slate-600 text-slate-300';
};

const DifficultyBar: React.FC<{ score: number }> = ({ score }) => {
    const getBarColor = () => {
        if (score <= 33) return 'bg-green-500';
        if (score <= 66) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    return (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`${getBarColor()} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
        </div>
    );
};


const KeywordMetrics: React.FC<{ metrics: KeywordMetricsType; keyword: string }> = ({ metrics, keyword }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-md">
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <h3 className="text-xl font-semibold text-slate-200">Keyword Opportunity: <span className="text-red-400 font-bold">"{keyword}"</span></h3>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center justify-center lg:col-span-1">
            <ScoreMeter score={metrics.overallScore} />
            <p className="mt-3 text-lg font-semibold text-slate-300">Overall Score</p>
            <p className="text-xs text-slate-500">Higher is better</p>
        </div>
        <div className="w-full lg:col-span-2">
            <table className="w-full text-left">
                <tbody className="divide-y divide-slate-700">
                    <tr className="align-middle">
                        <td className="py-3 font-semibold text-slate-400 flex items-center">Search Volume <MetricInfoIcon tooltip="Estimated monthly searches for this keyword." /></td>
                        <td className="py-3 text-right font-bold text-lg text-slate-200">{metrics.searchVolume}</td>
                    </tr>
                    <tr className="align-middle">
                        <td className="py-3 font-semibold text-slate-400 flex items-center">Keyword Difficulty <MetricInfoIcon tooltip="How hard it is for a new video to rank (0-100). Lower is easier." /></td>
                        <td className="py-3 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <span className="font-bold text-lg text-slate-200">{metrics.keywordDifficulty}</span>
                             <div className="w-24"><DifficultyBar score={metrics.keywordDifficulty} /></div>
                           </div>
                        </td>
                    </tr>
                    <tr className="align-middle">
                        <td className="py-3 font-semibold text-slate-400 flex items-center">Competition <MetricInfoIcon tooltip="The number of videos competing for this keyword." /></td>
                        <td className="py-3 text-right"><span className={`px-3 py-1 text-sm font-medium rounded-full ${getIndicatorClass('competition', metrics.competition)}`}>{metrics.competition}</span></td>
                    </tr>
                    <tr className="align-middle">
                        <td className="py-3 font-semibold text-slate-400 flex items-center">Search Trend <MetricInfoIcon tooltip="Is search interest for this keyword growing, stable, or declining?" /></td>
                        <td className="py-3 text-right"><span className={`px-3 py-1 text-sm font-medium rounded-full ${getIndicatorClass('trend', metrics.trend)}`}>{metrics.trend}</span></td>
                    </tr>
                    <tr className="align-middle">
                        <td className="py-3 font-semibold text-slate-400 flex items-center">Suggested Content <MetricInfoIcon tooltip="The video format most likely to succeed for this keyword." /></td>
                        <td className="py-3 text-right font-bold text-lg text-slate-200">{metrics.suggestedContentType}</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default KeywordMetrics;
