import React, { useState, useEffect } from 'react';
import { Settings, Menu, Heart, LocateFixed, User, LogOut, LogIn, X, Download } from 'lucide-react';
import Clock from './Widgets/Clock';
import NewsTicker from './Widgets/NewsTicker';
import { supabase } from '../utils/supabase';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
    onToggleAdmin: () => void;
    onToggleSidebar: () => void;
    onOpenDonation: () => void;
    onOpenAuth: () => void;
    userEmail?: string;
    isAdmin?: boolean;
    impersonatedUserId?: string | null;
    onImpersonate?: (id: string | null) => void;
    adminMode: boolean;
    coords?: {
        latitude: number;
        longitude: number;
    };
    gridSquare?: string;
    logoUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
    onToggleAdmin,
    onToggleSidebar,
    onOpenDonation,
    onOpenAuth,
    userEmail,
    isAdmin,
    impersonatedUserId,
    onImpersonate,
    adminMode,
    coords,
    gridSquare,
    logoUrl
}) => {
    const [users, setUsers] = useState<{ id: string, email: string }[]>([]);
    const { isInstallable, showInstallPrompt } = usePWAInstall();

    useEffect(() => {
        if (isAdmin) {
            // Note: In a real Supabase setup, you'd need a service role or edge function
            // to list all users. For this demo/SET, we'll fetch unique user_ids from stations.
            const fetchUsers = async () => {
                const { data } = await supabase
                    .from('stations')
                    .select('user_id, user_email')
                    .not('user_id', 'is', null);

                if (data) {
                    const userMap = new Map<string, string>();
                    data.forEach(d => {
                        if (d.user_id && !userMap.has(d.user_id)) {
                            userMap.set(d.user_id, d.user_email || `User ${d.user_id.slice(0, 8)}`);
                        }
                    });
                    setUsers(Array.from(userMap.entries()).map(([id, email]) => ({ id, email })));
                }
            };
            fetchUsers();
        }
    }, [isAdmin]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-[1000] p-2 sm:p-4 pointer-events-none">
            <div className="glass rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between pointer-events-auto">
                {/* Left: Branding */}
                <div className="flex items-center gap-1.5 sm:gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="md:hidden p-2 rounded-lg bg-white/5 active:bg-white/20 text-white transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="h-12 w-12 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center justify-center p-1 overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.2)] shrink-0">
                        <img src={logoUrl || "/logo.png"} alt="9M2PJU Logo" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <h1 className="text-sm sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 whitespace-nowrap truncate">
                            9M2PJU SET Dashboard
                        </h1>
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-blue-200/80 font-medium tracking-wide truncate">
                            <span>Made with ❤️ by</span>
                            <a href="https://hamradio.my" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors underline decoration-dotted">9M2PJU</a>
                        </div>

                        {/* Mobile Admin Control */}
                        {isAdmin && (
                            <div className="xl:hidden flex items-center gap-2 mt-1 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 w-fit">
                                <span className="text-[8px] text-amber-400 font-bold uppercase shrink-0">Admin:</span>
                                <select
                                    value={impersonatedUserId || ''}
                                    onChange={(e) => onImpersonate?.(e.target.value || null)}
                                    className="bg-transparent text-[10px] text-white border-none focus:ring-0 p-0 cursor-pointer font-bold max-w-[80px] truncate"
                                >
                                    <option value="" className="bg-neutral-900">All Units</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id} className="bg-neutral-900">{u.email.split('@')[0]}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center: Admin Impersonation Control (Desktop Only) */}
                {isAdmin && (
                    <div className="hidden xl:flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Super Admin Mode</span>
                            <select
                                value={impersonatedUserId || ''}
                                onChange={(e) => onImpersonate?.(e.target.value || null)}
                                className="bg-transparent text-xs text-white border-none focus:ring-0 p-0 cursor-pointer font-medium"
                            >
                                <option value="" className="bg-neutral-900">View All Stations</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id} className="bg-neutral-900">User: {u.email}</option>
                                ))}
                            </select>
                        </div>
                        {impersonatedUserId && (
                            <button
                                onClick={() => onImpersonate?.(null)}
                                className="p-1 rounded-md bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 transition-colors"
                                title="Clear Impersonation"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}

                {/* Center: News Ticker Area */}
                <div className="hidden md:flex flex-1 mx-4 lg:mx-8 max-w-xl h-10 rounded-xl overflow-hidden border border-white/5 bg-black/20 shadow-inner">
                    <NewsTicker />
                </div>

                {/* Right: Widgets & Settings */}
                <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
                    {coords && (
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-cyan-400">
                                <LocateFixed className="h-5 w-5" />
                            </div>
                            <div className="text-[10px] leading-tight font-mono">
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="text-white/40 font-bold">LAT:</span>
                                    <span className="text-cyan-300/90">{coords.latitude.toFixed(4)}°</span>
                                </div>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="text-white/40 font-bold">LNG:</span>
                                    <span className="text-cyan-300/90">{coords.longitude.toFixed(4)}°</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10 mx-1" />
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Grid Square</span>
                                <span className="text-sm font-bold text-white tracking-widest">{gridSquare}</span>
                            </div>
                        </div>
                    )}

                    <div className="hidden sm:block">
                        <Clock />
                    </div>

                    {/* PWA Install Button */}
                    {isInstallable && (
                        <button
                            onClick={showInstallPrompt}
                            className="flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition-all font-bold text-xs sm:text-sm animate-pulse shrink-0"
                            title="Install App"
                        >
                            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden md:inline">Install App</span>
                        </button>
                    )}

                    {/* Auth Status / Login Button */}
                    {userEmail ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-600/10 border border-blue-500/20 rounded-lg sm:rounded-xl p-0.5 sm:p-1 pr-2 sm:pr-3">
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <div className="hidden xl:flex flex-col">
                                <span className="text-[9px] text-white/40 font-bold uppercase">Authenticated</span>
                                <span className="text-xs text-blue-300 font-medium max-w-[100px] truncate">{userEmail}</span>
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-all font-bold text-xs sm:text-sm"
                        >
                            <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline sm:inline">Sign In</span>
                        </button>
                    )}

                    <button
                        onClick={onOpenDonation}
                        className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all group"
                        title="Support 9M2PJU"
                    >
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-current group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={onToggleAdmin}
                        className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${adminMode
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
