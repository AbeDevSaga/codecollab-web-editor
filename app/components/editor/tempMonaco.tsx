'use client';
import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
// import { MonacoBinding } from 'y-monaco';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { updateFileContent } from '@/store/editorSlice';
// import { useCollaboration } from '@/hooks/useCollaboration';
import { debounce } from 'lodash';

interface MonacoWrapperProps {
  filePath: string;
}

const tempWrapper: React.FC<MonacoWrapperProps> = ({ filePath }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
//   const dispatch = useDispatch();
//   const { ydoc, provider } = useCollaboration('editor-room');
//   const fileContent = useSelector((state: RootState) => state.editor.fileContent[filePath] || '');

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // if (ydoc) {
    //   // Get or create Y.Text for this file
    //   const ytext = ydoc.getText(filePath);
    //   ytext.insert(0, fileContent); // Initialize with current content

    //   // Bind Yjs to Monaco
    //   new MonacoBinding(
    //     ytext,
    //     editor.getModel(),
    //     new Set([editor]),
    //     provider.awareness
    //   );

    //   // Handle local changes to update Redux store
    //   editor.onDidChangeModelContent(debounce(() => {
    //     const value = editor.getValue();
    //     dispatch(updateFileContent({ path: filePath, content: value }));
    //   }, 300));
    // }

    // Set up editor options
    editor.updateOptions({
      minimap: { enabled: false },
      fontSize: 14,
      wordWrap: 'on',
      automaticLayout: true,
    });
  };

  // Set editor theme based on system preference
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'vs-dark' 
          : 'light'
      );
    }
  }, []);

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={getLanguageFromFile(filePath)}
        value="welcome to the Monaco Editor!"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

// Helper function to determine language from file extension
function getLanguageFromFile(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'jsx': return 'javascript';
    case 'tsx': return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'plaintext';
  }
}

export default tempWrapper;