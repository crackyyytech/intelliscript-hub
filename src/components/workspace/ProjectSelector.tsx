import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, FolderOpen, Trash2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { templates } from "@/lib/templates";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSelectorProps {
  currentProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
}

export const ProjectSelector = ({ currentProjectId, onProjectSelect }: ProjectSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectTemplate, setNewProjectTemplate] = useState("blank");
  const { projects, createProject, deleteProject } = useProjects();

  const currentProject = projects?.find(p => p.id === currentProjectId);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject({
        name: newProjectName,
        template: newProjectTemplate,
      });
      setNewProjectName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            {currentProject?.name || "Select Project"}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Projects</DialogTitle>
          <DialogDescription>Select a project or create a new one</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Project</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
              />
              <Select value={newProjectTemplate} onValueChange={setNewProjectTemplate}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateProject} className="gap-2">
                <FolderPlus className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="mb-2 block">Your Projects</Label>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {projects?.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition"
                  >
                    <button
                      onClick={() => {
                        onProjectSelect(project.id);
                        setOpen(false);
                      }}
                      className="flex-1 text-left"
                    >
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {!projects?.length && (
                  <p className="text-center text-muted-foreground py-8">
                    No projects yet. Create one above!
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};