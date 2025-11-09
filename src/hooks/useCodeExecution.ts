import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ExecutionLog {
  id: string;
  project_id: string;
  user_id: string;
  status: string;
  output?: string;
  error_output?: string;
  execution_time_ms?: number;
  created_at: string;
}

export const useCodeExecution = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ["execution_logs", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("execution_logs")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as ExecutionLog[]) || [];
    },
    enabled: !!projectId,
  });

  const executeCode = useMutation({
    mutationFn: async (code: string) => {
      if (!projectId) throw new Error("No project selected");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const startTime = performance.now();

      try {
        const result = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ code }),
          }
        );

        const executionTime = Math.round(performance.now() - startTime);
        const output = await result.json();

        const { data, error } = await supabase
          .from("execution_logs")
          .insert({
            project_id: projectId,
            user_id: user.user.id,
            status: result.ok ? "success" : "error",
            output: output.result || JSON.stringify(output),
            error_output: output.error,
            execution_time_ms: executionTime,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        const executionTime = Math.round(performance.now() - startTime);
        const { data } = await supabase
          .from("execution_logs")
          .insert({
            project_id: projectId,
            user_id: user.user.id,
            status: "error",
            error_output: error instanceof Error ? error.message : String(error),
            execution_time_ms: executionTime,
          })
          .select()
          .single();

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["execution_logs", projectId] });
      toast({ title: "Code executed successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to execute code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearLogs = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("No project selected");
      const { error } = await supabase
        .from("execution_logs")
        .delete()
        .eq("project_id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["execution_logs", projectId] });
      toast({ title: "Logs cleared" });
    },
    onError: (error) => {
      toast({
        title: "Failed to clear logs",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    logs: logs || [],
    isLoading,
    executeCode: executeCode.mutate,
    clearLogs: clearLogs.mutate,
  };
};
