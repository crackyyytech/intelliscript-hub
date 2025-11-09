import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CollaborativeSession {
  id: string;
  project_id: string;
  owner_id: string;
  session_key: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

export interface UserCursor {
  id: string;
  session_id: string;
  user_id: string;
  file_id?: string;
  line_number?: number;
  column_number?: number;
  updated_at: string;
}

export interface Comment {
  id: string;
  file_id: string;
  user_id: string;
  line_number: number;
  content: string;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export const useCollaboration = (projectId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["collaborative_sessions", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("collaborative_sessions")
        .select("*")
        .eq("project_id", projectId)
        .eq("is_active", true);
      if (error) throw error;
      return (data as CollaborativeSession[]) || [];
    },
    enabled: !!projectId,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data: files } = await supabase
        .from("files")
        .select("id")
        .eq("project_id", projectId);

      if (!files || files.length === 0) return [];

      const fileIds = files.map((f) => f.id);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .in("file_id", fileIds)
        .eq("resolved", false);

      if (error) throw error;
      return (data as Comment[]) || [];
    },
    enabled: !!projectId,
  });

  const createSession = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("No project selected");
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const sessionKey = Math.random().toString(36).substring(2, 15);

      const { data, error } = await supabase
        .from("collaborative_sessions")
        .insert({
          project_id: projectId,
          owner_id: user.user.id,
          session_key: sessionKey,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collaborative_sessions", projectId],
      });
      toast({ title: "Collaboration session started" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addComment = useMutation({
    mutationFn: async (commentData: {
      fileId: string;
      lineNumber: number;
      content: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("comments")
        .insert({
          file_id: commentData.fileId,
          user_id: user.user.id,
          line_number: commentData.lineNumber,
          content: commentData.content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
      toast({ title: "Comment added" });
    },
    onError: (error) => {
      toast({
        title: "Failed to add comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resolveComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .update({ resolved: true })
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", projectId] });
      toast({ title: "Comment resolved" });
    },
    onError: (error) => {
      toast({
        title: "Failed to resolve comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    sessions: sessions || [],
    comments: comments || [],
    sessionsLoading,
    commentsLoading,
    createSession: createSession.mutate,
    addComment: addComment.mutate,
    resolveComment: resolveComment.mutate,
  };
};
