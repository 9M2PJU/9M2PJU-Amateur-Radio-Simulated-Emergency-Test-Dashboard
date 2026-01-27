import React, { useState } from 'react';
import { X, Save, Crosshair, Plus, Car, Home, Tent, Stethoscope, Shield, Flame, User } from 'lucide-react';
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
        powerSource: initialData?.powerSource || 'main',
        radioInfo: initialData?.radioInfo || [],
        icon: initialData?.icon || 'user',
        antenna: initialData?.antenna || '',
        locationName: initialData?.locationName || '',
        operatingHours: initialData?.operatingHours || '',
        customColor: initialData?.customColor || '',
        notes: initialData?.notes || '',
    });

    const colors = [
        { name: 'Default', value: '' },
        { name: 'Cyan', value: '#06b6d4' },
        { name: 'Emerald', value: '#10b981' },
        { name: 'Amber', value: '#f59e0b' },
        { name: 'Rose', value: '#f43f5e' },
        { name: 'Violet', value: '#8b5cf6' },
        { name: 'Orange', value: '#f97316' },
    ];

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
                powerSource: initialData.powerSource || prev.powerSource,
                radioInfo: initialData.radioInfo || prev.radioInfo,
                icon: initialData.icon || prev.icon,
                antenna: initialData.antenna || prev.antenna,
                locationName: initialData.locationName || prev.locationName,
                operatingHours: initialData.operatingHours || prev.operatingHours,
                customColor: initialData.customColor || prev.customColor,
                notes: initialData.notes || prev.notes,
            }));
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData as any);
    };

    return (
        <div className="glass-card p-6 rounded-2xl shadow-2xl border border-white/10 bg-slate-900/90 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Label Color</label>
                    <div className="flex flex-wrap gap-2">
                        {colors.map(c => (
                            <button
                                key={c.name}
                                type="button"
                                onClick={() => setFormData({ ...formData, customColor: c.value })}
                                className={`w-8 h-8 rounded-lg border-2 transition-all ${formData.customColor === c.value ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                style={{ backgroundColor: c.value || '#06b6d4' }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Icon</label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'user', icon: User, label: 'Person' },
                            { id: 'car', icon: Car, label: 'Vehicle' },
                            { id: 'home', icon: Home, label: 'Base' },
                            { id: 'tent', icon: Tent, label: 'Portable' },
                            { id: 'hospital', icon: Stethoscope, label: 'Hospital' },
                            { id: 'police', icon: Shield, label: 'Police' },
                            { id: 'fire', icon: Flame, label: 'Fire' }
                        ].map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon: item.id })}
                                className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 min-w-[60px] ${formData.icon === item.id ? 'border-white bg-white/10' : 'border-transparent bg-black/20 opacity-60 hover:opacity-100'}`}
                                title={item.label}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="text-[9px] uppercase font-bold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Location Name</label>
                    <input
                        type="text"
                        value={formData.locationName}
                        onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. MCMC Cyberjaya / Puncak Alam"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                            Coordinates <Crosshair className="h-3 w-3" />
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Radio Information</label>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                radioInfo: [...(formData.radioInfo || []), { frequency: '', mode: '' }]
                            })}
                            className="text-xs bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                            <Plus className="h-3 w-3" /> Add Freq
                        </button>
                    </div>

                    {(formData.radioInfo || []).map((info: any, index: number) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-start bg-black/20 p-2 rounded-lg border border-white/5">
                            <div className="col-span-6 relative">
                                <input
                                    type="number"
                                    step="any"
                                    value={info.frequency}
                                    onChange={e => {
                                        const newRadioInfo = [...(formData.radioInfo || [])];
                                        newRadioInfo[index] = { ...info, frequency: e.target.value };
                                        setFormData({ ...formData, radioInfo: newRadioInfo });
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-10 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="Freq"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">MHz</span>
                            </div>
                            <div className="col-span-5 relative">
                                <select
                                    value={info.mode}
                                    onChange={e => {
                                        const newRadioInfo = [...(formData.radioInfo || [])];
                                        newRadioInfo[index] = { ...info, mode: e.target.value };
                                        setFormData({ ...formData, radioInfo: newRadioInfo });
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none"
                                >
                                    <option value="">Mode</option>
                                    <option value="FM">FM</option>
                                    <option value="AM">AM</option>
                                    <option value="SSB">SSB</option>
                                    <option value="LSB">LSB</option>
                                    <option value="USB">USB</option>
                                    <option value="CW">CW</option>
                                    <option value="DIGITAL">DIGITAL</option>
                                    <option value="APRS">APRS</option>
                                    <option value="JS8CALL">JS8CALL</option>
                                    <option value="FT8">FT8</option>
                                    <option value="DMR">DMR</option>
                                    <option value="C4FM">C4FM</option>
                                    <option value="D-STAR">D-STAR</option>
                                </select>
                            </div>
                            <div className="col-span-1 flex justify-center pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newRadioInfo = [...(formData.radioInfo || [])].filter((_, i) => i !== index);
                                        setFormData({ ...formData, radioInfo: newRadioInfo });
                                    }}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {(formData.radioInfo || []).length === 0 && (
                        <div className="text-center py-4 border-2 border-dashed border-white/10 rounded-lg text-slate-500 text-sm">
                            No frequency info added
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Operating Hours</label>
                        <input
                            type="text"
                            value={formData.operatingHours}
                            onChange={e => setFormData({ ...formData, operatingHours: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 08:00 - 18:00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Radio / Rig</label>
                        <input
                            type="text"
                            value={formData.equipment}
                            onChange={e => setFormData({ ...formData, equipment: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. IC-7300, FT-891"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Antenna</label>
                        <input
                            type="text"
                            value={formData.antenna}
                            onChange={e => setFormData({ ...formData, antenna: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Dipole, V2000"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Power Source</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="powerSource"
                                value="main"
                                checked={formData.powerSource === 'main'}
                                onChange={e => setFormData({ ...formData, powerSource: e.target.value as any })}
                                className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border border-cyan-500/50 flex items-center justify-center transition-all ${formData.powerSource === 'main' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-transparent'}`}>
                                {formData.powerSource === 'main' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className={`text-sm ${formData.powerSource === 'main' ? 'text-white font-bold' : 'text-slate-400'}`}>Main Power</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="powerSource"
                                value="battery"
                                checked={formData.powerSource === 'battery'}
                                onChange={e => setFormData({ ...formData, powerSource: e.target.value as any })}
                                className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border border-amber-500/50 flex items-center justify-center transition-all ${formData.powerSource === 'battery' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-transparent'}`}>
                                {formData.powerSource === 'battery' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className={`text-sm ${formData.powerSource === 'battery' ? 'text-white font-bold' : 'text-slate-400'}`}>Battery / Solar</span>
                        </label>
                    </div>
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
