import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
    keyword: string;
    date: string;
    metrics?: any;
}

const History: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('yt_seo_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear your history?")) {
            localStorage.removeItem('yt_seo_history');
            setHistory([]);
        }
    };

    const handleSelect = (keyword: string) => {
        navigate('/app', { state: { keyword } });
    };

    return (

        <div className="min-h-screen w-full relative">
            {/* Exact Home Page Background - Fixed to viewport for single seamless surface */}
            <div className="fixed inset-0 bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none -z-10"></div>
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none opacity-30 -z-10"></div>


            <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 animate-fade-in w-full max-w-4xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white tracking-tight">Search History</h1>
                        <p className="text-lg text-slate-400 font-light">View and manage your previously generated keywords.</p>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="px-6 py-2.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all font-medium text-sm backdrop-blur-sm"
                        >
                            Clear History
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-24 px-8 rounded-2xl bg-slate-900/30 border border-slate-800 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl mx-auto flex items-center justify-center mb-6 text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">No History Yet</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                            Your recent searches will appear here. Start generating content to build your history.
                        </p>
                        <button
                            onClick={() => navigate('/app')}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
                        >
                            Go to Generator
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item.keyword)}
                                className="group relative p-6 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between overflow-hidden"
                            >
                                <div className="absolute inset-y-0 left-0 w-1 bg-primary-500/0 group-hover:bg-primary-500 transition-colors duration-300"></div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors mb-2">
                                        {item.keyword}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs md:text-sm text-slate-500 font-medium">
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                        <span>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
