import { useRef } from "react";
import { useProjectExport } from "@/hooks/useProjectExport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExportImportPanelProps {
  projectId: string | null;
}

export const ExportImportPanel = ({ projectId }: ExportImportPanelProps) => {
  const [exportType, setExportType] = useState("zip");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exports, exportProject, importProject, deleteExport } =
    useProjectExport(projectId);

  const handleExport = () => {
    exportProject({ exportType });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importProject(file);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export / Import
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zip">ZIP Archive</SelectItem>
                <SelectItem value="tar">TAR Archive</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleExport}>
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleImportClick}>
              <Upload className="w-3 h-3 mr-1" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip,.tar,.tar.gz"
              onChange={handleFileSelected}
              className="hidden"
            />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {exports.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No exports yet
              </p>
            ) : (
              exports.map((exp) => (
                <div
                  key={exp.id}
                  className="p-2 bg-secondary rounded text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{exp.export_type.toUpperCase()}</p>
                    <p className="text-muted-foreground">
                      {new Date(exp.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {exp.download_url && (
                      <a
                        href={exp.download_url}
                        download
                        className="text-blue-500 hover:underline"
                      >
                        <Download className="w-3 h-3" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteExport(exp.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
