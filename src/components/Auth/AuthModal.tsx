import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Lock, Mail, Loader2, UserPlus, LogIn, X, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
    onClose: () => void;
    isEmbedded?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, isEmbedded = false }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp && password !== confirmPassword) {
            setError("Passwords don't match");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;

                // After signup, attempt to sign in immediately (works if email confirmation is off)
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;

                onClose();
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className={`w-full max-w-md ${isEmbedded ? '' : 'bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative'}`}>
            {!isEmbedded && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2 z-50"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            <div className={isEmbedded ? '' : 'p-8'}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
                        <Lock className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight text-center">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-white/40 text-sm mt-2 text-center">
                        {isSignUp ? 'Enter your details to start managing stations' : 'Sign in to access your cloud dashboard'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">{isSignUp ? 'Choose Password' : 'Password'}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    {isSignUp && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm py-3 px-4 rounded-xl flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isSignUp ? (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Register & Sign In
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                        }}
                        className="text-white/40 hover:text-blue-400 text-sm font-medium transition-colors"
                    >
                        {isSignUp ? (
                            <span>Already have an account? <span className="text-blue-400 underline decoration-dotted underline-offset-4">Sign in</span></span>
                        ) : (
                            <span>Don't have an account? <span className="text-blue-400 underline decoration-dotted underline-offset-4">Register now</span></span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    if (isEmbedded) return modalContent;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            {modalContent}
        </div>
    );
};

export default AuthModal;
