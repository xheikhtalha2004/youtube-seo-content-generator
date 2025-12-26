
import React from 'react';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="text-center p-8 md:p-12 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
        <div className="flex justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        </div>
      <h2 className="text-2xl font-bold text-slate-200 mb-2">Ready to Optimize?</h2>
      <p className="text-slate-400 max-w-xl mx-auto">
        Enter a keyword or topic for your next YouTube video in the box above and click "Generate" to get started. We'll provide you with SEO-friendly titles, descriptions, tags, and a complete script outline.
      </p>
    </div>
  );
};

export default WelcomeScreen;
