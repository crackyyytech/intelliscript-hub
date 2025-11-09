import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
}

export const CodeEditor = ({ code, onChange, language = "typescript" }: CodeEditorProps) => {
  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onChange(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Consolas', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 16 },
            lineNumbers: "on",
            renderLineHighlight: "all",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};
