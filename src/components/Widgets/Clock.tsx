import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-end leading-none">
            <div className="text-2xl font-bold tracking-widest font-mono text-primary">
                {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
        </div>
    );
};

export default Clock;
