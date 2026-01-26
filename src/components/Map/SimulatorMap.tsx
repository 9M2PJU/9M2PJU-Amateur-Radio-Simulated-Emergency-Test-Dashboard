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

                {stations.map(station => (
                    <Marker key={station.id} position={[station.lat, station.lng]}>
                        <Popup className="glass-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg text-slate-900">{station.callsign}</h3>
                                <div className="text-sm text-slate-600 mb-2">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${station.status === 'active' ? 'bg-green-500' :
                                        station.status === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                                        }`} />
                                    {station.status.toUpperCase()}
                                </div>
                                {station.operator && (
                                    <div className="text-xs text-slate-500">
                                        <strong>Op:</strong> {station.operator}
                                    </div>
                                )}
                                {station.equipment && (
                                    <div className="text-xs text-slate-500">
                                        <strong>Eq:</strong> {station.equipment}
                                    </div>
                                )}
                                <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-100 pt-1 flex justify-between items-center">
                                    <span>Last Update: {new Date(station.updatedAt).toLocaleTimeString()}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditStation?.(station)}
                                            className="p-1 hover:bg-blue-50 bg-blue-50/50 rounded text-blue-600 transition-colors"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        <button
                                            onClick={() => onDeleteStation?.(station.id)}
                                            className="p-1 hover:bg-rose-50 bg-rose-50/50 rounded text-rose-600 transition-colors"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {children}
            </MapContainer>
        </div>
    );
};

export default SimulatorMap;
