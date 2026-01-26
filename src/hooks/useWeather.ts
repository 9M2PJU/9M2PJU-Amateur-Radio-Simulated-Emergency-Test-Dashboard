import { useState, useEffect } from 'react';

export interface WeatherData {
    city: string;
    current: {
        temp: number;
        condition: string;
        wind: string;
        humidity: string;
        code: number;
    };
    hourly: Array<{
        time: string;
        temp: number;
        code: number;
    }>;
}

export const useWeather = () => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const fetchWeather = async () => {
        try {
            setLoading(true);
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
            });

            const { latitude, longitude } = pos.coords;

            // Fetch Current + Hourly
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`
            );
            const weatherData = await weatherRes.json();

            // Reverse Geocode
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
            const hourlyData = weatherData.hourly;

            // Get next 24 hours
            const nowIndex = new Date().getHours();
            const next24 = hourlyData.time.slice(nowIndex, nowIndex + 24).map((t: string, i: number) => ({
                time: t,
                temp: Math.round(hourlyData.temperature_2m[nowIndex + i]),
                code: hourlyData.weathercode[nowIndex + i]
            }));

            setData({
                city,
                current: {
                    temp: Math.round(current.temperature),
                    condition: weatherCodes[current.weathercode] || 'Clear',
                    wind: `${current.windspeed}km/h`,
                    humidity: `${hourlyData.relativehumidity_2m[nowIndex]}%`,
                    code: current.weathercode
                },
                hourly: next24
            });
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Location access denied or API error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 30 * 60 * 1000); // 30 mins
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error, refresh: fetchWeather };
};
