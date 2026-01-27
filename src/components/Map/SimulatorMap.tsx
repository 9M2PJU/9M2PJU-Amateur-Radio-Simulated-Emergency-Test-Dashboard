import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Edit2, Trash2 } from 'lucide-react';
import type { Station } from '../../types';

// Fix Leaflet's default icon path issues in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface SimulatorMapProps {
    stations: Station[];
    children?: React.ReactNode;
    onMapClick?: (lat: number, lng: number) => void;
    onEditStation?: (station: Station) => void;
    onDeleteStation?: (id: string) => void;
    isPickingLocation?: boolean;
}

const MapEvents: React.FC<{ onMapClick?: (lat: number, lng: number) => void, isPickingLocation?: boolean }> = ({ onMapClick, isPickingLocation }) => {
    useMapEvents({
        click(e) {
            if (isPickingLocation && onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
    return null;
};

const getIconSvg = (name: string) => {
    const icons: Record<string, string> = {
        user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H12c-.7 0-1.3.3-1.8.7-.9.9-2.2 2.3-2.2 2.3s-2.7.6-4.5 1.1C2.7 11 2 11.9 2 12.8v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h2"/><path d="M17 17h2"/>',
        home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
        tent: '<path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/>',
        hospital: '<path d="M12 5v14"/><path d="M5 12h14"/>', // Using Plus/Cross for hospital clarity
        police: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
        fire: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3-1.09.9-2.2 1.9-3.19z"/>'
    };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons['user']}</svg>`;
};

const SimulatorMap: React.FC<SimulatorMapProps> = ({
    stations,
    children,
    onMapClick,
    onEditStation,
    onDeleteStation,
    isPickingLocation
}) => {
    // Center on Malaysia as default (User appears to be 9M2 - Malaysia)
    const defaultCenter: [number, number] = [4.2105, 101.9758];
    const defaultZoom = 6;

    return (
        <div className={`h-full w-full relative outline-none ${isPickingLocation ? 'cursor-crosshair' : ''}`}>
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
                zoomControl={false}
            >
                <MapEvents onMapClick={onMapClick} isPickingLocation={isPickingLocation} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ZoomControl position="bottomright" />

                {/* Removed Cyber Grid for Light Mode */}

                {stations.map(station => {
                    const statusColor = station.customColor || (station.status === 'active' ? '#06b6d4' :
                        station.status === 'emergency' ? '#f87171' : '#94a3b8');

                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `
                            <div class="flex flex-col items-center group">
                                <div class="px-2 py-1 rounded shadow-lg border border-white/20 text-[11px] font-bold text-white whitespace-nowrap transition-all group-hover:scale-110 group-hover:z-[1000] cursor-pointer flex items-center gap-1.5" 
                                     style="background-color: ${statusColor}cc; box-shadow: 0 0 10px ${statusColor}44, inset 0 0 5px rgba(255,255,255,0.2);">
                                    ${getIconSvg(station.icon || 'user')}
                                    ${station.callsign}
                                </div>
                                <div class="w-2 h-2 rounded-full mt-0.5 blur-[1px] ${station.status === 'emergency' ? 'animate-pulse' : ''}" 
                                     style="background-color: ${statusColor}; box-shadow: 0 0 8px ${statusColor};"></div>
                            </div>
                        `,
                        iconSize: [0, 0],
                        iconAnchor: [30, 10],
                    });

                    return (
                        <Marker
                            key={station.id}
                            position={[station.lat, station.lng]}
                            icon={customIcon}
                        >
                            <Popup className="glass-popup">
                                <div className="p-3 min-w-[240px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                    <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{station.callsign}</h3>
                                            {station.locationName && <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">{station.locationName}</span>}
                                        </div>
                                        <div className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${station.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
                                            station.status === 'emergency' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {station.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2.5">
                                        {station.operator && (
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                                                <div className="text-xs">
                                                    <span className="text-white/40 font-bold uppercase text-[9px] block tracking-widest">Operator</span>
                                                    <span className="text-cyan-50 font-medium">{station.operator}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            {(station.radioInfo || (station.frequency ? [{ frequency: station.frequency, mode: station.mode || '' }] : [])).length > 0 && (
                                                <div className="flex items-start gap-2 col-span-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                                    <div className="text-xs w-full">
                                                        <span className="text-white/40 font-bold uppercase text-[9px] block tracking-widest mb-1">Freq / Mode</span>
                                                        <div className="flex flex-col gap-1">
                                                            {(station.radioInfo || (station.frequency ? [{ frequency: station.frequency, mode: station.mode || '' }] : [])).map((info, idx) => (
                                                                <div key={idx} className="flex justify-between items-center bg-purple-500/5 rounded px-1.5 py-0.5 border border-purple-500/10">
                                                                    <span className="text-purple-300 font-mono font-bold border-r border-purple-500/20 pr-2 mr-2">{info.frequency} MHz</span>
                                                                    <span className="text-purple-400 font-bold text-[10px] uppercase">{info.mode}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {station.powerSource && (
                                                <div className="flex items-start gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${station.powerSource === 'battery' ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'bg-cyan-500'}`} />
                                                    <div className="text-xs">
                                                        <span className="text-white/40 font-bold uppercase text-[9px] block tracking-widest">Power</span>
                                                        <span className={station.powerSource === 'battery' ? 'text-amber-400 font-bold' : 'text-cyan-300 font-bold'}>
                                                            {station.powerSource === 'battery' ? '🔋 BATT' : '🔌 MAIN'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {(station.equipment || station.antenna) && (
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                <div className="text-xs">
                                                    <span className="text-white/40 font-bold uppercase text-[9px] block tracking-widest">Rig / Antenna</span>
                                                    <span className="text-blue-100 font-medium leading-relaxed">
                                                        {station.equipment || 'No rig listed'}
                                                        {station.antenna && <span className="block italic text-blue-300/80 text-[10px]">Ant: {station.antenna}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {station.operatingHours && (
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                <div className="text-xs">
                                                    <span className="text-white/40 font-bold uppercase text-[9px] block tracking-widest">Operating Hours</span>
                                                    <span className="text-emerald-300 font-medium italic">{station.operatingHours}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-[9px] text-slate-500 border-t border-white/10 pt-3 flex justify-between items-center bg-black/20 -mx-3 -mb-3 px-3 py-2">
                                        <span className="font-mono uppercase">Telemetry Updated: {new Date(station.updatedAt).toLocaleTimeString()}</span>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditStation?.(station);
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded text-cyan-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteStation?.(station.id);
                                                }}
                                                className="p-1.5 hover:bg-rose-500/20 rounded text-rose-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
                {children}
            </MapContainer>
        </div>
    );
};

export default SimulatorMap;
