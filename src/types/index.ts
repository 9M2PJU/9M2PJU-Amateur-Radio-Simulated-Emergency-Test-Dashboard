export interface Station {
    id: string;
    callsign: string;
    lat: number;
    lng: number;
    operator?: string;
    equipment?: string;
    status: 'active' | 'inactive' | 'emergency';
    notes?: string;
    updatedAt: number;
}

export type MapMode = 'view' | 'add' | 'edit';
