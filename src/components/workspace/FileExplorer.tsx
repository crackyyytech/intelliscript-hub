import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const mockFiles: FileItem[] = [
  {
    name: "src",
    type: "folder",
    children: [
      { name: "App.tsx", type: "file" },
      { name: "index.tsx", type: "file" },
      { name: "styles.css", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "index.html", type: "file" },
    ],
  },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" },
];

const FileTreeItem = ({ item, level = 0 }: { item: FileItem; level?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === "folder";

  return (
    <div>
      <button
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1 text-sm hover:bg-secondary/50 rounded transition-colors",
          level === 0 && "font-medium"
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
            <FileTreeItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer = () => {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Explorer
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {mockFiles.map((item, index) => (
          <FileTreeItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};
