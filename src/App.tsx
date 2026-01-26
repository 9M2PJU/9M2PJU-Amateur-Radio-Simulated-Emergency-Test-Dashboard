import { useState, useEffect } from 'react';
import SimulatorMap from './components/Map/SimulatorMap';
import { useStations } from './hooks/useStations';
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
  const { stations, addStation, exportData, importData, clearStations } = useStations();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      />

      <main className="flex-1 relative z-0">
        <SimulatorMap stations={stations}>
          {/* Mobile/Desktop Sidebar injected into Map Context */}
          <div className={`absolute top-24 left-4 z-[999] h-[calc(100%-7rem)] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
            }`}>
            <StationList
              stations={stations}
              onSelectStation={() => {
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className="rounded-2xl shadow-xl shadow-black/50 overflow-hidden"
            />
          </div>

          {/* Weather Widget */}
          <div className="absolute top-24 right-4 z-[400] hidden lg:block w-64">
            <Weather />
          </div>
        </SimulatorMap>
      </main>

      {/* Admin FAB */}
      <div className="absolute bottom-6 right-6 z-[500]">
        <button
          onClick={() => setIsFormOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-8 w-8" />
        </button>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg">
            <StationForm
              onClose={() => setIsFormOpen(false)}
              onSubmit={(data) => {
                addStation(data);
                setIsFormOpen(false);
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
