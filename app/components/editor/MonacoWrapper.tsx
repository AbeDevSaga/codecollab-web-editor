// MonacoWrapper.tsx
"use client";
import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { getLanguageFromFile } from "@/app/lib/files";

interface MonacoWrapperProps {
  filePath: string;
  value: string;
  onChange?: (value: string | undefined) => void;
  isLocalChange?: boolean;
}

const MonacoWrapper: React.FC<MonacoWrapperProps> = ({
  filePath,
  value,
  onChange,
  isLocalChange,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const lastFilePathRef = useRef<string>(filePath);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.setTheme("vs-dark");
    editor.setValue(value);
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: "on",
      automaticLayout: true,
    });

    editor.onDidChangeModelContent(() => {
      onChange && onChange(editor.getValue());
    });
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // If file path changed, we need to completely reset the editor
    if (filePath !== lastFilePathRef.current) {
      lastFilePathRef.current = filePath;
      editorRef.current.setValue(value);
      return;
    }

    // Only update content if this isn't a local change and the value is different
    if (!isLocalChange && editorRef.current.getValue() !== value) {
      const editor = editorRef.current;
      const model = editor.getModel();
      
      // Preserve cursor position
      const position = editor.getPosition();
      const selections = editor.getSelections();
      
      editor.pushUndoStop();
      editor.executeEdits("remote-change", [
        {
          range: model.getFullModelRange(),
          text: value,
        }
      ]);
      
      if (position) {
        editor.setPosition(position);
        editor.setSelections(selections || []);
      }
    }
  }, [value, isLocalChange, filePath]);

  return (
    <div className="h-full w-full">
      <Editor
        key={filePath} // This forces a remount when filePath changes
        height="100%"
        path={filePath}
        language={getLanguageFromFile(filePath)}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          theme: "vs-dark",
        }}
      />
    </div>
  );
};

export default MonacoWrapper;