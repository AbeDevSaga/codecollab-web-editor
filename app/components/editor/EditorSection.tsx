"use client";
import React, { useState, useRef, useEffect } from "react";
import MonacoWrapper from "./MonacoWrapper";
import Tabs from "./Tabs";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { closeFile, openFile, updateFileContent } from "@/app/redux/slices/editorSlice";

interface EditorSectionProps {
  workspaceId: string;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  workspaceId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Get editor state from Redux
  const { openFiles, activeFile } = useSelector((state: RootState) => {
    const workspace = state.editor.workspaces[workspaceId] || {
      openFiles: [],
      activeFile: null,
    };
    return {
      openFiles: workspace.openFiles,
      activeFile: workspace.activeFile,
    };
  });

  const handleTabChange = (filePath: string) => {
    const file = openFiles.find(f => f.path === filePath);
    if (file) {
      dispatch(openFile({ workspaceId, file }));
    }
  };

  const closeTab = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(closeFile({ workspaceId, filePath }));
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      dispatch(updateFileContent({ 
        workspaceId, 
        filePath: activeFile, 
        content: value 
      }));
    }
  };

  // Find the active file content
  const activeFileContent = openFiles.find(f => f.path === activeFile)?.content || "";

  return (
    <div
      ref={editorContainerRef}
      className="flex-1 flex flex-col bg-[#1e1e1e] relative overflow-hidden"
    >
      {/* Editor Tabs - Only show if files are open */}
      {openFiles.length > 0 && (
        <div className="h-8 flex items-center bg-[#252526] border-b border-[#1e1e1e]">
          <Tabs
            files={openFiles.map(f => f.path)}
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
              value={activeFileContent}
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
