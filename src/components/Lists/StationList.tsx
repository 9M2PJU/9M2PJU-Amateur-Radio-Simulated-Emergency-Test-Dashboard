import React, { useState } from 'react';
import type { Station } from '../../types';
import { Search, Radio, AlertTriangle, Edit2, Trash2, Filter as LucideFilter } from 'lucide-react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface StationListProps {
    stations: Station[];
    onSelectStation?: (station: Station) => void;
    onEditStation?: (station: Station) => void;
    onDeleteStation?: (id: string) => void;
    className?: string;
    currentUserId?: string;
    isAdmin?: boolean;
}

const StationList: React.FC<StationListProps> = ({
    stations,
    onSelectStation,
    onEditStation,
    onDeleteStation,
    className = '',
    currentUserId,
    isAdmin
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterPower, setFilterPower] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    
    const map = useMap();
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (containerRef.current) {
            L.DomEvent.disableClickPropagation(containerRef.current);
            L.DomEvent.disableScrollPropagation(containerRef.current);
        }
    }, []);


    const filteredStations = stations.filter(s => {
        const matchesSearch = s.callsign.includes(searchTerm.toUpperCase()) ||
            s.operator?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || 
            (filterType === 'repeater' ? s.icon === 'repeater' : 
             filterType === 'user' ? (s.icon === 'user' || !s.icon) : 
             s.icon === filterType);
             
        const matchesPower = filterPower === 'all' || s.powerSource === filterPower;
        
        const matchesStatus = filterStatus === 'all' || s.status === filterStatus;

        return matchesSearch && matchesType && matchesPower && matchesStatus;
    });

    const handleSelect = (station: Station) => {
        map.flyTo([station.lat, station.lng], 14, {
            duration: 1.5
        });
        if (onSelectStation) {
            onSelectStation(station);
        }
    };

    const clearFilters = () => {
        setFilterType('all');
        setFilterPower('all');
        setFilterStatus('all');
        setSearchTerm('');
    };

    const activeFilterCount = (filterType !== 'all' ? 1 : 0) + (filterPower !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

    return (
        <div
            ref={containerRef}
            className={`flex flex-col glass border-r border-white/10 w-80 bg-[#0a0a14] backdrop-blur-xl h-full ${className}`}
        >
            <div className="p-4 border-b border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Radio className="text-blue-400" /> Stations ({stations.length})
                    </h2>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg transition-all ${showFilters || activeFilterCount > 0 ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-slate-400'}`}
                    >
                        <LucideFilter className="h-4 w-4" />
                    </button>
                </div>
                
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

                {showFilters && (
                    <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Type</label>
                                <select 
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="repeater">Repeater</option>
                                    <option value="user">User/Person</option>
                                    <option value="hospital">Hospital</option>
                                    <option value="police">Police</option>
                                    <option value="fire">Fire</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Source</label>
                                <select 
                                    value={filterPower}
                                    onChange={(e) => setFilterPower(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="all">Any Power</option>
                                    <option value="main">Main Power</option>
                                    <option value="battery">Battery</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Status</label>
                                <select 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="all">Any Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="emergency">Emergency</option>
                                </select>
                            </div>
                        </div>
                        
                        {(activeFilterCount > 0 || searchTerm) && (
                            <button 
                                onClick={clearFilters}
                                className="w-full text-xs text-slate-400 hover:text-white py-1 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
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
                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                    <img
                                        src={`/markers/${station.icon || 'user'}.svg?v=${new Date().getDate()}`}
                                        className="h-4 w-4 opacity-70"
                                        alt=""
                                    />
                                    {station.callsign}
                                </div>
                                <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${station.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    station.status === 'emergency' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {station.status}
                                </div>
                            </div>
                            {station.operator && <div className="text-xs text-slate-400 mt-1">{station.operator}</div>}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {(station.radioInfo || (station.frequency ? [{ frequency: station.frequency as string, mode: station.mode || '' }] : [])).map((info: any, idx: number) => (
                                    <span key={idx} className="text-[10px] bg-cyan-900/20 border border-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-200 font-mono">
                                        {info.frequency}MHz {info.mode}
                                    </span>
                                ))}
                            </div>
                            {station.status === 'emergency' && (
                                <div className="flex items-center gap-1 text-red-400 text-xs mt-2 font-semibold">
                                    <AlertTriangle className="h-3 w-3" /> EMERGENCY TRAFFIC
                                </div>
                            )}

                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                                {station.equipment && (
                                    <div className="flex items-center gap-1 text-xs text-blue-200/70">
                                        <span className="font-bold uppercase text-[9px] text-blue-400/50">Rig:</span> {station.equipment}
                                    </div>
                                )}
                                {station.powerSource && (
                                    <div className="flex items-center gap-1 text-xs">
                                        <span className="font-bold uppercase text-[9px] text-slate-500">Pwr:</span>
                                        <span className={`${station.powerSource === 'battery' ? 'text-amber-400' : 'text-cyan-400'} font-medium`}>
                                            {station.powerSource === 'battery' ? '🔋 Batt' : '🔌 Main'}
                                        </span>
                                    </div>
                                )}
                                {station.operatingHours && (
                                    <div className="flex items-center gap-1 text-xs text-emerald-200/70">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500/50"></div>
                                        <span className="font-bold uppercase text-[9px] text-emerald-400/50">Hrs:</span> {station.operatingHours}
                                    </div>
                                )}
                            </div>
                        </div>

                        {(isAdmin || (currentUserId && station.user_id === currentUserId)) && (
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
                        )}
                    </div>
                ))}
                {filteredStations.length === 0 && (
                    <div className="text-center text-slate-500 mt-8 text-sm">
                        No stations found matching filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationList;
