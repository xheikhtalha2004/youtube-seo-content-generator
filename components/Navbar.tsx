import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500/20 to-primary-400/20 border border-primary-500/30 group-hover:border-primary-500/50 transition-all shadow-[0_0_15px_rgba(239,68,68,0.15)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-heading font-bold text-xl text-white leading-none tracking-tight">YT<span className="text-primary-500">Gen</span></span>
                        <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">AI SEO Content</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6 bg-slate-800/50 px-6 py-2 rounded-full border border-white/5">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/app"
                            className={`text-sm font-medium transition-colors ${isActive('/app') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Feature
                        </Link>
                        <Link
                            to="/history"
                            className={`text-sm font-medium transition-colors ${isActive('/history') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            History
                        </Link>
                    </div>

                    <Link
                        to="/app"
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all bg-primary-600 rounded-full hover:bg-primary-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95"
                    >
                        Launch App
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
