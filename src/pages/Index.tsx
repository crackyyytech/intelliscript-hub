import { useState } from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { FileExplorer } from "@/components/workspace/FileExplorer";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { PreviewPane } from "@/components/workspace/PreviewPane";
import { AIChatPanel } from "@/components/workspace/AIChatPanel";

const Index = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <WorkspaceHeader onToggleAIChat={() => setIsAIChatOpen(!isAIChatOpen)} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <FileExplorer />
        
        <div className="flex-1 flex">
          <CodeEditor />
          <PreviewPane />
        </div>

        <AIChatPanel isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      </div>
    </div>
  );
};

export default Index;
