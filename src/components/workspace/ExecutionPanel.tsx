import { useCodeExecution } from "@/hooks/useCodeExecution";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExecutionPanelProps {
  projectId: string | null;
  code: string;
}

export const ExecutionPanel = ({ projectId, code }: ExecutionPanelProps) => {
  const { logs, executeCode, clearLogs } = useCodeExecution(projectId);

  const handleExecute = () => {
    if (code.trim()) {
      executeCode(code);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Play className="w-4 h-4" />
            Execution
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleExecute}
              disabled={!code.trim()}
              className="h-7"
            >
              <Play className="w-3 h-3 mr-1" />
              Run
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearLogs()}
              className="h-7 w-7 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 text-xs">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No execution logs</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-2 bg-secondary rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {log.status === "success" ? "✓" : "✗"} Execution
                    </span>
                    <span className="text-muted-foreground">
                      {log.execution_time_ms}ms
                    </span>
                  </div>
                  {log.output && (
                    <div className="text-muted-foreground whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                      {log.output}
                    </div>
                  )}
                  {log.error_output && (
                    <div className="text-red-500 whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                      {log.error_output}
                    </div>
                  )}
                  <p className="text-muted-foreground mt-2">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
