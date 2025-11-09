import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GitCommit {
  id: string;
  project_id: string;
  user_id: string;
  branch: string;
  message: string;
  file_changes: string[];
  commit_hash: string;
  parent_hash?: string;
  created_at: string;
}

export interface GitBranch {
  id: string;
  project_id: string;
  name: string;
  head_commit_hash?: string;
  is_main: boolean;
  created_at: string;
}

export const useGit = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commits, isLoading: commitsLoading } = useQuery({
    queryKey: ["commits", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("git_commits")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as GitCommit[]) || [];
    },
    enabled: !!projectId,
  });

  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["branches", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("git_branches")
        .select("*")
        .eq("project_id", projectId)
        .order("is_main", { ascending: false });
      if (error) throw error;
      return (data as GitBranch[]) || [];
    },
    enabled: !!projectId,
  });

  const createCommit = useMutation({
    mutationFn: async (commitData: {
      message: string;
      branch?: string;
      fileChanges?: string[];
    }) => {
      if (!projectId) throw new Error("No project selected");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const commitHash = Array.from(crypto.getRandomValues(new Uint8Array(20)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .substring(0, 40);
      const parentCommit = commits?.[0];

      const { data, error } = await supabase
        .from("git_commits")
        .insert({
          project_id: projectId,
          user_id: user.user.id,
          message: commitData.message,
          branch: commitData.branch || "main",
          file_changes: commitData.fileChanges || [],
          commit_hash: commitHash,
          parent_hash: parentCommit?.commit_hash,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commits", projectId] });
      toast({ title: "Commit created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create commit",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createBranch = useMutation({
    mutationFn: async (branchData: { name: string; fromBranch?: string }) => {
      if (!projectId) throw new Error("No project selected");

      const { data, error } = await supabase
        .from("git_branches")
        .insert({
          project_id: projectId,
          name: branchData.name,
          is_main: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", projectId] });
      toast({ title: "Branch created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create branch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBranch = useMutation({
    mutationFn: async (branchId: string) => {
      const { error } = await supabase
        .from("git_branches")
        .delete()
        .eq("id", branchId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches", projectId] });
      toast({ title: "Branch deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete branch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    commits: commits || [],
    branches: branches || [],
    commitsLoading,
    branchesLoading,
    createCommit: createCommit.mutate,
    createBranch: createBranch.mutate,
    deleteBranch: deleteBranch.mutate,
  };
};
