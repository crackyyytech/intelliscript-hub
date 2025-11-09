import { ChevronRight, ChevronDown, Folder, FileText, Plus, FolderPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFiles, File } from "@/hooks/useFiles";

interface FileTreeItem {
  name: string;
  type: "file" | "folder";
  path: string;
  id?: string;
  children?: FileTreeItem[];
}

interface FileExplorerProps {
  projectId: string | null;
  currentFileId: string | null;
  onFileSelect: (fileId: string) => void;
}

const FileTreeItemComponent = ({
  item,
  level = 0,
  onFileSelect,
  currentFileId,
}: {
  item: FileTreeItem;
  level?: number;
  onFileSelect: (fileId: string) => void;
  currentFileId: string | null;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === "folder";
  const isActive = item.id === currentFileId;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else if (item.id) {
            onFileSelect(item.id);
          }
        }}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1 text-sm hover:bg-secondary/50 rounded transition-colors",
          level === 0 && "font-medium",
          isActive && "bg-secondary"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isFolder && (
          <span className="text-muted-foreground">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {isFolder ? (
          <Folder className="w-4 h-4 text-primary" />
        ) : (
          <FileText className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-foreground">{item.name}</span>
      </button>
      {isFolder && isOpen && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeItemComponent
              key={index}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              currentFileId={currentFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const buildFileTree = (files: File[]): FileTreeItem[] => {
  const tree: Map<string, FileTreeItem> = new Map();
  const root: FileTreeItem[] = [];

  files.forEach((file) => {
    const parts = file.path.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;

      if (isFile) {
        currentLevel.push({
          name: file.name,
          type: "file",
          path: file.path,
          id: file.id,
        });
      } else {
        let folder = tree.get(currentPath);
        if (!folder) {
          folder = {
            name: part,
            type: "folder",
            path: currentPath,
            children: [],
          };
          tree.set(currentPath, folder);
          currentLevel.push(folder);
        }
        currentLevel = folder.children!;
      }
    });
  });

  return root;
};

export const FileExplorer = ({ projectId, currentFileId, onFileSelect }: FileExplorerProps) => {
  const { files } = useFiles(projectId);
  const fileTree = buildFileTree(files);

  if (!projectId) {
    return (
      <div className="w-64 bg-card border-r border-border flex flex-col h-full">
        <div className="px-3 py-2 border-b border-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Explorer
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Select or create a project to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <FolderPlus className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.map((item, index) => (
          <FileTreeItemComponent
            key={index}
            item={item}
            onFileSelect={onFileSelect}
            currentFileId={currentFileId}
          />
        ))}
        {files.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            No files yet
          </p>
        )}
      </div>
    </div>
  );
};
