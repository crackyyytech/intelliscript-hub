import { useState, useRef, useEffect } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Terminal, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TerminalPanelProps {
  projectId: string | null;
}

export const TerminalPanel = ({ projectId }: TerminalPanelProps) => {
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { history, executeCommand, clearHistory } = useTerminal(projectId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleExecuteCommand = () => {
    if (command.trim()) {
      executeCommand(command);
      setCommand("");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Terminal
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => clearHistory()}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 mb-3" ref={scrollRef}>
          <div className="space-y-2 text-xs font-mono">
            {history.length === 0 ? (
              <p className="text-muted-foreground">No commands executed</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="text-xs">
                  <div className="text-primary">$ {item.command}</div>
                  {item.output && (
                    <div className="text-muted-foreground whitespace-pre-wrap break-words">
                      {item.output}
                    </div>
                  )}
                  {item.exit_code !== 0 && (
                    <div className="text-red-500">
                      Exit code: {item.exit_code}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="$ npm start"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleExecuteCommand()}
            className="text-xs font-mono"
          />
          <Button
            size="sm"
            onClick={handleExecuteCommand}
            disabled={!command.trim()}
          >
            Run
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
