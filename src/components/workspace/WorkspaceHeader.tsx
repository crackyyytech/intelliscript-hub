import { Button } from "@/components/ui/button";
import { Code2, Sparkles, Play, Settings, Save } from "lucide-react";

interface WorkspaceHeaderProps {
  onToggleAIChat: () => void;
}

export const WorkspaceHeader = ({ onToggleAIChat }: WorkspaceHeaderProps) => {
  return (
    <header className="h-12 bg-workspace-chrome border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-ai-gradient flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">AI Workspace</span>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>index.tsx</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Play className="w-4 h-4" />
          Run
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-2 bg-ai-gradient text-primary-foreground hover:opacity-90"
          onClick={onToggleAIChat}
        >
          <Sparkles className="w-4 h-4" />
          AI Assistant
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};
