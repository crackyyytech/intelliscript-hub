import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProjectExport {
  id: string;
  project_id: string;
  user_id: string;
  export_type: string;
  download_url?: string;
  created_at: string;
  expires_at: string;
}

export const useProjectExport = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: exports, isLoading } = useQuery({
    queryKey: ["project_exports", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_exports")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as ProjectExport[]) || [];
    },
    enabled: !!projectId,
  });

  const exportProject = useMutation({
    mutationFn: async (exportData: { exportType: string }) => {
      if (!projectId) throw new Error("No project selected");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      try {
        const result = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-project`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              projectId,
              exportType: exportData.exportType,
            }),
          }
        );

        if (!result.ok) throw new Error("Export failed");

        const responseData = await result.json();

        const { data, error } = await supabase
          .from("project_exports")
          .insert({
            project_id: projectId,
            user_id: user.user.id,
            export_type: exportData.exportType,
            download_url: responseData.downloadUrl,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project_exports", projectId],
      });
      toast({ title: "Project exported successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to export project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const importProject = useMutation({
    mutationFn: async (file: File) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.user.id);

      try {
        const result = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/import-project`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: formData,
          }
        );

        if (!result.ok) throw new Error("Import failed");

        const data = await result.json();
        return data;
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Project imported successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to import project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteExport = useMutation({
    mutationFn: async (exportId: string) => {
      const { error } = await supabase
        .from("project_exports")
        .delete()
        .eq("id", exportId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project_exports", projectId],
      });
      toast({ title: "Export deleted" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete export",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    exports: exports || [],
    isLoading,
    exportProject: exportProject.mutate,
    importProject: importProject.mutate,
    deleteExport: deleteExport.mutate,
  };
};
