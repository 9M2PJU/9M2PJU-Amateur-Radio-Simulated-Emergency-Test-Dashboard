import React, { useState, useEffect } from 'react';
import { Settings, Menu, Heart, LocateFixed, User, LogOut, LogIn, X } from 'lucide-react';
import Clock from './Widgets/Clock';
import NewsTicker from './Widgets/NewsTicker';
import { supabase } from '../utils/supabase';

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
                        <img src={logoUrl || "/logo.png"} alt="9M2PJU Logo" className="h-full w-full object-contain" />
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

                {/* Center: Admin Impersonation Control */}
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
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
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

                    {/* Auth Status / Login Button */}
                    {userEmail ? (
                        <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-xl p-1 pr-3">
                            <button
                                onClick={handleSignOut}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                            <div className="hidden lg:flex flex-col">
                                <span className="text-[9px] text-white/40 font-bold uppercase">Authenticated</span>
                                <span className="text-xs text-blue-300 font-medium max-w-[100px] truncate">{userEmail}</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                <User className="h-4 w-4" />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-all font-bold text-sm"
                        >
                            <LogIn className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign In</span>
                        </button>
                    )}

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
