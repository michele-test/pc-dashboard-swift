
import React from "react";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  isConnected: boolean;
  serverAddress: string;
  lastUpdated: Date | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  serverAddress,
  lastUpdated
}) => {
  const formattedTime = lastUpdated 
    ? lastUpdated.toLocaleTimeString() 
    : "Mai";

  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted">
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <div className="flex items-center space-x-1.5">
              <Wifi className="w-4 h-4 text-green-DEFAULT" />
              <span className="text-xs text-green-DEFAULT">Connesso</span>
            </div>
            <span className="text-xs text-muted-foreground">{serverAddress}</span>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1.5">
              <WifiOff className="w-4 h-4 text-red-DEFAULT" />
              <span className="text-xs text-red-DEFAULT">Disconnesso</span>
            </div>
          </>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        Ultimo aggiornamento: {formattedTime}
      </div>
    </div>
  );
};

export default ConnectionStatus;
