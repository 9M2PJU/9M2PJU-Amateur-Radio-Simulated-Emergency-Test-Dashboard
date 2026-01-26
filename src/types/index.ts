export interface Station {
    id: string;
    callsign: string;
    lat: number;
    lng: number;
    operator?: string;
    equipment?: string;
    status: 'active' | 'inactive' | 'emergency';
    powerSource?: 'battery' | 'main';
    frequency?: string;
    mode?: string;
    antenna?: string;
    locationName?: string;
    operatingHours?: string;
    customColor?: string;
    notes?: string;
    updatedAt: number;
}

export type MapMode = 'view' | 'add' | 'edit';
