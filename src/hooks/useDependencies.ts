import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Dependency {
  id: string;
  project_id: string;
  package_name: string;
  version: string;
  package_type: string;
  created_at: string;
}

export const useDependencies = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dependencies, isLoading } = useQuery({
    queryKey: ["dependencies", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("dependencies")
        .select("*")
        .eq("project_id", projectId)
        .order("package_name");
      if (error) throw error;
      return (data as Dependency[]) || [];
    },
    enabled: !!projectId,
  });

  const addDependency = useMutation({
    mutationFn: async (depData: {
      packageName: string;
      version: string;
      packageType?: string;
    }) => {
      if (!projectId) throw new Error("No project selected");

      const { data, error } = await supabase
        .from("dependencies")
        .insert({
          project_id: projectId,
          package_name: depData.packageName,
          version: depData.version,
          package_type: depData.packageType || "runtime",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dependencies", projectId] });
      toast({ title: "Dependency added successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to add dependency",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDependency = useMutation({
    mutationFn: async (depData: { id: string; version: string }) => {
      const { error } = await supabase
        .from("dependencies")
        .update({ version: depData.version })
        .eq("id", depData.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dependencies", projectId] });
      toast({ title: "Dependency updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update dependency",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeDependency = useMutation({
    mutationFn: async (depId: string) => {
      const { error } = await supabase
        .from("dependencies")
        .delete()
        .eq("id", depId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dependencies", projectId] });
      toast({ title: "Dependency removed successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove dependency",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    dependencies: dependencies || [],
    isLoading,
    addDependency: addDependency.mutate,
    updateDependency: updateDependency.mutate,
    removeDependency: removeDependency.mutate,
  };
};
