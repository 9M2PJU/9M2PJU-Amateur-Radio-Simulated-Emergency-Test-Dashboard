import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
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
}

const SimulatorMap: React.FC<SimulatorMapProps> = ({ stations, children }) => {
    // Center on Malaysia as default (User appears to be 9M2 - Malaysia)
    const defaultCenter: [number, number] = [4.2105, 101.9758];
    const defaultZoom = 6;

    return (
        <div className="h-full w-full relative outline-none">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
                zoomControl={false}
            >
                {/* Dark Matter Tiles for "Premium" feel */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <ZoomControl position="bottomright" />

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
                                <div className="mt-2 text-[10px] text-slate-400">
                                    Last Update: {new Date(station.updatedAt).toLocaleTimeString()}
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
