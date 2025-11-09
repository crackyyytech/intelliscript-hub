import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TerminalCommand {
  id: string;
  project_id: string;
  user_id: string;
  command: string;
  output?: string;
  exit_code?: number;
  created_at: string;
}

export const useTerminal = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ["terminal_history", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("terminal_history")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data as TerminalCommand[]) || [];
    },
    enabled: !!projectId,
  });

  const executeCommand = useMutation({
    mutationFn: async (command: string) => {
      if (!projectId) throw new Error("No project selected");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      try {
        const result = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-command`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ command, projectId }),
          }
        );

        const output = await result.json();

        const { data, error } = await supabase
          .from("terminal_history")
          .insert({
            project_id: projectId,
            user_id: user.user.id,
            command,
            output: output.result || JSON.stringify(output),
            exit_code: output.exitCode || 0,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        const { data } = await supabase
          .from("terminal_history")
          .insert({
            project_id: projectId,
            user_id: user.user.id,
            command,
            output: error instanceof Error ? error.message : String(error),
            exit_code: 1,
          })
          .select()
          .single();

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["terminal_history", projectId],
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to execute command",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("No project selected");
      const { error } = await supabase
        .from("terminal_history")
        .delete()
        .eq("project_id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["terminal_history", projectId],
      });
      toast({ title: "Terminal history cleared" });
    },
    onError: (error) => {
      toast({
        title: "Failed to clear history",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    history: history || [],
    isLoading,
    executeCommand: executeCommand.mutate,
    clearHistory: clearHistory.mutate,
  };
};
