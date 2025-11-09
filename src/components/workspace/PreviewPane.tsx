import { Monitor, Smartphone, Tablet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

interface PreviewPaneProps {
  code?: string;
}

export const PreviewPane = ({ code }: PreviewPaneProps) => {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <script src="https://cdn.tailwindcss.com"></script>
              <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
              <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                ${code}
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(<App />);
              </script>
            </body>
          </html>
        `;
        iframeDoc.open();
        iframeDoc.write(html);
        iframeDoc.close();
      }
    }
  }, [code, previewKey]);

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
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPreviewKey(prev => prev + 1)}>
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-muted/20 p-4 overflow-auto">
        <iframe
          ref={iframeRef}
          title="Preview"
          className="bg-background rounded-lg shadow-2xl transition-all duration-300 border-0"
          style={{ width: getPreviewWidth(), height: "100%" }}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};
