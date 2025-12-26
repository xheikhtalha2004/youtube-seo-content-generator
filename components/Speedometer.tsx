import React from 'react';

interface SpeedometerProps {
    score: number;
    size?: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ score, size = 250 }) => {
    const radius = size / 2;
    const strokeWidth = size * 0.1; // Dynamic stroke width
    const center = size / 2;

    // Calculate needle rotation (0 to 180 degrees)
    // 0 score = -90deg (left)
    // 100 score = 90deg (right)
    const rotation = (score / 100) * 180 - 90;

    // Ticks generation
    const ticks = [];
    const totalTicks = 11; // 0, 10, ... 100
    for (let i = 0; i < totalTicks; i++) {
        const angle = (i / (totalTicks - 1)) * 180;
        const isMajor = i % 5 === 0; // 0, 50, 100
        ticks.push({
            angle: angle,
            isMajor: isMajor,
            label: i * 10
        });
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            <div
                className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-md"
                style={{ width: size, height: size / 1.8, borderBottom: 'none', borderRadius: `${size}px ${size}px 0 0` }}
            >
                {/* Gauge Arc Background */}
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: `${size}px ${size}px 0 0` }}>
                    <div
                        className="absolute w-full h-full opacity-20"
                        style={{
                            background: 'conic-gradient(from 270deg at 50% 100%, #ef4444 0deg, #eab308 90deg, #22c55e 180deg)',
                        }}
                    ></div>
                </div>

                {/* Ticks */}
                {ticks.map((tick, i) => (
                    <div
                        key={i}
                        className={`absolute bottom-0 left-1/2 origin-bottom`}
                        style={{
                            height: tick.isMajor ? '90%' : '85%',
                            width: '2px',
                            transform: `translateX(-50%) rotate(${tick.angle - 90}deg)`,
                        }}
                    >
                        <div
                            className={`w-full ${tick.isMajor ? 'bg-slate-400 h-3' : 'bg-slate-600 h-2'}`}
                        ></div>
                        {tick.isMajor && (
                            <span
                                className="absolute top-4 left-1/2 -translate-x-1/2 -rotate-[0deg] text-xs font-bold text-slate-500"
                                style={{ transform: `translateX(-50%) rotate(${-(tick.angle - 90)}deg)` }}
                            >
                                {tick.label}
                            </span>
                        )}
                    </div>
                ))}

                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                    style={{
                        height: '85%',
                        width: '4px',
                        transform: `translateX(-50%) rotate(${rotation}deg)`,
                    }}
                >
                    <div className="w-full h-full bg-gradient-to-t from-transparent via-red-500 to-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                </div>

                {/* Center Knop */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-900 shadow-lg z-10"></div>
            </div>

            {/* Digital Score */}
            <div className="mt-4 text-center">
                <div className="text-5xl font-black font-heading tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
                    {score}
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-1">Optimization Score</div>
            </div>
        </div>
    );
};

export default Speedometer;
