
import React from 'react';
import { SeoResult } from '../types';
import ResultCard from './ResultCard';

interface SeoResultDisplayProps {
  result: SeoResult;
}

const SeoResultDisplay: React.FC<SeoResultDisplayProps> = ({ result }) => {
  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white font-heading">Generative Content</h3>
          <p className="text-slate-400 text-sm">AI-crafted metadata optimized for high click-through rates.</p>
        </div>
      </div>

      <div className="space-y-6">
        <ResultCard title="Video Title Ideas" icon={<TitleIcon />}>
          <ul className="space-y-3">
            {result.titles.map((title, index) => (
              <li key={index} className="group p-4 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-primary-500/50 transition-all duration-300 cursor-copy">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-slate-200 font-medium leading-snug group-hover:text-white transition-colors">{title}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-xs bg-slate-700 hover:bg-primary-600 text-white px-2 py-1 rounded transition-all">Copy</button>
                </div>
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard title="Video Descriptions" icon={<DescriptionIcon />}>
          <div className="space-y-4">
            {result.descriptions.map((desc, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {desc}
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Suggested Tags" icon={<TagsIcon />}>
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Script Outline" icon={<ScriptIcon />}>
          <div className="relative space-y-6 pl-2 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary-500 before:to-transparent before:opacity-30">
            <div className="relative pl-6">
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
              <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider mb-1">Hook</h4>
              <p className="text-slate-400 text-sm leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-800">{result.scriptOutline.hook}</p>
            </div>

            <div className="relative pl-6">
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider mb-1">Introduction</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{result.scriptOutline.introduction}</p>
            </div>

            <div className="relative pl-6">
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider mb-1">Main Points</h4>
              <ul className="space-y-2 mt-2">
                {result.scriptOutline.mainPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-500 flex-shrink-0"></span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative pl-6">
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider mb-1">CTA & Conclusion</h4>
              <div className="space-y-3">
                <p className="text-slate-400 text-sm leading-relaxed"><span className="text-primary-400 font-semibold">Call to Action:</span> {result.scriptOutline.callToAction}</p>
                <p className="text-slate-400 text-sm leading-relaxed"><span className="text-primary-400 font-semibold">Conclusion:</span> {result.scriptOutline.conclusion}</p>
              </div>
            </div>
          </div>
        </ResultCard>
      </div>
    </div>
  );
};

// SVG Icon Components
const TitleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const DescriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const TagsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v11a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H7z" /></svg>;
const ScriptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;


export default SeoResultDisplay;
