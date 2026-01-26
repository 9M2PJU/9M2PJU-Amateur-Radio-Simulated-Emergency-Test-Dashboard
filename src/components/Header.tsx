import React from 'react';
import { CloudSun, Settings, Menu } from 'lucide-react';
import Clock from './Widgets/Clock';

interface HeaderProps {
    onToggleAdmin: () => void;
    onToggleSidebar: () => void;
    adminMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleAdmin, onToggleSidebar, adminMode }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
            <div className="glass rounded-2xl p-4 flex items-center justify-between pointer-events-auto">
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
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 hidden sm:block">
                            9M2PJU SET Dashboard
                        </h1>
                        <h1 className="text-lg font-bold text-white sm:hidden">
                            SET Dashboard
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-blue-200/80 font-medium tracking-wide">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            LIVE EXERCISE MODE
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-6">
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                        <CloudSun className="text-yellow-400 h-5 w-5" />
                        <div className="text-sm">
                            <div className="font-semibold text-white">32°C</div>
                            <div className="text-xs text-white/50">Partly Cloudy</div>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <Clock />
                    </div>

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
