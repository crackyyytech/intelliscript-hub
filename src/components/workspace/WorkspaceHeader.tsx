import { Button } from "@/components/ui/button";
import { Code2, Sparkles, Play, Settings, Save, LogOut } from "lucide-react";
import { ProjectSelector } from "./ProjectSelector";
import { useAuth } from "@/contexts/AuthContext";

interface WorkspaceHeaderProps {
  onToggleAIChat: () => void;
  currentProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
  onSave: () => void;
}

export const WorkspaceHeader = ({ onToggleAIChat, currentProjectId, onProjectSelect, onSave }: WorkspaceHeaderProps) => {
  const { signOut } = useAuth();
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
        
        <ProjectSelector
          currentProjectId={currentProjectId}
          onProjectSelect={onProjectSelect}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={onSave}>
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
        <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={signOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};
