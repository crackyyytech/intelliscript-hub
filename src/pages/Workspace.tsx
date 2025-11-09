import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { FileExplorer } from "@/components/workspace/FileExplorer";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { PreviewPane } from "@/components/workspace/PreviewPane";
import { AIChatPanel } from "@/components/workspace/AIChatPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/hooks/useFiles";
import { getTemplate } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Code2 } from "lucide-react";

const Workspace = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const { user, loading } = useAuth();
  const { files, updateFile, createFile } = useFiles(currentProjectId);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (currentFileId && files.length > 0) {
      const file = files.find(f => f.id === currentFileId);
      if (file) {
        setCode(file.content);
      }
    }
  }, [currentFileId, files]);

  useEffect(() => {
    // Auto-select first file when files are loaded
    if (files.length > 0 && !currentFileId) {
      setCurrentFileId(files[0].id);
    }
  }, [files, currentFileId]);

  const handleProjectSelect = async (projectId: string) => {
    setCurrentProjectId(projectId);
    
    // Get project details to check template
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (project && files.length === 0) {
      // Initialize project with template files
      const template = getTemplate(project.template);
      if (template) {
        for (const file of template.files) {
          createFile({
            project_id: projectId,
            ...file,
          });
        }
      }
    }
  };

  const handleSave = () => {
    if (currentFileId && code) {
      updateFile({ id: currentFileId, content: code });
      toast({ title: "File saved successfully" });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-ai-gradient flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <WorkspaceHeader
        onToggleAIChat={() => setIsAIChatOpen(!isAIChatOpen)}
        currentProjectId={currentProjectId}
        onProjectSelect={handleProjectSelect}
        onSave={handleSave}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <FileExplorer
          projectId={currentProjectId}
          currentFileId={currentFileId}
          onFileSelect={setCurrentFileId}
        />
        
        <div className="flex-1 flex">
          <CodeEditor
            code={code}
            onChange={setCode}
            language="typescript"
          />
          <PreviewPane code={code} />
        </div>

        <AIChatPanel
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          currentCode={code}
        />
      </div>
    </div>
  );
};

export default Workspace;