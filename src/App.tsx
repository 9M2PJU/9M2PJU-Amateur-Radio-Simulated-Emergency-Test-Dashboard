import { useState, useEffect } from 'react';
import SimulatorMap from './components/Map/SimulatorMap';
import { useStations } from './hooks/useStations';
import { useWeather } from './hooks/useWeather';
// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import { Plus } from 'lucide-react';
import StationForm from './components/Station/StationForm';
import SettingsModal from './components/Station/SettingsModal';
import StationList from './components/Lists/StationList';
import Header from './components/Header';
import Weather from './components/Widgets/Weather';

// Component to bridge Map context available inside SimulatorMap to outside UI
// Note: StationList needs to be INSIDE MapContainer to use useMap(), but our layout separates them.
// We will need to adapt SimulatorMap to accept children or overlays.
// Strategy Check: SimulatorMap default export renders MapContainer. StationList uses useMap.
// StationList must be a child of MapContainer.
// Solution: We will inject StationList as a child of SimulatorMap.

function App() {
  const { stations, addStation, updateStation, removeStation, exportData, importData, clearStations } = useStations();
  const weatherState = useWeather();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [draftStationData, setDraftStationData] = useState<any>({});
  const [editingStationId, setEditingStationId] = useState<string | null>(null);

  const handleEdit = (station: any) => {
    setDraftStationData(station);
    setEditingStationId(station.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this station?')) {
      removeStation(id);
    }
  };

  // Responsive Sidebar Check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-full w-full bg-background overflow-hidden flex flex-col font-sans text-foreground">
      <Header
        adminMode={isSettingsOpen}
        onToggleAdmin={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        weather={weatherState.data?.current}
      />

      <main className="flex-1 relative z-0">
        <SimulatorMap
          stations={stations}
          onMapClick={(lat, lng) => {
            if (isPickingLocation) {
              setDraftStationData((prev: any) => ({ ...prev, lat, lng }));
              setIsPickingLocation(false);
              setIsFormOpen(true);
            }
          }}
          onEditStation={handleEdit}
          onDeleteStation={handleDelete}
          isPickingLocation={isPickingLocation}
        >
          {/* Mobile/Desktop Sidebar injected into Map Context */}
          <div className={`absolute top-28 left-4 z-[999] h-[calc(100%-8rem)] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
            }`}>
            <StationList
              stations={stations}
              onSelectStation={() => {
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              onEditStation={handleEdit}
              onDeleteStation={handleDelete}
              className="rounded-2xl shadow-xl shadow-black/50 overflow-hidden"
            />
          </div>

          {/* Weather Widget */}
          <div className="absolute top-28 right-4 z-[400] hidden lg:block w-80">
            <Weather
              data={weatherState.data}
              loading={weatherState.loading}
              error={weatherState.error}
            />
          </div>

          {/* Location Picker Overlay Hint */}
          {isPickingLocation && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[2000] bg-black/80 text-white px-6 py-3 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.3)] animate-pulse font-bold tracking-wide">
              📍 TAP ANYWHERE ON MAP TO SELECT LOCATION
            </div>
          )}
        </SimulatorMap>
      </main>

      {/* Admin FAB - Moved up to avoid Map Zoom controls overlap */}
      <div className="absolute bottom-24 right-6 z-[500]">
        {!isPickingLocation && (
          <button
            onClick={() => {
              setDraftStationData({});
              setEditingStationId(null);
              setIsFormOpen(true);
            }}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-8 w-8" />
          </button>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg">
            <StationForm
              initialData={draftStationData as any}
              onClose={() => {
                setIsFormOpen(false);
                setEditingStationId(null);
                setDraftStationData({});
              }}
              onPickLocation={(data) => {
                setDraftStationData(data);
                setIsFormOpen(false);
                setIsPickingLocation(true);
              }}
              onSubmit={(data) => {
                if (editingStationId) {
                  updateStation(editingStationId, data);
                } else {
                  addStation(data);
                }
                setIsFormOpen(false);
                setEditingStationId(null);
                setDraftStationData({});
              }}
            />
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onExport={exportData}
          onImport={(data) => {
            importData(data);
            setIsSettingsOpen(false);
          }}
          onClear={() => {
            clearStations();
            setIsSettingsOpen(false);
          }}
        />
      )}

      {/* Overlay Filters/Texture for Premium Feel */}
      <div className="absolute inset-0 pointer-events-none z-[50] opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="scanline"></div>
    </div>
  );
}

export default App;
