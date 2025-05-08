
import React from "react";
import { 
  Cpu, 
  Thermometer, 
  Fan, 
  BarChart3, 
  Clock, 
  Zap,
  Gauge,
  MemoryStick,
  BellRing
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  formatTemp, 
  formatPercentage, 
  getTemperatureColorClass,
  getUsageColorClass,
  getProgressBarColorClass
} from "@/utils/formatters";

interface HardwareCardProps {
  title: string;
  value: string | number;
  type: "cpu_temp" | "gpu_temp" | "ram_usage" | "fan_speed" | "uptime" | "power_draw" | "cpu_usage" | "gpu_usage";
  className?: string;
  isAlert?: boolean;
  alertThreshold?: number;
}

const HardwareCard: React.FC<HardwareCardProps> = ({ 
  title, 
  value, 
  type,
  className,
  isAlert = false,
  alertThreshold
}) => {
  // Determine if we need a progress bar
  const showProgress = ["cpu_usage", "gpu_usage"].includes(type);
  
  // Value for the progress bar (if applicable)
  const progressValue = typeof value === "number" ? value : 0;
  
  // Format the value if it's a number based on the metric type
  const formattedValue = typeof value === "number" ? 
    (type.includes("temp") ? formatTemp(value) : 
     type.includes("usage") ? formatPercentage(value) : 
     value.toString()) : value;

  // Get appropriate color class for the value
  const valueColorClass = type.includes("temp") ? getTemperatureColorClass(Number(value)) : 
                        type.includes("usage") ? getUsageColorClass(Number(value)) : 
                        "text-foreground";

  // Get appropriate icon
  const getIcon = () => {
    switch (type) {
      case "cpu_temp":
      case "gpu_temp":
        return <Thermometer className="h-6 w-6" />;
      case "ram_usage":
        return <MemoryStick className="h-6 w-6" />;
      case "fan_speed":
        return <Fan className="h-6 w-6" />;
      case "uptime":
        return <Clock className="h-6 w-6" />;
      case "power_draw":
        return <Zap className="h-6 w-6" />;
      case "cpu_usage":
        return <Cpu className="h-6 w-6" />;
      case "gpu_usage":
        return <Gauge className="h-6 w-6" />;
      default:
        return <BarChart3 className="h-6 w-6" />;
    }
  };

  // Apply alert styles for the card if in alert state
  const cardClass = cn(
    "card-glass rounded-xl p-4 flex flex-col h-full",
    isAlert && "animate-pulse border-2 border-red-DEFAULT bg-red-DEFAULT/10",
    className
  );

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={cn("text-primary", isAlert && "text-red-DEFAULT")}>
            {getIcon()}
          </span>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {isAlert && (
          <div className="text-red-DEFAULT">
            <BellRing className="h-5 w-5 animate-pulse" />
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <span className={cn(
            "text-2xl font-bold", 
            isAlert ? "text-red-DEFAULT" : valueColorClass
          )}>
            {formattedValue}
          </span>
          {alertThreshold && type.includes("temp") && (
            <span className="text-xs text-muted-foreground">
              Soglia: {alertThreshold}°C
            </span>
          )}
          {alertThreshold && type.includes("usage") && (
            <span className="text-xs text-muted-foreground">
              Soglia: {alertThreshold}%
            </span>
          )}
        </div>
        
        {showProgress && (
          <div className="mt-2 progress-bar-bg">
            <div 
              className={cn(
                "progress-bar-fill", 
                isAlert ? "bg-red-DEFAULT" : getProgressBarColorClass(progressValue)
              )}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareCard;
