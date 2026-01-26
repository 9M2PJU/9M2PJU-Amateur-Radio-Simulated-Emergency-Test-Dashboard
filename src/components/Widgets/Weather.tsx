import React from 'react';
import { Sun, Wind, Droplets, Cloud, CloudRain, CloudLightning, Loader2, MapPin } from 'lucide-react';
import type { WeatherData } from '../../hooks/useWeather';

interface WeatherProps {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
}

const Weather: React.FC<WeatherProps> = ({ data, loading, error }) => {
    const getWeatherIcon = (condition: string, size = 5) => {
        const c = condition.toLowerCase();
        const className = `h-${size} w-${size}`;
        if (c.includes('rain')) return <CloudRain className={`${className} text-blue-400`} />;
        if (c.includes('storm') || c.includes('thunder')) return <CloudLightning className={`${className} text-yellow-500`} />;
        if (c.includes('cloud')) return <Cloud className={`${className} text-slate-300`} />;
        return <Sun className={`${className} text-yellow-400`} />;
    };

    // Helper for weather code mapping in hourly
    const weatherCodes: Record<number, string> = {
        0: 'Clear', 1: 'Clear', 2: 'Cloudy', 3: 'Cloudy',
        45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
        61: 'Rain', 63: 'Rain', 65: 'Rain', 71: 'Snow', 73: 'Snow', 75: 'Snow',
        80: 'Rain', 81: 'Rain', 82: 'Rain', 95: 'Storm', 96: 'Storm', 99: 'Storm',
    };

    if (loading) {
        return (
            <div className="glass-card p-4 rounded-xl text-white flex flex-col items-center justify-center min-h-[140px] gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest animate-pulse">Synchronizing Atmosphere...</span>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="glass-card p-4 rounded-xl text-white flex flex-col items-center justify-center min-h-[140px] gap-2">
                <div className="text-rose-400 text-xs font-bold uppercase tracking-tighter">Telemetry Failure</div>
                <div className="text-[10px] text-white/40 text-center">{error}</div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="glass-card p-4 rounded-xl text-white animate-in zoom-in duration-300 w-full overflow-hidden">
            {/* Current Summary */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {getWeatherIcon(data.current.condition, 4)}
                        <span className="font-bold text-xs truncate flex items-center gap-1 text-cyan-400">
                            <MapPin className="h-3 w-3" />
                            {data.city}
                        </span>
                    </div>
                    <div className="text-3xl font-bold tracking-tighter">{data.current.temp}°C</div>
                    <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{data.current.condition}</div>
                </div>
                <div className="text-right text-[10px] text-white/40 space-y-1 font-medium bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="flex items-center justify-end gap-1.5"><Wind className="h-3 w-3 text-cyan-500" /> {data.current.wind}</div>
                    <div className="flex items-center justify-end gap-1.5"><Droplets className="h-3 w-3 text-blue-500" /> {data.current.humidity}</div>
                </div>
            </div>

            {/* 24-Hour Forecast */}
            <div className="border-t border-white/10 pt-3 mb-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">24-Hour Forecast</div>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {data.hourly.map((item, i) => {
                        const date = new Date(item.time);
                        const hour = date.getHours();
                        const timeStr = hour === 0 ? '00:00' : `${hour}:00`;
                        const condition = weatherCodes[item.code] || 'Clear';

                        return (
                            <div key={i} className="flex flex-col items-center min-w-[45px] py-2 rounded-lg bg-white/5 border border-white/10 transition-colors hover:bg-white/10">
                                <span className="text-[10px] font-bold text-white/40 mb-2">{timeStr}</span>
                                {getWeatherIcon(condition, 4)}
                                <span className="text-xs font-bold mt-2">{item.temp}°</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* HF Propagation Section */}
            <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between items-center mb-3">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">HF Propagation</div>
                    <div className="text-[9px] text-cyan-600 font-medium">via N0NBH</div>
                </div>
                <div className="relative group mb-4">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-black/40 rounded-lg p-1 border border-white/10 overflow-hidden">
                        <img
                            src="https://www.hamqsl.com/solar101pic.php"
                            alt="HF Propagation Status"
                            className="w-full h-auto grayscale transition-all duration-500 hover:grayscale-0 contrast-125 brightness-90"
                            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                            style={{ opacity: 0.1, minHeight: '100px' }}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">MUF Map (Worldwide)</div>
                    <div className="text-[9px] text-blue-600 font-medium tracking-tight">via prop.kc2g.com</div>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-black/40 rounded-lg p-1 border border-white/10 overflow-hidden">
                        <img
                            src="https://prop.kc2g.com/render/muf_3000km_global_v.png"
                            alt="MUF Worldwide Map"
                            className="w-full h-auto grayscale transition-all duration-500 hover:grayscale-0 contrast-125 brightness-90 saturate-[1.2]"
                            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                            style={{ opacity: 0.1, minHeight: '120px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
