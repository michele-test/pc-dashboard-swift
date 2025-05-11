
/// <reference types="vite/client" />

// Extending global window object for Tauri-specific properties
interface Window {
  __TAURI__?: {
    invoke: (cmd: string, args?: any) => Promise<any>;
  }
}
