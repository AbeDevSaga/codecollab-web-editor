"use client";
import React from "react";
import { FiX } from "react-icons/fi";

interface TabsProps {
  files: string[];
  activeFile: string | null;
  onTabChange: (filePath: string) => void;
  onCloseTab: (filePath: string, e: React.MouseEvent) => void;
}

const Tabs: React.FC<TabsProps> = ({
  files,
  activeFile,
  onTabChange,
  onCloseTab,
}) => {
  return (
    <div className="flex h-full overflow-x-auto no-scrollbar">
      <div className="flex h-full">
        {files.map((filePath) => (
          <div
            key={filePath}
            className={`h-full px-3 flex items-center border-r border-[#1e1e1e] cursor-pointer
            ${
              activeFile === filePath
                ? "bg-[#1e1e1e]"
                : "bg-[#2d2d2d] hover:bg-[#252525]"
            }`}
            onClick={() => onTabChange(filePath)}
          >
            <span className="text-sm text-[#d4d4d4] mr-2">
              {filePath.split("/").pop()}
            </span>
            <button
              onClick={(e) => onCloseTab(filePath, e)}
              className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-[#3a3a3a]"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
