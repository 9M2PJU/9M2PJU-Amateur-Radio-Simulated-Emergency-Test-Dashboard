import { useState, useEffect } from 'react';
import type { Station } from '../types';

const STORAGE_KEY = 'set-dashboard-stations';

export const useStations = () => {
    const [stations, setStations] = useState<Station[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
    }, [stations]);

    const addStation = (station: Omit<Station, 'id' | 'updatedAt'>) => {
        const newStation: Station = {
            ...station,
            id: crypto.randomUUID(),
            updatedAt: Date.now(),
        };
        setStations(prev => [...prev, newStation]);
    };

    const updateStation = (id: string, data: Partial<Station>) => {
        setStations(prev => prev.map(s => s.id === id ? { ...s, ...data, updatedAt: Date.now() } : s));
    };

    const removeStation = (id: string) => {
        setStations(prev => prev.filter(s => s.id !== id));
    };

    const clearStations = () => {
        if (confirm('Are you sure you want to clear all local station data?')) {
            setStations([]);
        }
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stations, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "9m2pju_set_stations.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const importData = (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (Array.isArray(parsed)) {
                // Basic validation could go here
                setStations(parsed);
                alert('Station data imported successfully!');
            }
        } catch (e) {
            alert('Failed to parse JSON data');
        }
    };

    return {
        stations,
        addStation,
        updateStation,
        removeStation,
        clearStations,
        exportData,
        importData
    };
};
