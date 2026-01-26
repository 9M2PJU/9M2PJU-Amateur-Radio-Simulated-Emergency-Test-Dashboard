import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const localTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const utcTime = time.toISOString().slice(11, 19);

    return (
        <div className="flex items-center gap-4 bg-black/20 px-4 py-1.5 rounded-xl border border-white/5 shadow-inner">
            <div className="flex flex-col items-end leading-tight border-r border-white/10 pr-4">
                <div className="text-xl font-bold tracking-widest font-mono text-white">
                    {localTime}
                </div>
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                    LOCAL (MYT)
                </div>
            </div>
            <div className="flex flex-col items-end leading-tight">
                <div className="text-xl font-bold tracking-widest font-mono text-cyan-400">
                    {utcTime}
                </div>
                <div className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest">
                    UTC (ZULU)
                </div>
            </div>
        </div>
    );
};

export default Clock;
