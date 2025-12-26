import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-transparent font-sans flex flex-col">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed z-0"></div>
            <Navbar />
            {/* Pt-16 for navbar height */}
            <main className="flex-grow pt-16 relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
