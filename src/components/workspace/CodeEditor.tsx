import Editor from "@monaco-editor/react";
import { useState } from "react";

const defaultCode = `import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to AI Workspace
        </h1>
        <p className="text-gray-600 mb-4">
          This is a live preview of your React code!
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            -
          </button>
          <span className="text-2xl font-bold text-gray-800">{count}</span>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;`;

export const CodeEditor = () => {
  const [code, setCode] = useState(defaultCode);

  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => setCode(value || "")}
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
