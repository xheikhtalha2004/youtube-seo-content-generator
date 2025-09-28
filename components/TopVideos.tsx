import React from 'react';
import { TopVideo } from '../types';
import ResultCard from './ResultCard';

interface TopVideosProps {
  videos: TopVideo[];
}

const TopVideos: React.FC<TopVideosProps> = ({ videos }) => {
  return (
    <ResultCard title="Top Ranking Videos (Live Data)" icon={<ChartBarIcon />}>
      <div className="space-y-4">
        {videos.map((video, index) => (
          <a
            key={index}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700/50 hover:border-red-500/50 transition-all duration-200"
          >
            <p className="font-semibold text-slate-200 truncate mb-1">{video.title}</p>
            <p className="text-sm text-slate-400 mb-2">by {video.channelName}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                    <EyeIcon />
                    <span>{video.views}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ClockIcon />
                    <span>{video.publishDate}</span>
                </div>
            </div>
          </a>
        ))}
      </div>
       <p className="text-xs text-slate-500 mt-4 italic">
        This data is fetched in real-time by scraping YouTube search results.
      </p>
    </ResultCard>
  );
};

// SVG Icon Components
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default TopVideos;