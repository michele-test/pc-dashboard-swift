
import { useState } from "react";
import { useHardwareData } from "@/hooks/useHardwareData";
import HardwareCard from "@/components/HardwareCard";
import ConnectionStatus from "@/components/ConnectionStatus";
import SettingsPanel from "@/components/SettingsPanel";
import { Button } from "@/components/ui/button";
import { SettingsState } from "@/types/hardware";
import { formatFanSpeed } from "@/utils/formatters";
import { SettingsIcon, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    serverAddress: "http://192.168.1.100:5000/data", // Default server address
    refreshRate: 1000, // Default refresh rate (1 second)
    selectedMetrics: {
      cpu_temp: true,
      gpu_temp: true,
      ram_usage: true,
      fan_speed: true,
      uptime: true,
      power_draw: true,
      cpu_usage: true,
      gpu_usage: true
    },
    appearance: {
      theme: "dark",
      accentColor: "#1ABC9C"
    }
  });
  
  const { 
    data, 
    isLoading, 
    isError, 
    lastUpdated,
    refetch
  } = useHardwareData({
    serverAddress: settings.serverAddress,
    refreshRate: settings.refreshRate,
    isEnabled: true
  });

  // Function to handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  // Function to save settings
  const handleSaveSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
  };

  // Get the metrics that are selected to be displayed
  const enabledMetrics = Object.entries(settings.selectedMetrics)
    .filter(([_, isEnabled]) => isEnabled)
    .map(([key]) => key);

  // Function to determine grid column layout based on orientation and number of metrics
  const getGridClass = () => {
    // This is a simple implementation - in a real app you might want to use
    // a library like react-responsive or useMediaQuery to detect orientation
    const metricCount = enabledMetrics.length;
    
    // For landscape we want more columns
    return "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
  };

  // Set custom background if specified
  const customStyle = settings.appearance.customBackground 
    ? { backgroundImage: `url(${settings.appearance.customBackground})`, backgroundSize: 'cover' }
    : {};

  return (
    <div 
      className="min-h-screen p-4 pb-20 md:p-6"
      style={customStyle}
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PC Monitor</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ConnectionStatus 
          isConnected={!isError && !!data} 
          serverAddress={settings.serverAddress}
          lastUpdated={lastUpdated}
        />

        {isError ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg card-glass">
            <p className="text-red-DEFAULT text-xl mb-4">
              Impossibile connettersi al server
            </p>
            <p className="text-muted-foreground mb-4 text-center">
              Verifica che il server Python sia in esecuzione all'indirizzo specificato
              e che sia accessibile dalla tua rete.
            </p>
            <Button onClick={handleRefresh}>
              Riprova
            </Button>
          </div>
        ) : !data ? (
          <div className="flex items-center justify-center p-8 rounded-lg card-glass">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                Connessione al server in corso...
              </p>
              <div className="flex justify-center space-x-2">
                <div className="pulse-dot bg-blue-DEFAULT"></div>
                <div className="pulse-dot bg-blue-DEFAULT" style={{ animationDelay: "0.2s" }}></div>
                <div className="pulse-dot bg-blue-DEFAULT" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className={getGridClass()}>
            {settings.selectedMetrics.cpu_temp && (
              <HardwareCard
                title="Temperatura CPU"
                value={data.cpu_temp}
                type="cpu_temp"
              />
            )}
            
            {settings.selectedMetrics.gpu_temp && (
              <HardwareCard
                title="Temperatura GPU"
                value={data.gpu_temp}
                type="gpu_temp"
              />
            )}
            
            {settings.selectedMetrics.cpu_usage && (
              <HardwareCard
                title="Utilizzo CPU"
                value={data.cpu_usage}
                type="cpu_usage"
              />
            )}
            
            {settings.selectedMetrics.gpu_usage && (
              <HardwareCard
                title="Utilizzo GPU"
                value={data.gpu_usage}
                type="gpu_usage"
              />
            )}
            
            {settings.selectedMetrics.ram_usage && (
              <HardwareCard
                title="Utilizzo RAM"
                value={data.ram_usage}
                type="ram_usage"
              />
            )}
            
            {settings.selectedMetrics.fan_speed && (
              <HardwareCard
                title="Velocità Ventole"
                value={formatFanSpeed(data.fan_speed)}
                type="fan_speed"
              />
            )}
            
            {settings.selectedMetrics.power_draw && (
              <HardwareCard
                title="Consumo Energetico"
                value={data.power_draw}
                type="power_draw"
              />
            )}
            
            {settings.selectedMetrics.uptime && (
              <HardwareCard
                title="Tempo di Attività"
                value={data.uptime}
                type="uptime"
              />
            )}
          </div>
        )}
      </div>

      <SettingsPanel 
        open={settingsOpen}
        setOpen={setSettingsOpen}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
};

export default Dashboard;
