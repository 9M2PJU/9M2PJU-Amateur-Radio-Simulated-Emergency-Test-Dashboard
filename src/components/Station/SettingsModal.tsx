import React from 'react';
import { X } from 'lucide-react';
import DataControls from './DataControls';

interface SettingsModalProps {
    onClose: () => void;
    onExport: () => void;
    onExportPDF?: () => void;
    onImport: (data: string) => void;
    onClear: () => void;
    onNuke?: () => void;
    isAdmin?: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onExport, onExportPDF, onImport, onClear, onNuke, isAdmin }) => {
    return (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="glass-card p-6 rounded-2xl w-full max-w-md bg-slate-900/90 text-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="h-5 w-5 text-white/70" />
                </button>

                <h2 className="text-xl font-bold mb-6">Settings</h2>

                <div className="space-y-6">
                    <DataControls
                        onExport={onExport}
                        onExportPDF={onExportPDF}
                        onImport={onImport}
                        onClear={onClear}
                        onNuke={onNuke}
                        isAdmin={isAdmin}
                    />

                    <div className="text-xs text-white/30 text-center">
                        v4.3.0 • 9M2PJU SET Dashboard
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
