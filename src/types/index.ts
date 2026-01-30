export interface RadioInfo {
    frequency: string;
    mode: string;
}

export interface Station {
    id: string;
    callsign: string;
    lat: number;
    lng: number;
    operator?: string;
    equipment?: string;
    status: 'active' | 'inactive' | 'emergency';
    powerSource?: 'battery' | 'main';
    frequency?: string; // @deprecated
    frequencies?: string[]; // @deprecated
    mode?: string; // @deprecated
    radioInfo?: RadioInfo[];
    icon?: string;
    antenna?: string;
    locationName?: string;
    operatingHours?: string;
    customColor?: string;
    notes?: string;
    updatedAt: number;
    createdAt?: number;
    user_id?: string;
    user_email?: string;
}

export type MapMode = 'view' | 'add' | 'edit';
