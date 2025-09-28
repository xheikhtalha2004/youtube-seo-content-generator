import React from 'react';
import ResultCard from './ResultCard';

interface RelatedKeywordsProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

const RelatedKeywords: React.FC<RelatedKeywordsProps> = ({ keywords, onKeywordClick }) => {
  return (
    <ResultCard title="Related Keywords" icon={<LightBulbIcon />}>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => onKeywordClick(keyword)}
            className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            {keyword}
          </button>
        ))}
      </div>
    </ResultCard>
  );
};

const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

export default RelatedKeywords;
