import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { FileExplorer } from "@/components/workspace/FileExplorer";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { PreviewPane } from "@/components/workspace/PreviewPane";
import { AIChatPanel } from "@/components/workspace/AIChatPanel";
import { GitPanel } from "@/components/workspace/GitPanel";
import { DependenciesPanel } from "@/components/workspace/DependenciesPanel";
import { TerminalPanel } from "@/components/workspace/TerminalPanel";
import { ExecutionPanel } from "@/components/workspace/ExecutionPanel";
import { DeploymentPanel } from "@/components/workspace/DeploymentPanel";
import { ExportImportPanel } from "@/components/workspace/ExportImportPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/hooks/useFiles";
import { getTemplate } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Code2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Workspace = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("git");
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
    if (files.length > 0 && !currentFileId) {
      setCurrentFileId(files[0].id);
    }
  }, [files, currentFileId]);

  const handleProjectSelect = async (projectId: string) => {
    setCurrentProjectId(projectId);

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (project && files.length === 0) {
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

        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <CodeEditor
              code={code}
              onChange={setCode}
              language="typescript"
            />
            <PreviewPane code={code} />
          </div>

          <div className="h-48 border-t overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="rounded-none border-b w-full justify-start h-8">
                <TabsTrigger value="git" className="text-xs">Git</TabsTrigger>
                <TabsTrigger value="deps" className="text-xs">Dependencies</TabsTrigger>
                <TabsTrigger value="terminal" className="text-xs">Terminal</TabsTrigger>
                <TabsTrigger value="execution" className="text-xs">Execution</TabsTrigger>
                <TabsTrigger value="deploy" className="text-xs">Deploy</TabsTrigger>
                <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="git" className="flex-1 overflow-hidden">
                <GitPanel projectId={currentProjectId} />
              </TabsContent>
              <TabsContent value="deps" className="flex-1 overflow-hidden">
                <DependenciesPanel projectId={currentProjectId} />
              </TabsContent>
              <TabsContent value="terminal" className="flex-1 overflow-hidden">
                <TerminalPanel projectId={currentProjectId} />
              </TabsContent>
              <TabsContent value="execution" className="flex-1 overflow-hidden">
                <ExecutionPanel projectId={currentProjectId} code={code} />
              </TabsContent>
              <TabsContent value="deploy" className="flex-1 overflow-hidden">
                <DeploymentPanel projectId={currentProjectId} />
              </TabsContent>
              <TabsContent value="export" className="flex-1 overflow-hidden">
                <ExportImportPanel projectId={currentProjectId} />
              </TabsContent>
            </Tabs>
          </div>
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