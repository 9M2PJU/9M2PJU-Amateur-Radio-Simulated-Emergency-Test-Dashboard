import React, { useState } from 'react';
import { X, Save, Crosshair } from 'lucide-react';
import type { Station } from '../../types';

interface StationFormProps {
    onClose: () => void;
    onSubmit: (data: Omit<Station, 'id' | 'updatedAt'>) => void;
    initialData?: Station;
    onPickLocation?: (data: Omit<Station, 'id' | 'updatedAt'>) => void;
}

const StationForm: React.FC<StationFormProps> = ({ onClose, onSubmit, initialData, onPickLocation }) => {
    const [formData, setFormData] = useState({
        callsign: initialData?.callsign || '',
        lat: initialData?.lat || 3.14,
        lng: initialData?.lng || 101.69,
        operator: initialData?.operator || '',
        equipment: initialData?.equipment || '',
        status: initialData?.status || 'active',
        notes: initialData?.notes || '',
    });

    // Sync formData with initialData changes (e.g. returning from map pick)
    React.useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                lat: initialData.lat,
                lng: initialData.lng,
                // Only update other fields if they are present in initialData (to preserve draft)
                callsign: initialData.callsign || prev.callsign,
                operator: initialData.operator || prev.operator,
                equipment: initialData.equipment || prev.equipment,
                status: initialData.status || prev.status,
                notes: initialData.notes || prev.notes,
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as any);
    };

    return (
        <div className="glass-card p-6 rounded-2xl shadow-2xl border border-white/10 bg-slate-900/90 text-white">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {initialData?.callsign ? 'Edit Station' : 'Add New Station'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="h-5 w-5 text-white/70" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Callsign</label>
                        <input
                            required
                            type="text"
                            value={formData.callsign}
                            onChange={e => setFormData({ ...formData, callsign: e.target.value.toUpperCase() })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                            placeholder="9M2..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Status</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="emergency">EMERGENCY</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                            Location <Crosshair className="h-3 w-3" />
                        </label>
                        <button
                            type="button"
                            onClick={() => onPickLocation && onPickLocation(formData as any)}
                            className="text-xs bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                            <Crosshair className="h-3 w-3" /> Pick on Map
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            required
                            type="number"
                            step="any"
                            value={formData.lat}
                            onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            placeholder="Lat"
                        />
                        <input
                            required
                            type="number"
                            step="any"
                            value={formData.lng}
                            onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            placeholder="Lng"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Operator Info</label>
                    <input
                        type="text"
                        value={formData.operator}
                        onChange={e => setFormData({ ...formData, operator: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Name / Handle"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Equipment / Rig</label>
                    <input
                        type="text"
                        value={formData.equipment}
                        onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Radio, Antenna type..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 transition-all"
                >
                    <Save className="h-5 w-5" />
                    Save Station
                </button>
            </form>
        </div>
    );
};

export default StationForm;
