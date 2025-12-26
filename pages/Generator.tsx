import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult } from '../types';
import { fetchAnalysisData } from '../services/apiService';
import KeywordInput from '../components/KeywordInput';
import SeoResultDisplay from '../components/SeoResultDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WelcomeScreen from '../components/WelcomeScreen';
import KeywordMetrics from '../components/KeywordMetrics';
import TopVideos from '../components/TopVideos';
import RelatedKeywords from '../components/RelatedKeywords';
import { useLocation } from 'react-router-dom';

const Generator: React.FC = () => {
    const [keyword, setKeyword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const location = useLocation();

    // Check for passed state from history
    useEffect(() => {
        if (location.state && location.state.keyword) {
            setKeyword(location.state.keyword);
            // Optional: Auto-run or just set keyword. Let's auto-run if coming from history.
            handleGenerate(location.state.keyword);
        }
    }, [location.state]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGenerate = useCallback(async (keywordToSearch: string) => {
        if (!keywordToSearch.trim()) {
            setError('Please enter a keyword.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        window.scrollTo(0, 0);

        try {
            const result = await fetchAnalysisData(keywordToSearch);
            setAnalysisResult(result);

            // Save to History (LocalStorage)
            const historyItem = {
                keyword: keywordToSearch,
                date: new Date().toISOString(),
                metrics: result.seoData.metrics // Save overview metrics if possible
            };

            const existingHistory = JSON.parse(localStorage.getItem('yt_seo_history') || '[]');
            // unique add
            const filteredHistory = existingHistory.filter((h: any) => h.keyword !== keywordToSearch);
            const newHistory = [historyItem, ...filteredHistory].slice(0, 50); // Keep last 50
            localStorage.setItem('yt_seo_history', JSON.stringify(newHistory));

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
        handleGenerate(newKeyword);
    }, [handleGenerate]);

    const hasResults = analysisResult;
    const seoResult = analysisResult?.seoData;
    const topVideos = analysisResult?.videoData;

    return (
        <div className="flex flex-col items-center min-h-screen relative overflow-hidden">
            {/* Exact Background Match from Home.tsx */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none opacity-30"></div>

            <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 animate-fade-in w-full max-w-6xl">
                <header className="text-center mb-16 max-w-4xl mx-auto">
                    {/* Exact Hero Text Match from Home.tsx */}
                    <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-8 leading-[1.1] text-white">
                        Transform Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">YouTube Content</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                        Generate viral-ready titles, tags, and scripts in seconds.
                        <span className="text-slate-200 font-medium"> Stop guessing, start ranking.</span>
                    </p>
                </header>

                <div className="max-w-3xl mx-auto mb-20 relative">
                    <div className="relative">
                        <KeywordInput
                            keyword={keyword}
                            setKeyword={setKeyword}
                            onGenerate={() => handleGenerate(keyword)}
                            isLoading={isLoading}
                        />
                        {/* Minimal Helper Text */}
                        <div className="flex items-center justify-center gap-8 mt-6 text-xs text-slate-500 font-medium tracking-wide uppercase">
                            <span>Powered by AI</span>
                            <span>•</span>
                            <span>Real-time Analysis</span>
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                )}

                {error && (
                    <div className="max-w-2xl mx-auto">
                        <ErrorMessage message={error} />
                    </div>
                )}

                {!isLoading && !error && !hasResults && (
                    <div className="max-w-2xl mx-auto">
                        <WelcomeScreen />
                    </div>
                )}

                {hasResults && seoResult && topVideos && (
                    <div className="space-y-8 animate-fade-in w-full">
                        {/* 1. Analysis Section (Speedometer + Metrics) */}
                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.1s' }}>
                            <KeywordMetrics metrics={seoResult.metrics} keyword={keyword} />
                        </section>

                        {/* 2. Keywords & Strategy Section */}
                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.2s' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Related Keywords (Span 4) */}
                                <div className="lg:col-span-4">
                                    <RelatedKeywords keywords={seoResult.relatedKeywords} onKeywordClick={handleRelatedKeywordClick} />
                                </div>
                                {/* Top Videos (Span 8) */}
                                <div className="lg:col-span-8">
                                    <TopVideos videos={topVideos} />
                                </div>
                            </div>
                        </section>

                        {/* 3. Generative Content Section */}
                        <section className="animate-slide-up w-full" style={{ animationDelay: '0.3s' }}>
                            <SeoResultDisplay result={seoResult} />
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Generator;
