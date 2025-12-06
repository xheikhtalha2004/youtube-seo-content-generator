import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { fetchAnalysisData } from './services/apiService';
import KeywordInput from './components/KeywordInput';
import SeoResultDisplay from './components/SeoResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WelcomeScreen from './components/WelcomeScreen';
import KeywordMetrics from './components/KeywordMetrics';
import TopVideos from './components/TopVideos';
import RelatedKeywords from './components/RelatedKeywords';

const App: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleGenerate = useCallback(async (keywordToSearch: string, model: string) => {
    if (!keywordToSearch.trim()) {
      setError('Please enter a keyword.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    window.scrollTo(0, 0);

    try {
      const result = await fetchAnalysisData(keywordToSearch, model);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleRelatedKeywordClick = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    handleGenerate(newKeyword, 'gemini-2.5-flash');
  }, [handleGenerate]);

  const hasResults = analysisResult;
  const seoResult = analysisResult?.seoData;
  const topVideos = analysisResult?.videoData;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 mb-2">
                YouTube SEO Content Generator
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Generate AI-powered titles, descriptions, tags, and script outlines to boost your video's reach.
            </p>
        </header>

        <div className="max-w-2xl mx-auto mb-10">
          <KeywordInput
            keyword={keyword}
            setKeyword={setKeyword}
            onGenerate={(model) => handleGenerate(keyword, model)}
            isLoading={isLoading}
          />
        </div>

        <div className="max-w-5xl mx-auto">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && !hasResults && <WelcomeScreen />}
          {hasResults && seoResult && topVideos && (
            <div className="space-y-8 animate-fade-in">
              <KeywordMetrics metrics={seoResult.metrics} keyword={keyword} />
              <TopVideos videos={topVideos} />
              <RelatedKeywords keywords={seoResult.relatedKeywords} onKeywordClick={handleRelatedKeywordClick} />
              <SeoResultDisplay result={seoResult} />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by a Local Python Server (Gemini API & Playwright)</p>
      </footer>
    </div>
  );
};

export default App;
