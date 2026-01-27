
import React from 'react';
import { AlertCircle } from 'lucide-react';

const NewsTicker: React.FC = () => {
    const newsItems = [
        "Ribut burukkan penderitaan pelarian Gaza",
        "Chile wildfires leave 19 dead amid extreme heat as scores evacuated",
        "Thailand uji sistem amaran kecemasan bergerak seluruh negara tingkat respons bencana",
        "Tiga terperangkap di lombong tua Jawa Barat, operasi SAR dilancarkan",
        "QuickCheck: Is Earth being hit by the largest solar storm in 20 years today?"
    ];

    return (
        <div className="bg-red-900/40 border-y border-red-500/20 py-2 relative overflow-hidden flex items-center">
            <div className="bg-red-900/90 absolute left-0 z-10 px-3 py-1 flex items-center gap-2 h-full shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
                <AlertCircle className="h-4 w-4 text-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-100 uppercase tracking-wider whitespace-nowrap">Breaking News</span>
            </div>
            <div className="flex gap-8 animate-marquee whitespace-nowrap pl-[140px]">
                {newsItems.map((item, i) => (
                    <span key={i} className="text-sm text-red-100/90 flex items-center gap-4">
                        {item}
                        <span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" />
                    </span>
                ))}
                {/* Duplicate for smooth loop */}
                {newsItems.map((item, i) => (
                    <span key={`dup-${i}`} className="text-sm text-red-100/90 flex items-center gap-4">
                        {item}
                        <span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" />
                    </span>
                ))}
            </div>
        </div>
    );
};

export default NewsTicker;

// Add this to your index.css or relevant CSS file
// @keyframes marquee {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }
// .animate-marquee {
//   animation: marquee 40s linear infinite;
// }
