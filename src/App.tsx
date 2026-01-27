import { useState, useEffect } from 'react';
import SimulatorMap from './components/Map/SimulatorMap';
import { useStations } from './hooks/useStations';
import { useWeather } from './hooks/useWeather';
import { supabase } from './utils/supabase';
// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import { Plus, LogIn } from 'lucide-react';
import StationForm from './components/Station/StationForm';
import SettingsModal from './components/Station/SettingsModal';
import StationList from './components/Lists/StationList';
import Header from './components/Header';
import Weather from './components/Widgets/Weather';
import DonationModal from './components/Widgets/DonationModal';
import AuthModal from './components/Auth/AuthModal';
import { getMaidenheadLocator } from './utils/maidenhead';
import { exportStationsToPDF } from './utils/pdfExport';
import type { Session } from '@supabase/supabase-js';

// Cache busting version
const ASSET_VERSION = new Date().getTime();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);
  const { stations, loading: stationsLoading, addStation, updateStation, removeStation, exportData, importData, clearStations, nukeDatabase } = useStations(session, impersonatedUserId);
  const weatherState = useWeather();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [draftStationData, setDraftStationData] = useState<any>({});
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Supabase Session Logic
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleEdit = (station: any) => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }
    setDraftStationData(station);
    setEditingStationId(station.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }
    if (confirm('Are you sure you want to delete this station?')) {
      removeStation(id);
    }
  };

  const handleAddClick = () => {
    if (!session) {
      setIsAuthOpen(true);
      return;
    }
    setDraftStationData({});
    setEditingStationId(null);
    setIsFormOpen(true);
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

  // Donation Popup Logic: Show once per session
  useEffect(() => {
    const hasSeenDonation = sessionStorage.getItem('hasSeenDonation');
    if (!hasSeenDonation) {
      const timer = setTimeout(() => {
        setIsDonationOpen(true);
        sessionStorage.setItem('hasSeenDonation', 'true');
      }, 3000); // 3-second delay for a better experience
      return () => clearTimeout(timer);
    }
  }, []);

  const isAdmin = session?.user?.email === '9m2pju@hamradio.my';

  if (!session) {
    return (
      <div className="relative h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Disaster Background Effects */}
        <div className="absolute inset-0 z-0">
          {/* Base pulse */}
          <div className="absolute inset-0 bg-red-950/20 animate-emergency-pulse" />

          {/* Static noise - fixed positioning, no pointer events */}
          <div className="absolute inset-[-100%] z-10 opacity-[0.03] pointer-events-none static-noise-overlay animate-noise-static" />

          {/* Flicker overlay */}
          <div className="absolute inset-0 z-20 bg-black/40 animate-emergency-flicker pointer-events-none" />

          {/* Vignette */}
          <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Crisis Messaging */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 text-center space-y-2 pointer-events-none">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-red-500 font-black tracking-[0.2em] text-sm uppercase">Priority 1 • Emergency Broadcast</h2>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">Main Grid Offline • Backhaul via HF/Satellite</p>
        </div>

        {/* Login Modal Container */}
        <div className="relative z-50 w-full max-w-md px-6">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden group">
            {/* Sub-glow */}
            <div className="absolute -inset-2 bg-red-500/5 blur-2xl group-hover:bg-red-500/10 transition-colors pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-auto px-6 py-4 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center mb-4">
                  <img
                    src={`/logo.png?v=${ASSET_VERSION}`}
                    alt="9M2PJU Logo"
                    className="h-full w-full object-contain filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tighter text-center">SYSTEM OFFLINE</h1>
                <p className="text-cyan-400 font-bold text-[10px] tracking-[0.3em] uppercase mt-1">Authorization Required</p>
              </div>

              <AuthModal onClose={() => { }} />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none">
          <span className="text-white/20 text-[9px] font-mono tracking-tighter uppercase">9M2PJU EMERGENCY TELEMETRY BACKBONE</span>
          <span className="text-white/10 text-[8px] font-mono">v4.2.0-STABLE | KUALA LUMPUR HUB</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-background overflow-hidden flex flex-col font-sans text-foreground">
      <Header
        adminMode={isSettingsOpen}
        onToggleAdmin={() => setIsSettingsOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userEmail={session?.user?.email}
        logoUrl={`/logo.png?v=${ASSET_VERSION}`}
        isAdmin={isAdmin}
        impersonatedUserId={impersonatedUserId}
        onImpersonate={setImpersonatedUserId}
        coords={weatherState.data?.coords}
        gridSquare={weatherState.data?.coords ? getMaidenheadLocator(weatherState.data.coords.latitude, weatherState.data.coords.longitude, 6) : undefined}
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
          currentUserId={session?.user?.id}
          isAdmin={isAdmin}
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
              currentUserId={session?.user?.id}
              isAdmin={isAdmin}
              className="rounded-2xl shadow-xl shadow-black/50 overflow-hidden"
            />
          </div>

          {/* Weather Widget */}
          <div className="absolute top-28 right-4 z-[400] hidden lg:block w-80 space-y-4">
            <Weather
              data={weatherState.data}
              loading={weatherState.loading}
              error={weatherState.error}
            />

            {/* Desktop Add Station Button (Under HF Propagation) */}
            <button
              onClick={() => {
                setDraftStationData({});
                setEditingStationId(null);
                setIsFormOpen(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 border border-white/10"
            >
              <Plus className="h-5 w-5" />
              <span>Add Station</span>
            </button>
          </div>

          {/* Location Picker Overlay Hint */}
          {isPickingLocation && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[2000] bg-black/80 text-white px-6 py-3 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(0,255,255,0.3)] animate-pulse font-bold tracking-wide">
              📍 TAP ANYWHERE ON MAP TO SELECT LOCATION
            </div>
          )}

          {/* Database Loading State */}
          {stationsLoading && (
            <div className="absolute inset-0 z-[1500] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <div className="bg-neutral-900/80 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-white font-medium">Synchronizing with Cloud...</span>
              </div>
            </div>
          )}
        </SimulatorMap>
      </main>

      {/* Admin FAB - Mobile Only */}
      <div className="absolute bottom-24 right-6 z-[500] lg:hidden">
        {!isPickingLocation && (
          <button
            onClick={handleAddClick}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title={session ? "Add Station" : "Sign in to add station"}
          >
            {session ? <Plus className="h-8 w-8" /> : <LogIn className="h-6 w-6" />}
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
          onExportPDF={() => exportStationsToPDF(stations)}
          onNuke={() => {
            nukeDatabase();
            setIsSettingsOpen(false);
          }}
          isAdmin={isAdmin}
        />
      )}

      {isDonationOpen && (
        <DonationModal onClose={() => {
          setIsDonationOpen(false);
          if (!session) {
            setTimeout(() => setIsAuthOpen(true), 300);
          }
        }} />
      )}

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}

      {/* Overlay Filters/Texture for Premium Feel */}
      <div className="absolute inset-0 pointer-events-none z-[50] opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}

export default App;
