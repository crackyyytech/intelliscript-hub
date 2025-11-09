import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface File {
  id: string;
  project_id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export const useFiles = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId)
        .order("path");

      if (error) throw error;
      return data as File[];
    },
    enabled: !!projectId,
  });

  const createFile = useMutation({
    mutationFn: async (file: { project_id: string; name: string; path: string; content: string; language?: string }) => {
      const { data, error } = await supabase
        .from("files")
        .insert(file)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast({ title: "File created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFile = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("files")
        .update({ content })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", projectId] });
      toast({ title: "File deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    files: files || [],
    isLoading,
    createFile: createFile.mutate,
    updateFile: updateFile.mutate,
    deleteFile: deleteFile.mutate,
  };
};