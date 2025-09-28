
import React from 'react';
import { SeoResult } from '../types';
import ResultCard from './ResultCard';

interface SeoResultDisplayProps {
  result: SeoResult;
}

const SeoResultDisplay: React.FC<SeoResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <ResultCard title="Video Title Ideas" icon={<TitleIcon />}>
        <ul className="space-y-3">
          {result.titles.map((title, index) => (
            <li key={index} className="p-3 bg-slate-800 rounded-md border border-slate-700 text-slate-300">
              {title}
            </li>
          ))}
        </ul>
      </ResultCard>

      <ResultCard title="Video Descriptions" icon={<DescriptionIcon />}>
        <div className="space-y-6">
          {result.descriptions.map((desc, index) => (
            <div key={index} className="p-4 bg-slate-800 rounded-md border border-slate-700 whitespace-pre-wrap text-slate-300">
              {desc}
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Suggested Tags" icon={<TagsIcon />}>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 text-sm font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Script Outline" icon={<ScriptIcon />}>
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="font-semibold text-red-400">Hook</h4>
            <p className="pl-4 mt-1 border-l-2 border-slate-700">{result.scriptOutline.hook}</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-400">Introduction</h4>
            <p className="pl-4 mt-1 border-l-2 border-slate-700">{result.scriptOutline.introduction}</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-400">Main Points</h4>
            <ul className="pl-8 mt-1 list-disc space-y-2">
              {result.scriptOutline.mainPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-400">Call to Action</h4>
            <p className="pl-4 mt-1 border-l-2 border-slate-700">{result.scriptOutline.callToAction}</p>
          </div>
          <div>
            <h4 className="font-semibold text-red-400">Conclusion</h4>
            <p className="pl-4 mt-1 border-l-2 border-slate-700">{result.scriptOutline.conclusion}</p>
          </div>
        </div>
      </ResultCard>
    </div>
  );
};

// SVG Icon Components
const TitleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const DescriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const TagsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v11a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H7z" /></svg>;
const ScriptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;


export default SeoResultDisplay;
