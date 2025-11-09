import { useState } from "react";
import { useDependencies } from "@/hooks/useDependencies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Package } from "lucide-react";

interface DependenciesPanelProps {
  projectId: string | null;
}

export const DependenciesPanel = ({ projectId }: DependenciesPanelProps) => {
  const [packageName, setPackageName] = useState("");
  const [version, setVersion] = useState("latest");
  const {
    dependencies,
    addDependency,
    removeDependency,
  } = useDependencies(projectId);

  const handleAddDependency = () => {
    if (packageName.trim()) {
      addDependency({
        packageName,
        version: version || "latest",
        packageType: "runtime",
      });
      setPackageName("");
      setVersion("latest");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="w-4 h-4" />
          Dependencies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Package name..."
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleAddDependency()
              }
              className="text-xs"
            />
            <Input
              placeholder="Version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="text-xs w-24"
            />
            <Button
              size="sm"
              onClick={handleAddDependency}
              disabled={!packageName.trim()}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dependencies.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No dependencies installed
              </p>
            ) : (
              dependencies.map((dep) => (
                <div
                  key={dep.id}
                  className="p-2 bg-secondary rounded text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{dep.package_name}</p>
                    <p className="text-muted-foreground">{dep.version}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeDependency(dep.id)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
