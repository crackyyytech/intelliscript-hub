import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Deployment {
  id: string;
  project_id: string;
  user_id: string;
  status: string;
  platform: string;
  url?: string;
  environment: Record<string, string>;
  config: Record<string, string>;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export const useDeployment = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deployments, isLoading } = useQuery({
    queryKey: ["deployments", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("deployments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Deployment[]) || [];
    },
    enabled: !!projectId,
  });

  const createDeployment = useMutation({
    mutationFn: async (deployData: {
      platform: string;
      environment?: Record<string, string>;
      config?: Record<string, string>;
    }) => {
      if (!projectId) throw new Error("No project selected");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("deployments")
        .insert({
          project_id: projectId,
          user_id: user.user.id,
          platform: deployData.platform,
          status: "pending",
          environment: deployData.environment || {},
          config: deployData.config || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments", projectId] });
      toast({ title: "Deployment initiated" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create deployment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDeploymentStatus = useMutation({
    mutationFn: async (deployData: {
      id: string;
      status: string;
      url?: string;
      errorMessage?: string;
      completedAt?: string;
    }) => {
      const { error } = await supabase
        .from("deployments")
        .update({
          status: deployData.status,
          url: deployData.url,
          error_message: deployData.errorMessage,
          completed_at: deployData.completedAt,
        })
        .eq("id", deployData.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments", projectId] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update deployment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDeployment = useMutation({
    mutationFn: async (deploymentId: string) => {
      const { error } = await supabase
        .from("deployments")
        .delete()
        .eq("id", deploymentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments", projectId] });
      toast({ title: "Deployment deleted" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete deployment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    deployments: deployments || [],
    isLoading,
    createDeployment: createDeployment.mutate,
    updateDeploymentStatus: updateDeploymentStatus.mutate,
    deleteDeployment: deleteDeployment.mutate,
  };
};
