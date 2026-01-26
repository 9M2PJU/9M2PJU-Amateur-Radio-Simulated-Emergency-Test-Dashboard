import React from 'react';
import { Settings, Menu, Heart } from 'lucide-react';
import Clock from './Widgets/Clock';
import NewsTicker from './Widgets/NewsTicker';

interface HeaderProps {
    onToggleAdmin: () => void;
    onToggleSidebar: () => void;
    onOpenDonation: () => void;
    adminMode: boolean;
    weather?: {
        temp: number;
        condition: string;
        code: number;
    } | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleAdmin, onToggleSidebar, onOpenDonation, adminMode, weather }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
            <div className="glass rounded-2xl p-4 flex items-center justify-between pointer-events-auto">
                {/* Left: Branding */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 rounded-lg bg-white/5 active:bg-white/20 text-white transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="h-12 w-12 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center justify-center p-1 overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                        <img src="/logo.png" alt="9M2PJU Logo" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center min-w-fit">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 hidden sm:block">
                            9M2PJU SET Dashboard
                        </h1>
                        <h1 className="text-sm font-bold text-white sm:hidden whitespace-nowrap">
                            9M2PJU SET Dashboard
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-blue-200/80 font-medium tracking-wide">
                            Made with ❤️ by <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors underline decoration-dotted">9M2PJU</a>
                        </div>
                    </div>
                </div>

                {/* Center: News Ticker Area (Free Space as requested) */}
                <div className="hidden md:flex flex-1 mx-4 lg:mx-8 max-w-xl h-10 rounded-xl overflow-hidden border border-white/5 bg-black/20 shadow-inner">
                    <NewsTicker />
                </div>

                {/* Right: Widgets & Settings */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {weather && (
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-yellow-400">
                                {weather.temp > 30 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-sun"><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" /></svg>
                                )}
                            </div>
                            <div className="text-sm">
                                <div className="font-semibold text-white">{weather.temp}°C</div>
                                <div className="text-[10px] text-white/50 uppercase tracking-tighter">{weather.condition}</div>
                            </div>
                        </div>
                    )}

                    <div className="hidden sm:block">
                        <Clock />
                    </div>

                    <button
                        onClick={onOpenDonation}
                        className="p-3 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all group"
                        title="Support 9M2PJU"
                    >
                        <Heart className="h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={onToggleAdmin}
                        className={`p-3 rounded-xl transition-all duration-300 ${adminMode
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
