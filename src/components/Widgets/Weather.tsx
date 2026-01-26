import React from 'react';
import { Sun, Wind, Droplets } from 'lucide-react';

const Weather: React.FC = () => {
    return (
        <div className="glass-card p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                <span className="font-bold">Kuala Lumpur</span>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-3xl font-bold">32°C</div>
                    <div className="text-xs text-white/60">Partly Cloudy</div>
                </div>
                <div className="text-right text-xs text-white/60 space-y-1">
                    <div className="flex items-center justify-end gap-1"><Wind className="h-3 w-3" /> 12km/h</div>
                    <div className="flex items-center justify-end gap-1"><Droplets className="h-3 w-3" /> 65%</div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
