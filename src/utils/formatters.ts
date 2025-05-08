
/**
 * Format temperature with the appropriate unit
 */
export const formatTemp = (temp: number): string => {
  return `${temp}°C`;
};

/**
 * Format usage percentage with % symbol
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage}%`;
};

/**
 * Format fan speed with RPM unit
 */
export const formatFanSpeed = (speed: number): string => {
  return `${speed} RPM`;
};

/**
 * Determines the color class for temperature values
 */
export const getTemperatureColorClass = (temp: number): string => {
  if (temp < 50) return "text-green-DEFAULT";
  if (temp < 70) return "text-orange-DEFAULT";
  return "text-red-DEFAULT";
};

/**
 * Determines the color class for usage values
 */
export const getUsageColorClass = (usage: number): string => {
  if (usage < 30) return "text-green-DEFAULT";
  if (usage < 70) return "text-orange-DEFAULT";
  return "text-red-DEFAULT";
};

/**
 * Determines the progress bar color class based on value
 */
export const getProgressBarColorClass = (value: number): string => {
  if (value < 30) return "bg-green-DEFAULT";
  if (value < 70) return "bg-orange-DEFAULT";
  return "bg-red-DEFAULT";
};
