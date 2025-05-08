import { toast } from "@/components/ui/use-toast";
import { HardwareData } from "@/types/hardware";

interface AlertSettings {
  enabled: boolean;
  cpu_temp: number;
  gpu_temp: number;
  ram_usage: number;
  cpu_usage: number;
  gpu_usage: number;
}

// Keep track of which alerts have been triggered recently to avoid spamming
const recentAlerts: Record<string, number> = {};

export const checkAlerts = (data: HardwareData, alertSettings: AlertSettings) => {
  if (!alertSettings.enabled) return;
  
  const now = Date.now();
  
  // Check CPU temperature
  if (typeof data.cpu_temp === 'number' && data.cpu_temp >= alertSettings.cpu_temp) {
    // Only show alert if not shown in the last 60 seconds
    if (!recentAlerts.cpu_temp || now - recentAlerts.cpu_temp > 60000) {
      toast({
        title: "⚠️ Allarme temperatura CPU",
        description: `La temperatura della CPU ha raggiunto ${data.cpu_temp}°C (soglia: ${alertSettings.cpu_temp}°C)`,
        variant: "destructive"
      });
      recentAlerts.cpu_temp = now;
    }
  }
  
  // Check GPU temperature
  if (typeof data.gpu_temp === 'number' && data.gpu_temp >= alertSettings.gpu_temp) {
    if (!recentAlerts.gpu_temp || now - recentAlerts.gpu_temp > 60000) {
      toast({
        title: "⚠️ Allarme temperatura GPU",
        description: `La temperatura della GPU ha raggiunto ${data.gpu_temp}°C (soglia: ${alertSettings.gpu_temp}°C)`,
        variant: "destructive"
      });
      recentAlerts.gpu_temp = now;
    }
  }
  
  // Check CPU usage
  if (typeof data.cpu_usage === 'number' && data.cpu_usage >= alertSettings.cpu_usage) {
    if (!recentAlerts.cpu_usage || now - recentAlerts.cpu_usage > 60000) {
      toast({
        title: "⚠️ Allarme utilizzo CPU",
        description: `L'utilizzo della CPU ha raggiunto ${data.cpu_usage}% (soglia: ${alertSettings.cpu_usage}%)`,
        variant: "destructive"
      });
      recentAlerts.cpu_usage = now;
    }
  }
  
  // Check GPU usage
  if (typeof data.gpu_usage === 'number' && data.gpu_usage >= alertSettings.gpu_usage) {
    if (!recentAlerts.gpu_usage || now - recentAlerts.gpu_usage > 60000) {
      toast({
        title: "⚠️ Allarme utilizzo GPU",
        description: `L'utilizzo della GPU ha raggiunto ${data.gpu_usage}% (soglia: ${alertSettings.gpu_usage}%)`,
        variant: "destructive"
      });
      recentAlerts.gpu_usage = now;
    }
  }
  
  // Check RAM usage (handling both string and number formats)
  if (typeof data.ram_usage === 'number' && data.ram_usage >= alertSettings.ram_usage) {
    if (!recentAlerts.ram_usage || now - recentAlerts.ram_usage > 60000) {
      toast({
        title: "⚠️ Allarme utilizzo RAM",
        description: `L'utilizzo della RAM ha raggiunto ${data.ram_usage}% (soglia: ${alertSettings.ram_usage}%)`,
        variant: "destructive"
      });
      recentAlerts.ram_usage = now;
    }
  }
};
