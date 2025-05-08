
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SettingsState } from "@/types/hardware";
import {
  Save,
  Undo2,
  ServerIcon,
  LayoutGrid,
  Paintbrush,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SettingsPanelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  settings: SettingsState;
  onSaveSettings: (settings: SettingsState) => void;
  isDemoMode?: boolean;
  onToggleDemoMode?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  setOpen,
  settings,
  onSaveSettings,
  isDemoMode = false,
  onToggleDemoMode
}) => {
  const [tempSettings, setTempSettings] = useState<SettingsState>(settings);

  const handleSave = () => {
    onSaveSettings(tempSettings);
    toast({
      title: "Impostazioni salvate",
      description: "Le tue preferenze sono state aggiornate con successo."
    });
    setOpen(false);
  };

  const handleReset = () => {
    setTempSettings(settings);
  };

  const handleMetricToggle = (metric: keyof SettingsState["selectedMetrics"]) => {
    setTempSettings(prev => ({
      ...prev,
      selectedMetrics: {
        ...prev.selectedMetrics,
        [metric]: !prev.selectedMetrics[metric]
      }
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Impostazioni</SheetTitle>
          <SheetDescription>
            Personalizza la tua dashboard di monitoraggio
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="connection" className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="connection" className="flex items-center gap-2">
              <ServerIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Connessione</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Metriche</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4" />
              <span className="hidden sm:inline">Aspetto</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-address">Indirizzo Server</Label>
              <Input 
                id="server-address" 
                placeholder="http://192.168.1.xxx:5000/data" 
                value={tempSettings.serverAddress}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  serverAddress: e.target.value
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Inserisci l'indirizzo completo del server Python
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refresh-rate">
                Frequenza aggiornamento: {tempSettings.refreshRate} ms
              </Label>
              <Slider 
                id="refresh-rate"
                min={500}
                max={5000}
                step={100}
                value={[tempSettings.refreshRate]}
                onValueChange={(values) => setTempSettings(prev => ({
                  ...prev,
                  refreshRate: values[0]
                }))}
              />
              <p className="text-xs text-muted-foreground">
                Una frequenza più alta potrebbe impattare le prestazioni
              </p>
            </div>
            
            {/* Demo Mode Toggle */}
            {onToggleDemoMode && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="mb-1 block">Modalità Demo</Label>
                    <p className="text-xs text-muted-foreground">
                      Visualizza dati simulati senza server
                    </p>
                  </div>
                  <Button 
                    variant={isDemoMode ? "destructive" : "outline"} 
                    onClick={onToggleDemoMode}
                    className="gap-2"
                  >
                    {isDemoMode ? (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        Disattiva
                      </>
                    ) : (
                      <>
                        Attiva
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="space-y-4">
              <Label>Metriche da visualizzare</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cpu-temp" 
                    checked={tempSettings.selectedMetrics.cpu_temp}
                    onCheckedChange={() => handleMetricToggle("cpu_temp")}
                  />
                  <Label htmlFor="cpu-temp">Temperatura CPU</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gpu-temp" 
                    checked={tempSettings.selectedMetrics.gpu_temp}
                    onCheckedChange={() => handleMetricToggle("gpu_temp")}
                  />
                  <Label htmlFor="gpu-temp">Temperatura GPU</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ram-usage" 
                    checked={tempSettings.selectedMetrics.ram_usage}
                    onCheckedChange={() => handleMetricToggle("ram_usage")}
                  />
                  <Label htmlFor="ram-usage">Utilizzo RAM</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fan-speed" 
                    checked={tempSettings.selectedMetrics.fan_speed}
                    onCheckedChange={() => handleMetricToggle("fan_speed")}
                  />
                  <Label htmlFor="fan-speed">Velocità Ventole</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="uptime" 
                    checked={tempSettings.selectedMetrics.uptime}
                    onCheckedChange={() => handleMetricToggle("uptime")}
                  />
                  <Label htmlFor="uptime">Tempo di attività</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="power-draw" 
                    checked={tempSettings.selectedMetrics.power_draw}
                    onCheckedChange={() => handleMetricToggle("power_draw")}
                  />
                  <Label htmlFor="power-draw">Consumo energetico</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cpu-usage" 
                    checked={tempSettings.selectedMetrics.cpu_usage}
                    onCheckedChange={() => handleMetricToggle("cpu_usage")}
                  />
                  <Label htmlFor="cpu-usage">Utilizzo CPU</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gpu-usage" 
                    checked={tempSettings.selectedMetrics.gpu_usage}
                    onCheckedChange={() => handleMetricToggle("gpu_usage")}
                  />
                  <Label htmlFor="gpu-usage">Utilizzo GPU</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="flex gap-2">
                <Button 
                  variant={tempSettings.appearance.theme === 'dark' ? "default" : "outline"}
                  onClick={() => setTempSettings(prev => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      theme: 'dark'
                    }
                  }))}
                  className="flex-1"
                >
                  Scuro
                </Button>
                <Button 
                  variant={tempSettings.appearance.theme === 'light' ? "default" : "outline"}
                  onClick={() => setTempSettings(prev => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      theme: 'light'
                    }
                  }))}
                  className="flex-1"
                >
                  Chiaro
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Colore accento</Label>
              <div className="grid grid-cols-5 gap-2">
                {['#1ABC9C', '#3498DB', '#9B59B6', '#F39C12', '#E74C3C'].map(color => (
                  <div 
                    key={color}
                    className={`h-10 rounded-md cursor-pointer ${
                      tempSettings.appearance.accentColor === color 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTempSettings(prev => ({
                      ...prev,
                      appearance: {
                        ...prev.appearance,
                        accentColor: color
                      }
                    }))}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-bg">Sfondo personalizzato (URL)</Label>
              <Input 
                id="custom-bg" 
                placeholder="URL immagine di sfondo (opzionale)"
                value={tempSettings.appearance.customBackground || ''}
                onChange={(e) => setTempSettings(prev => ({
                  ...prev,
                  appearance: {
                    ...prev.appearance,
                    customBackground: e.target.value || undefined
                  }
                }))}
              />
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <Undo2 className="h-4 w-4" />
              Ripristina
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Salva
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
