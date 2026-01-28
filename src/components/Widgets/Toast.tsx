import React, { useEffect, useState } from 'react';
import { X, Info, Heart } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error' | 'donation';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'donation': return <Heart className="h-5 w-5 text-pink-500 fill-current animate-pulse" />;
            default: return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'donation': return 'border-pink-500/50 shadow-pink-500/20';
            default: return 'border-blue-500/50 shadow-blue-500/20';
        }
    };

    return (
        <div className={`fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[3000] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/90 backdrop-blur-md border ${getBorderColor()} shadow-lg min-w-[300px] max-w-[90vw]`}>
                {getIcon()}
                <p className="flex-1 text-sm text-white font-medium">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="h-4 w-4 text-slate-400" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
