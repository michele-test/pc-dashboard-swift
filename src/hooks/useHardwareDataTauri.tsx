
import { useState, useEffect } from "react";
import { HardwareData } from "@/types/hardware";
import { invoke } from "@tauri-apps/api/tauri";

interface UseHardwareDataTauriProps {
  refreshRate: number;
  isEnabled: boolean;
}

export const useHardwareDataTauri = ({
  refreshRate,
  isEnabled = true,
}: UseHardwareDataTauriProps) => {
  const [data, setData] = useState<HardwareData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Invoke the Rust command to get hardware data
      const hardwareData = await invoke<HardwareData>("get_hardware_data");
      setData(hardwareData);
      setLastUpdated(new Date());
      setIsError(false);
    } catch (error) {
      console.error("Error fetching hardware data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refetch function for refresh button
  const refetch = () => {
    if (isEnabled) {
      fetchData();
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    // Fetch data immediately
    fetchData();

    // Set up interval for refreshing data
    const intervalId = setInterval(fetchData, refreshRate);

    // Clean up interval on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshRate, isEnabled]);

  return {
    data,
    isLoading,
    isError,
    lastUpdated,
    refetch,
  };
};
