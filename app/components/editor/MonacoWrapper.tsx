'use client';
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageFromFile } from '@/app/lib/files';

interface MonacoWrapperProps {
  filePath: string;
  value: string;
  onChange?: (value: string | undefined) => void;
}

const MonacoWrapper: React.FC<MonacoWrapperProps> = ({ filePath, value, onChange }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set dark theme explicitly
    monaco.editor.setTheme('vs-dark');

    // Set initial value and options
    editor.setValue(value);
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: true,
    });

    editor.onDidChangeModelContent(() => {
      onChange && onChange(editor.getValue());
    });
  };

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        path={filePath}
        language={getLanguageFromFile(filePath)}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          theme: 'vs-dark', // Set theme here as well for initial load
          value: value
        }}
      />
    </div>
  );
};

export default MonacoWrapper;