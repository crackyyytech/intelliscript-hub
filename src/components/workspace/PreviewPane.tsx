import { Monitor, Smartphone, Tablet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const PreviewPane = () => {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const getPreviewWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card">
      <div className="h-10 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={device === "desktop" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={device === "tablet" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setDevice("tablet")}
          >
            <Tablet className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant={device === "mobile" ? "secondary" : "ghost"}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setDevice("mobile")}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-muted/20 p-4 overflow-auto">
        <div 
          className="bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
          style={{ width: getPreviewWidth(), height: "100%" }}
        >
          <div className="min-h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Welcome to AI Workspace
              </h1>
              <p className="text-gray-600 mb-4">
                This is a live preview of your React code!
              </p>
              <div className="flex items-center gap-4 justify-center">
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  -
                </button>
                <span className="text-2xl font-bold text-gray-800">0</span>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
