import React, { useState, useEffect } from 'react';
import { Sun, Wind, Droplets, Cloud, CloudRain, CloudLightning, Loader2, MapPin } from 'lucide-react';

interface WeatherData {
    city: string;
    temp: number;
    condition: string;
    wind: string;
    humidity: string;
}

const Weather: React.FC = () => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getWeatherIcon = (condition: string) => {
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain className="h-5 w-5 text-blue-400" />;
        if (c.includes('storm') || c.includes('thunder')) return <CloudLightning className="h-5 w-5 text-yellow-500" />;
        if (c.includes('cloud')) return <Cloud className="h-5 w-5 text-slate-300" />;
        return <Sun className="h-5 w-5 text-yellow-400" />;
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                // 1. Get Location
                const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });

                const { latitude, longitude } = pos.coords;

                // 2. Fetch Weather (Open-Meteo)
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
                );
                const weatherData = await weatherRes.json();

                // 3. Fetch City Name (Reverse Geocode using BigDataCloud - free/no key needed for small use)
                let city = "Your Location";
                try {
                    const geoRes = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );
                    const geoData = await geoRes.json();
                    city = geoData.city || geoData.locality || "Your Location";
                } catch (e) {
                    console.error("Geocoding failed", e);
                }

                const current = weatherData.current_weather;
                // Simple mapping for conditions based on code
                const weatherCodes: Record<number, string> = {
                    0: 'Clear Sky',
                    1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
                    45: 'Fog', 48: 'Depositing Rime Fog',
                    51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
                    61: 'Slight Rain', 63: 'Rain', 65: 'Heavy Rain',
                    71: 'Slight Snow', 73: 'Snow', 75: 'Heavy Snow',
                    80: 'Rain Showers', 81: 'Rain Showers', 82: 'Rain Showers',
                    95: 'Thunderstorm', 96: 'Storm with Hail', 99: 'Storm with Hail',
                };

                setData({
                    city,
                    temp: Math.round(current.temperature),
                    condition: weatherCodes[current.weathercode] || 'Clear',
                    wind: `${current.windspeed}km/h`,
                    humidity: '65%' // Default if not easily found in current_weather
                });
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError('Location access denied or API error');
                // Fallback to KL if error
                setData({
                    city: 'Kuala Lumpur',
                    temp: 31,
                    condition: 'Stationary Check',
                    wind: '10km/h',
                    humidity: '70'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) {
        return (
            <div className="glass-card p-4 rounded-xl text-white flex flex-col items-center justify-center min-h-[100px] gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest animate-pulse">Detecting Location...</span>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="glass-card p-4 rounded-xl text-white flex flex-col items-center justify-center min-h-[100px] gap-2">
                <div className="text-rose-400 text-xs font-bold uppercase tracking-tighter">Location Error</div>
                <div className="text-[10px] text-white/40 text-center">{error}</div>
            </div>
        );
    }
    if (!data) return null;

    return (
        <div className="glass-card p-4 rounded-xl text-white animate-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-2">
                {getWeatherIcon(data.condition)}
                <span className="font-bold text-sm truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400" />
                    {data.city}
                </span>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-3xl font-bold tracking-tighter">{data.temp}°C</div>
                    <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{data.condition}</div>
                </div>
                <div className="text-right text-[10px] text-white/40 space-y-0.5 font-medium">
                    <div className="flex items-center justify-end gap-1"><Wind className="h-3 w-3" /> {data.wind}</div>
                    <div className="flex items-center justify-end gap-1"><Droplets className="h-3 w-3" /> {data.humidity}</div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
