import React from 'react';
import { FileJson, FileUp, Trash2, Database } from 'lucide-react';

interface DataControlsProps {
    onExport: () => void;
    onImport: (data: string) => void;
    onClear: () => void;
}

const DataControls: React.FC<DataControlsProps> = ({ onExport, onImport, onClear }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    onImport(event.target.result as string);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="glass-card p-4 rounded-xl text-white space-y-3">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="h-4 w-4" /> Data Management
            </h3>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onExport}
                    className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-lg py-2 text-xs font-semibold transition-all"
                >
                    <FileJson className="h-3 w-3" /> Export
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 rounded-lg py-2 text-xs font-semibold transition-all"
                >
                    <FileUp className="h-3 w-3" /> Import
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileChange}
                />
            </div>
            <button
                onClick={onClear}
                className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 rounded-lg py-2 text-xs font-semibold transition-all"
            >
                <Trash2 className="h-3 w-3" /> Clear All Data
            </button>
        </div>
    );
};

export default DataControls;
