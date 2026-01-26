import React from 'react';
import { X, Heart, ExternalLink } from 'lucide-react';

interface DonationModalProps {
    onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="glass-card p-6 md:p-8 rounded-[2rem] w-full max-w-xl bg-slate-900/90 text-white relative border-2 border-fuchsia-500/50 shadow-[0_0_40px_rgba(217,70,239,0.3)]">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90"
                >
                    <X className="h-6 w-6 text-white/70" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="h-16 w-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30 animate-pulse">
                        <Heart className="h-8 w-8 text-fuchsia-500 fill-fuchsia-500" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-white italic">
                            SUPPORT <span className="text-fuchsia-500">9M2PJU SET</span>
                        </h2>
                        <p className="text-slate-300 leading-relaxed max-w-md mx-auto">
                            Help us cover server maintenance costs and keep this <span className="text-cyan-400 font-bold">SET Dashboard</span> running smoothly for the Malaysian amateur radio community. Every contribution, big or small, makes a difference!
                        </p>
                    </div>

                    <div className="w-full grid md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                                <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest">Donation QR Code</h3>
                                <p className="text-xs text-slate-400">Scan with your banking or e-wallet app to contribute</p>
                            </div>
                            <img
                                src="/donation-qr.png"
                                alt="Donation QR Code"
                                className="w-full aspect-square rounded-2xl border-2 border-white/10 shadow-2xl p-2 bg-white"
                            />
                        </div>

                        <div className="flex flex-col justify-center space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
                                <p className="text-sm italic text-slate-300">
                                    "Thank you for your generous support! 73 de 9M2PJU"
                                </p>
                            </div>

                            <a
                                href="https://hamradio.my"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 transition-all font-bold group"
                            >
                                <span>Learn More</span>
                                <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>

                            <button
                                onClick={onClose}
                                className="w-full px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-slate-400"
                            >
                                Close Dashboard
                            </button>
                        </div>
                    </div>

                    <div className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
                        Malaysia National QR Standard • Secure Payment
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
