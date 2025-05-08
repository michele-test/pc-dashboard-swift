
// Hardware data structure received from the server
export interface HardwareData {
  cpu_temp: number;
  gpu_temp: number;
  ram_usage: string | number;
  fan_speed: number;
  uptime: string;
  power_draw: string;
  cpu_usage: number;
  gpu_usage: number;
}

// Application settings
export interface SettingsState {
  serverAddress: string;
  refreshRate: number;
  selectedMetrics: {
    cpu_temp: boolean;
    gpu_temp: boolean;
    ram_usage: boolean;
    fan_speed: boolean;
    uptime: boolean;
    power_draw: boolean;
    cpu_usage: boolean;
    gpu_usage: boolean;
  };
  appearance: {
    theme: 'light' | 'dark';
    accentColor: string;
    customBackground?: string;
  };
  alerts: {
    enabled: boolean;
    cpu_temp: number;
    gpu_temp: number;
    ram_usage: number;
    cpu_usage: number;
    gpu_usage: number;
  };
}
