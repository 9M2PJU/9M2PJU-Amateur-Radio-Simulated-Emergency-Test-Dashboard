import React, { useState } from 'react';
import type { Station } from '../../types';
import { Search, Radio, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { useMap } from 'react-leaflet';

interface StationListProps {
    stations: Station[];
    onSelectStation?: (station: Station) => void;
    onEditStation?: (station: Station) => void;
    onDeleteStation?: (id: string) => void;
    className?: string;
}

const StationList: React.FC<StationListProps> = ({
    stations,
    onSelectStation,
    onEditStation,
    onDeleteStation,
    className = ''
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const map = useMap();

    const filteredStations = stations.filter(s =>
        s.callsign.includes(searchTerm.toUpperCase()) ||
        s.operator?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (station: Station) => {
        map.flyTo([station.lat, station.lng], 14, {
            duration: 1.5
        });
        if (onSelectStation) {
            onSelectStation(station);
        }
    };

    return (
        <div className={`flex flex-col glass border-r border-white/10 w-80 bg-[#0a0a14] backdrop-blur-xl h-full ${className}`}>
            <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Radio className="text-blue-400" /> Stations ({stations.length})
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search callsign..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {filteredStations.map(station => (
                    <div
                        key={station.id}
                        className={`w-full text-left p-3 rounded-xl border border-white/5 bg-slate-800/10 hover:bg-white/5 transition-all group relative overflow-hidden ${station.status === 'emergency' ? 'bg-red-900/10 border-red-500/30' : 'bg-transparent'
                            }`}
                    >
                        <div
                            className="cursor-pointer"
                            onClick={() => handleSelect(station)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {station.callsign}
                                </div>
                                <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${station.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    station.status === 'emergency' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {station.status}
                                </div>
                            </div>
                            {station.operator && <div className="text-xs text-slate-400 mt-1">{station.operator}</div>}
                            {station.status === 'emergency' && (
                                <div className="flex items-center gap-1 text-red-400 text-xs mt-2 font-semibold">
                                    <AlertTriangle className="h-3 w-3" /> EMERGENCY TRAFFIC
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-white/5 transition-opacity group-hover:opacity-100 opacity-100 sm:opacity-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditStation?.(station);
                                }}
                                className="p-1.5 rounded-md hover:bg-blue-500/20 text-blue-400 transition-colors"
                                title="Edit"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteStation?.(station.id);
                                }}
                                className="p-1.5 rounded-md hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {filteredStations.length === 0 && (
                    <div className="text-center text-slate-500 mt-8 text-sm">
                        No stations found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationList;
