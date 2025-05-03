"use client";
import React, { useState, useRef, useEffect } from "react";
import MonacoWrapper from "./MonacoWrapper";
import Tabs from "./Tabs";

interface EditorSectionProps {
  workspaceId: string;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  workspaceId,
}) => {
  const [activeFile, setActiveFile] = useState<string>("");
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState<Record<string, string>>({});
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with a default file
  useEffect(() => {
    const defaultFile = "/index.txt";
    fetch(defaultFile)
      .then((response) => response.text())
      .then((content) => {
        setFileContent((prev) => ({ ...prev, [defaultFile]: content }));
        setOpenFiles([defaultFile]);
        setActiveFile(defaultFile);
      })
      .catch((error) => {
        console.error("Error loading default file:", error);
        // Fallback content if file doesn't exist
        const fallbackContent =
          "Welcome to the editor!\n\nThis is the default file.\n\nStart editing here...";
        setFileContent((prev) => ({ ...prev, [defaultFile]: fallbackContent }));
        setOpenFiles([defaultFile]);
        setActiveFile(defaultFile);
      });
  }, []);

  const handleTabChange = (filePath: string) => {
    setActiveFile(filePath);
    if (!openFiles.includes(filePath)) {
      setOpenFiles([...openFiles, filePath]);
      if (!fileContent[filePath]) {
        fetch(filePath)
          .then((response) => response.text())
          .then((content) => {
            setFileContent((prev) => ({ ...prev, [filePath]: content }));
          })
          .catch((error) => {
            console.error("Error loading file:", error);
            setFileContent((prev) => ({ ...prev, [filePath]: "" }));
          });
      }
    }
  };

  const closeTab = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter((file) => file !== filePath);
    setOpenFiles(newOpenFiles);

    if (activeFile === filePath) {
      setActiveFile(newOpenFiles[newOpenFiles.length - 1] || "");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      setFileContent((prev) => ({ ...prev, [activeFile]: value }));
    }
  };

  return (
    <div
      ref={editorContainerRef}
      className="flex-1 flex flex-col bg-[#1e1e1e] relative overflow-hidden"
    >
      {/* Editor Tabs - Only show if files are open */}
      {openFiles.length > 0 && (
        <div className="h-8 flex items-center bg-[#252526] border-b border-[#1e1e1e]">
          <Tabs
            files={openFiles}
            activeFile={activeFile}
            onTabChange={handleTabChange}
            onCloseTab={closeTab}
          />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        {activeFile ? (
          <div className="absolute inset-0">
            <MonacoWrapper
              filePath={activeFile}
              value={fileContent[activeFile] || ""}
              onChange={handleEditorChange}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No file open
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorSection;
