import { useState } from "react";
import { useGit } from "@/hooks/useGit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, GitCommit } from "lucide-react";

interface GitPanelProps {
  projectId: string | null;
}

export const GitPanel = ({ projectId }: GitPanelProps) => {
  const [commitMessage, setCommitMessage] = useState("");
  const [branchName, setBranchName] = useState("");
  const { commits, branches, createCommit, createBranch } = useGit(projectId);

  const handleCreateCommit = () => {
    if (commitMessage.trim()) {
      createCommit({ message: commitMessage });
      setCommitMessage("");
    }
  };

  const handleCreateBranch = () => {
    if (branchName.trim()) {
      createBranch({ name: branchName });
      setBranchName("");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitCommit className="w-4 h-4" />
          Version Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="commits" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
          </TabsList>

          <TabsContent value="commits" className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Commit message..."
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleCreateCommit()
                }
              />
              <Button
                size="sm"
                onClick={handleCreateCommit}
                disabled={!commitMessage.trim()}
              >
                Commit
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {commits.length === 0 ? (
                <p className="text-xs text-muted-foreground">No commits yet</p>
              ) : (
                commits.map((commit) => (
                  <div key={commit.id} className="p-2 bg-secondary rounded text-xs">
                    <p className="font-semibold truncate">{commit.message}</p>
                    <p className="text-muted-foreground">
                      {new Date(commit.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="branches" className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Branch name..."
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateBranch()}
              />
              <Button
                size="sm"
                onClick={handleCreateBranch}
                disabled={!branchName.trim()}
              >
                Create
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {branches.length === 0 ? (
                <p className="text-xs text-muted-foreground">No branches</p>
              ) : (
                branches.map((branch) => (
                  <div key={branch.id} className="p-2 bg-secondary rounded text-xs flex items-center gap-2">
                    <GitBranch className="w-3 h-3" />
                    <span className="font-semibold">{branch.name}</span>
                    {branch.is_main && (
                      <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        main
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
