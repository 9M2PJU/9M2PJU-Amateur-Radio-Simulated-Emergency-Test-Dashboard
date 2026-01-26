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
                    const statusColor = station.status === 'active' ? '#06b6d4' :
                        station.status === 'emergency' ? '#f87171' : '#94a3b8';

                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `
                            <div class="flex flex-col items-center group">
                                <div class="px-2 py-0.5 rounded shadow-lg border border-white/20 text-[10px] font-bold text-white whitespace-nowrap transition-all group-hover:scale-110" 
                                     style="background-color: ${statusColor}cc; box-shadow: 0 0 10px ${statusColor}44;">
                                    ${station.callsign}
                                </div>
                                <div class="w-1.5 h-1.5 rounded-full mt-0.5 blur-[1px] ${station.status === 'emergency' ? 'animate-pulse' : ''}" 
                                     style="background-color: ${statusColor}"></div>
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
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-lg text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{station.callsign}</h3>
                                    <div className="text-sm text-cyan-100/90 mb-2 flex items-center gap-2">
                                        <span className={`inline-block w-2 h-2 rounded-full ${station.status === 'active' ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' :
                                            station.status === 'emergency' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gray-400'
                                            }`} />
                                        <span className="font-semibold tracking-wider text-cyan-50/90">{station.status.toUpperCase()}</span>
                                    </div>
                                    {station.operator && (
                                        <div className="text-xs text-slate-300 font-medium">
                                            <strong className="text-cyan-400/80 mr-1">Op:</strong> {station.operator}
                                        </div>
                                    )}
                                    {station.equipment && (
                                        <div className="text-xs text-slate-300 font-medium">
                                            <strong className="text-cyan-400/80 mr-1">Eq:</strong> {station.equipment}
                                        </div>
                                    )}
                                    <div className="mt-3 text-[10px] text-slate-400 border-t border-white/10 pt-2 flex justify-between items-center">
                                        <span>Last Update: {new Date(station.updatedAt).toLocaleTimeString()}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditStation?.(station)}
                                                className="p-1.5 hover:bg-cyan-500/20 bg-cyan-500/10 rounded text-cyan-400 transition-colors border border-cyan-500/20"
                                                title="Edit Station"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteStation?.(station.id)}
                                                className="p-1.5 hover:bg-rose-500/20 bg-rose-500/10 rounded text-rose-400 transition-colors border border-rose-500/20"
                                                title="Delete Station"
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
