
import { useState, useEffect } from "react";
import { HardwareData } from "../types/hardware";

export const useDemoData = (refreshRate: number) => {
  const [data, setData] = useState<HardwareData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Helper per generare numeri casuali entro un intervallo
  const randomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Helper per simulare variazioni realistiche nei dati
  const getNextValue = (current: number, target: number, maxDelta: number): number => {
    if (Math.abs(current - target) < maxDelta) {
      // Se siamo vicini al target, generiamo un nuovo target
      return randomInRange(Math.max(0, current - 5), current + 5);
    }
    
    // Altrimenti ci muoviamo verso il target
    const delta = Math.random() * maxDelta;
    return current + (target > current ? delta : -delta);
  };

  useEffect(() => {
    // Inizializzazione dei valori base
    let cpuTemp = randomInRange(40, 65);
    let gpuTemp = randomInRange(55, 75);
    let cpuUsage = randomInRange(10, 70);
    let gpuUsage = randomInRange(5, 90);
    let fanSpeed = randomInRange(1000, 2500);
    
    // Target per simulare fluttuazioni
    let targetCpuTemp = cpuTemp;
    let targetGpuTemp = gpuTemp;
    let targetCpuUsage = cpuUsage;
    let targetGpuUsage = gpuUsage;
    let targetFanSpeed = fanSpeed;

    // Generiamo dati iniziali
    const initialData: HardwareData = {
      cpu_temp: cpuTemp,
      gpu_temp: gpuTemp,
      ram_usage: `${randomInRange(4, 16)}.${randomInRange(0, 9)} GB`,
      fan_speed: fanSpeed,
      uptime: "2:15:47",
      power_draw: `${randomInRange(80, 250)} W`,
      cpu_usage: cpuUsage,
      gpu_usage: gpuUsage
    };
    
    setData(initialData);

    // Ogni 5 secondi, cambiamo i target dei valori
    const targetInterval = setInterval(() => {
      targetCpuTemp = randomInRange(40, 70); 
      targetGpuTemp = randomInRange(50, 80);
      targetCpuUsage = randomInRange(5, 95);
      targetGpuUsage = randomInRange(5, 95);
      targetFanSpeed = randomInRange(900, 3000);
    }, 5000);

    // Aggiorniamo i valori con la frequenza specificata
    const interval = setInterval(() => {
      // Calcoliamo nuovi valori che tendono verso i target
      cpuTemp = getNextValue(cpuTemp, targetCpuTemp, 1);
      gpuTemp = getNextValue(gpuTemp, targetGpuTemp, 1);
      cpuUsage = getNextValue(cpuUsage, targetCpuUsage, 3);
      gpuUsage = getNextValue(gpuUsage, targetGpuUsage, 4);
      fanSpeed = getNextValue(fanSpeed, targetFanSpeed, 50);

      // Incrementiamo l'uptime di un secondo
      let [hours, minutes, seconds] = data?.uptime.split(':').map(Number) || [2, 15, 47];
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
      const uptimeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // Aggiorniamo i dati
      setData({
        cpu_temp: Math.round(cpuTemp),
        gpu_temp: Math.round(gpuTemp),
        ram_usage: `${randomInRange(4, 16)}.${randomInRange(0, 9)} GB`,
        fan_speed: Math.round(fanSpeed),
        uptime: uptimeString,
        power_draw: `${randomInRange(80, 250)} W`,
        cpu_usage: Math.round(cpuUsage),
        gpu_usage: Math.round(gpuUsage)
      });
      
      setLastUpdated(new Date());
    }, refreshRate);

    return () => {
      clearInterval(interval);
      clearInterval(targetInterval);
    };
  }, [refreshRate]);

  return {
    data,
    isLoading: false,
    isError: false,
    lastUpdated,
    refetch: () => {
      setLastUpdated(new Date());
    }
  };
};
