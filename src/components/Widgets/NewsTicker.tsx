import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
}

const NewsTicker: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Using rss2json to convert Google News RSS to JSON for client-side consumption
                // Search query: malaysia disaster news
                const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=malaysia+disaster+news&hl=en-MY&gl=MY&ceid=MY:en');
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
                const data = await response.json();

                if (data.status === 'ok') {
                    setNews(data.items.map((item: any) => ({
                        title: item.title,
                        link: item.link
                    })));
                } else {
                    // Fallback mock data if API limit reached or fails
                    setNews([
                        { title: 'NADMA issues flood warning for East Coast', link: '#' },
                        { title: 'METMalaysia forecasts heavy thunderstorms in Klang Valley', link: '#' },
                        { title: 'Relief centers open as river levels rise in Pahang', link: '#' }
                    ]);
                }
                setNews([
                    { title: 'System Status: Active Monitoring', link: '#' },
                    { title: 'Weather Alert: Check local forecasts', link: '#' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        // Refresh every 15 minutes
        const interval = setInterval(fetchNews, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return null;

    return (
        <div className="w-full bg-black/40 border-t border-b border-cyan-500/20 backdrop-blur-sm overflow-hidden flex items-center h-8">
            <div className="bg-rose-600/20 border-r border-rose-500/30 px-3 h-full flex items-center gap-2 z-10">
                <AlertTriangle className="h-3 w-3 text-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider whitespace-nowrap">DISASTER NEWS</span>
            </div>

            <div className="flex-1 overflow-hidden relative group cursor-pointer">
                {/* Marquee Animation */}
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center hover:pause-animation">
                    {[...news, ...news].map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-100/80 hover:text-cyan-400 transition-colors flex items-center gap-2"
                        >
                            <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
                            {item.title}
                        </a>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default NewsTicker;
