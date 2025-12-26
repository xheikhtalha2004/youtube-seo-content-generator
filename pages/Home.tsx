import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full relative py-20 md:py-32 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none opacity-30"></div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md mb-8 animate-fade-in text-slate-300 text-xs font-semibold tracking-wide uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>AI Engine Online v2.4</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight mb-8 leading-[1.1] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Transform Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">YouTube Content</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        Generate viral-ready titles, tags, and scripts in seconds.
                        <span className="text-slate-200 font-medium"> Stop guessing, start ranking.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/app"
                            className="group relative px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Launch Generator
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </Link>
                        <a
                            href="#features"
                            className="px-8 py-4 bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-500 rounded-xl font-semibold text-lg transition-all backdrop-blur-md"
                        >
                            Explore Features
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats/Social Proof */}
            <section className="w-full border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-12 mb-20">
                <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="relative after:content-[''] after:hidden md:after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-[1px] after:bg-white/10">
                        <div className="text-4xl font-bold text-white mb-2 font-heading">10k+</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Videos Optimized
                        </div>
                    </div>
                    <div className="relative after:content-[''] after:hidden md:after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-[1px] after:bg-white/10">
                        <div className="text-4xl font-bold text-white mb-2 font-heading">500+</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Creators
                        </div>
                    </div>
                    <div className="relative after:content-[''] after:hidden md:after:block after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-[1px] after:bg-white/10">
                        <div className="text-4xl font-bold text-white mb-2 font-heading">98%</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Satisfaction
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2 font-heading">24/7</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Uptime
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading text-white">Why Use This Tool?</h2>
                    <p className="text-slate-400 text-lg">Built for creators who want to spend less time worrying about metadata and more time creating content.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<span className="text-4xl">🚀</span>}
                        title="Instant Optimization"
                        shortDescription="Viral-ready metadata in seconds."
                        detailedDescription="Get optimized titles, descriptions, and tags instantly. Our AI analyzes millions of data points to generate metadata that actually ranks."
                    />
                    <FeatureCard
                        icon={<span className="text-4xl">🔍</span>}
                        title="Competitor Analysis"
                        shortDescription="Spy on top-ranking videos."
                        detailedDescription="We deeply analyze the top-ranking videos for your keyword to understand exactly what works for the algorithm and how you can beat them."
                    />
                    <FeatureCard
                        icon={<span className="text-4xl">📈</span>}
                        title="Trend Metrics"
                        shortDescription="Real-time volume & difficulty data."
                        detailedDescription="View live search volume and competition data to target the right low-competition keywords for your specific channel size."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, shortDescription: string, detailedDescription: string }> = ({ icon, title, shortDescription, detailedDescription }) => (
    <div className="group h-[320px] w-full [perspective:1000px]">
        {/* Glow Element */}
        <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 rounded-2xl transition-colors duration-300 pointer-events-none"></div>

        <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-2xl border border-slate-700/50 group-hover:border-primary-500/30">
            {/* Front Face */}
            <div className="absolute inset-0 h-full w-full rounded-2xl bg-slate-900/40 backdrop-blur-sm [backface-visibility:hidden] p-8 flex flex-col items-center justify-center text-center border border-white/5">
                <div className="mb-6 bg-slate-800/50 w-20 h-20 rounded-2xl flex items-center justify-center border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:shadow-primary-500/20">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 font-medium">{shortDescription}</p>

                {/* Subtle Indicator Icon */}
                <div className="absolute bottom-6 right-6 text-slate-600 group-hover:text-primary-400 transition-colors animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 h-full w-full rounded-2xl bg-slate-800/95 [backface-visibility:hidden] [transform:rotateY(180deg)] p-8 flex flex-col items-center justify-center text-center border border-primary-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-slate-300 leading-relaxed text-base">{detailedDescription}</p>
                <div className="mt-8">
                    <Link to="/app" className="inline-flex items-center gap-2 text-primary-400 font-bold text-sm bg-primary-500/10 hover:bg-primary-500/20 px-4 py-2 rounded-full transition-colors cursor-pointer">
                        Try it now <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default Home;
