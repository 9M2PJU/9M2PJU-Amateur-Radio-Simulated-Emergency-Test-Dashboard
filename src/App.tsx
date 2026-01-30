import { useState, useEffect } from 'react';
import SimulatorMap from './components/Map/SimulatorMap';
import { useStations } from './hooks/useStations';
import { useWeather } from './hooks/useWeather';
import { useAutoLogout } from './hooks/useAutoLogout';
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
import Toast from './components/Widgets/Toast';
import { getMaidenheadLocator } from './utils/maidenhead';
import { exportStationsToPDF } from './utils/pdfExport';
import type { Session } from '@supabase/supabase-js';

// Cache busting version
const ASSET_VERSION = new Date().getTime();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);
  const { stations, loading: stationsLoading, addStation, updateStation, removeStation, exportData, importData, clearStations, nukeDatabase } = useStations(session, impersonatedUserId);
  const weatherState = useWeather();

  // Initialize Auto Logout
  useAutoLogout();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [draftStationData, setDraftStationData] = useState<any>({});
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string, type?: 'info' | 'donation' } | null>(null);
  const [donationCheckComplete, setDonationCheckComplete] = useState(false);

  // Supabase Session Logic
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
      if (!session) {
        sessionStorage.removeItem('hasSeenDonation');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // New Station Notification Logic
  useEffect(() => {
    // Only proceed if we have finished checking/showing the donation popup
    if (!stationsLoading && session && stations.length > 0 && donationCheckComplete) {
      const lastVisit = localStorage.getItem('last_visit_time');
      const now = Date.now();

      if (lastVisit) {
        const lastVisitTime = parseInt(lastVisit);
        // Debug: Log first station's createdAt to verify data
        if (stations.length > 0) {

        }

        const newStations = stations.filter(s => (s.createdAt || 0) > lastVisitTime);

        if (newStations.length > 0) {
          // Join ALL callsigns with commas, no truncation ("and X others")
          const callsigns = newStations.map(s => s.callsign).join(', ');
          const message = `New station${newStations.length > 1 ? 's' : ''}: ${callsigns}`;

          setTimeout(() => {
            setToast({
              message: message,
              type: 'info'
            });
          }, 500); // Shorter delay since we already waited for donation popup
        }
      }

      // Update last visit time
      localStorage.setItem('last_visit_time', now.toString());
    }
  }, [stationsLoading, session, stations.length, donationCheckComplete]); // Dependency on length to trigger only when loaded

  // Periodic Donation Toast
  useEffect(() => {
    const timer = setInterval(() => {
      setToast({
        message: "If you like this app, consider donating by clicking the ❤️ button!",
        type: 'donation'
      });
    }, 600000); // Every 10 minutes

    return () => clearInterval(timer);
  }, []);

  // Donation Popup Logic: Show on every login/session init
  useEffect(() => {
    if (!session) return;

    // Check if user is super admin
    const isSuperAdmin = session.user.email === '9m2pju@hamradio.my';
    if (isSuperAdmin) {
      setDonationCheckComplete(true);
      return;
    }

    const checkException = async () => {
      // Check if user is in exceptions list
      const { data } = await supabase
        .from('donation_exceptions')
        .select('email')
        .eq('email', session.user.email)
        .single();

      if (data) {
        // User is excepted from donation popup
        setDonationCheckComplete(true);
        return;
      }

      // Show popup
      const timer = setTimeout(() => {
        setIsDonationOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    };

    checkException();
  }, [session]);

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



  const isAdmin = session?.user?.email === '9m2pju@hamradio.my';


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
          <div className={`absolute top-20 sm:top-28 left-2 sm:left-4 z-[999] h-[calc(100%-6rem)] sm:h-[calc(100%-8rem)] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
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
                <span className="text-white font-medium">Synchronizing with 9M2PJU Private Cloud...</span>
              </div>
            </div>
          )}
        </SimulatorMap>
      </main>

      {/* Admin FAB - Mobile Only */}
      <div className="absolute bottom-8 right-4 sm:right-6 z-[500] lg:hidden">
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

      {isDonationOpen && session && (
        <DonationModal onClose={() => {
          setIsDonationOpen(false);
          setDonationCheckComplete(true);
        }} />
      )}

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}

      {/* Auth Gate Overlay: High-z-index, clean background */}
      {!session && !authLoading && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-700 overflow-y-auto p-4 sm:p-6">
          <div className="w-full max-w-md my-auto animate-in zoom-in-95 duration-500">
            <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-2xl relative overflow-hidden group">
              {/* Sub-glow */}
              <div className="absolute -inset-10 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/15 transition-colors pointer-events-none" />

              <div className="relative z-10 p-2">
                <div className="flex flex-col items-center mb-6 pt-4">
                  <div className="h-24 sm:h-32 w-auto p-4 sm:p-6 rounded-2xl bg-black/40 border border-white/5 mb-4 sm:mb-6">
                    <img
                      src={`/logo.png?v=${ASSET_VERSION}`}
                      alt="9M2PJU Logo"
                      className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight text-center uppercase">9M2PJU Amateur Radio Simulated Emergency Test Dashboard</h2>
                </div>

                {/* Embed AuthModal directly */}
                <AuthModal onClose={() => { }} isEmbedded={true} />
              </div>
            </div>
            <p className="text-white/20 text-[9px] font-mono tracking-widest uppercase text-center mt-6">9M2PJU SET Dashboard v4.4.0</p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Overlay Filters/Texture for Premium Feel */}
      <div className="absolute inset-0 pointer-events-none z-[50] opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}

export default App;
