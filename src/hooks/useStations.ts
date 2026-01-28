import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import type { Station } from '../types';

export const useStations = (session: Session | null, userIdFilter?: string | null) => {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStations = async () => {
        if (!session) {
            setStations([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            let query = supabase
                .from('stations')
                .select('*')
                .order('updated_at', { ascending: false });

            if (userIdFilter) {
                query = query.eq('user_id', userIdFilter);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Map snake_case to camelCase
            const mappedData: Station[] = (data || []).map((s: any) => ({
                ...s,
                updatedAt: s.updated_at,
                createdAt: s.created_at ? new Date(s.created_at).getTime() : undefined,
                powerSource: s.power_source,
                locationName: s.location_name,
                operatingHours: s.operating_hours,
                customColor: s.custom_color,
                radioInfo: s.radio_info,
                icon: s.icon
            }));

            setStations(mappedData);
        } catch (err: any) {
            console.error('Error fetching stations:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
    }, [userIdFilter, session]);

    const addStation = async (station: Omit<Station, 'id' | 'updatedAt'>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const supabaseData = {
                callsign: station.callsign,
                lat: station.lat,
                lng: station.lng,
                operator: station.operator,
                equipment: station.equipment,
                status: station.status,
                power_source: station.powerSource,
                frequency: station.frequency,
                mode: station.mode,
                antenna: station.antenna,
                location_name: station.locationName,
                operating_hours: station.operatingHours,
                custom_color: station.customColor,
                notes: station.notes,
                radio_info: station.radioInfo,
                icon: station.icon,
                updated_at: Date.now(),
                user_id: userIdFilter || user?.id,
                user_email: userIdFilter ? undefined : user?.email // Admin doesn't need to specify email if impersonating, or we could fetch it
            };

            const { data, error } = await supabase
                .from('stations')
                .insert([supabaseData])
                .select()
                .single();

            if (error) throw error;

            // Map back to camelCase
            const newStation: Station = {
                ...data,
                updatedAt: data.updated_at,
                powerSource: data.power_source,
                locationName: data.location_name,
                operating_hours: data.operating_hours,
                customColor: data.custom_color,
                radioInfo: data.radio_info,
                icon: data.icon
            };

            setStations(prev => [newStation, ...prev]);
        } catch (err: any) {
            alert('Error adding station: ' + err.message);
        }
    };

    const updateStation = async (id: string, data: Partial<Station>) => {
        try {
            const supabaseUpdate: any = { ...data, updated_at: Date.now() };

            // Map camelCase to snake_case if they exist in the update
            if (data.updatedAt) supabaseUpdate.updated_at = data.updatedAt;
            if (data.powerSource) supabaseUpdate.power_source = data.powerSource;
            if (data.locationName) supabaseUpdate.location_name = data.locationName;
            if (data.operatingHours) supabaseUpdate.operating_hours = data.operatingHours;
            if (data.customColor) supabaseUpdate.custom_color = data.customColor;
            if (data.radioInfo) supabaseUpdate.radio_info = data.radioInfo;
            if (data.icon) supabaseUpdate.icon = data.icon;

            // Remove camelCase keys that don't exist in DB
            delete supabaseUpdate.locationName;
            delete supabaseUpdate.powerSource;
            delete supabaseUpdate.operatingHours;
            delete supabaseUpdate.customColor;
            delete supabaseUpdate.radioInfo;
            delete supabaseUpdate.updatedAt;

            const { error } = await supabase
                .from('stations')
                .update(supabaseUpdate)
                .eq('id', id);

            if (error) throw error;
            setStations(prev => prev.map(s => s.id === id ? { ...s, ...data, updatedAt: Date.now() } : s));
        } catch (err: any) {
            alert('Error updating station: ' + err.message);
        }
    };

    const removeStation = async (id: string) => {
        try {
            const { error } = await supabase
                .from('stations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setStations(prev => prev.filter(s => s.id !== id));
        } catch (err: any) {
            alert('Error deleting station: ' + err.message);
        }
    };

    const clearStations = async () => {
        if (confirm('Are you sure you want to clear your submitted stations? This cannot be undone.')) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { error } = await supabase
                    .from('stations')
                    .delete()
                    .eq('user_id', user.id);

                if (error) throw error;
                setStations(prev => prev.filter(s => s.user_id !== user.id));
            } catch (err: any) {
                alert('Error clearing stations: ' + err.message);
            }
        }
    };

    const nukeDatabase = async () => {
        if (confirm('⚠️ WARNING: You are about to DELETE ALL STATIONS from ALL USERS. This is permanent. Are you absolutely sure?')) {
            try {
                const { error } = await supabase
                    .from('stations')
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000');

                if (error) throw error;
                setStations([]);
                alert('Database wiped successfully.');
            } catch (err: any) {
                alert('Error nuking database: ' + err.message);
            }
        }
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stations, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "9m2pju_set_stations.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const importData = async (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (Array.isArray(parsed)) {
                const { data: { user } } = await supabase.auth.getUser();
                const cleanData = parsed.map((s: any) => ({
                    callsign: s.callsign,
                    lat: s.lat,
                    lng: s.lng,
                    operator: s.operator,
                    equipment: s.equipment,
                    status: s.status,
                    power_source: s.powerSource || s.power_source,
                    frequency: s.frequency,
                    mode: s.mode,
                    antenna: s.antenna,
                    location_name: s.locationName || s.location_name,
                    operating_hours: s.operatingHours || s.operating_hours,
                    custom_color: s.customColor || s.custom_color,
                    notes: s.notes,
                    radio_info: s.radioInfo || s.radio_info || (s.frequencies ? s.frequencies.map((f: string) => ({ frequency: f, mode: s.mode || '' })) : []),
                    icon: s.icon,
                    updated_at: Date.now(),
                    user_id: userIdFilter || user?.id,
                    user_email: userIdFilter ? undefined : user?.email
                }));

                const { data: _data, error } = await supabase
                    .from('stations')
                    .insert(cleanData)
                    .select();

                if (error) throw error;
                fetchStations(); // Refresh to get the mapped data
                alert('Station data imported successfully!');
            }
        } catch (e: any) {
            alert('Failed to import data: ' + e.message);
        }
    };

    return {
        stations,
        loading,
        error,
        addStation,
        updateStation,
        removeStation,
        clearStations,
        nukeDatabase,
        exportData,
        importData,
        refresh: fetchStations
    };
};
