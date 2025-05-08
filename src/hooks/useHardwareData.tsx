
import { useState, useEffect, useCallback } from "react";
import { HardwareData } from "../types/hardware";
import { toast } from "@/components/ui/use-toast";

interface UseHardwareDataProps {
  serverAddress: string;
  refreshRate: number;
  isEnabled: boolean;
}

export const useHardwareData = ({ 
  serverAddress, 
  refreshRate, 
  isEnabled 
}: UseHardwareDataProps) => {
  const [data, setData] = useState<HardwareData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!isEnabled || !serverAddress) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(serverAddress);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching hardware data:", error);
      setIsError(true);
      toast({
        variant: "destructive",
        title: "Connessione fallita",
        description: "Impossibile connettersi al server. Verifica l'indirizzo e che il server sia attivo.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [serverAddress, isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    // Initial fetch
    fetchData();

    // Set up interval for repeated fetches
    const intervalId = setInterval(fetchData, refreshRate);

    // Clean up interval on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData, refreshRate, isEnabled]);

  return {
    data,
    isLoading,
    isError,
    lastUpdated,
    refetch: fetchData
  };
};
