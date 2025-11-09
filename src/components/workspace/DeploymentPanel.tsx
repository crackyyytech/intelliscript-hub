import { useState } from "react";
import { useDeployment } from "@/hooks/useDeployment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cloud, ExternalLink, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeploymentPanelProps {
  projectId: string | null;
}

export const DeploymentPanel = ({ projectId }: DeploymentPanelProps) => {
  const [platform, setPlatform] = useState("netlify");
  const { deployments, createDeployment, deleteDeployment } =
    useDeployment(projectId);

  const handleDeploy = () => {
    createDeployment({ platform });
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Cloud className="w-4 h-4" />
          Deployments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netlify">Netlify</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="github-pages">GitHub Pages</SelectItem>
                <SelectItem value="firebase">Firebase</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleDeploy}>
              Deploy
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {deployments.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No deployments yet
              </p>
            ) : (
              deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="p-2 bg-secondary rounded text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{deployment.platform}</span>
                      <Badge
                        className={`${
                          statusColors[deployment.status] || "bg-gray-500"
                        } text-xs`}
                      >
                        {deployment.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteDeployment(deployment.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  {deployment.url && (
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      View Deployment
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {deployment.error_message && (
                    <p className="text-red-500 mt-2">{deployment.error_message}</p>
                  )}
                  <p className="text-muted-foreground mt-2">
                    {new Date(deployment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
