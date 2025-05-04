import React, { useState } from "react";
import {
  VscChevronRight,
  VscChevronDown,
  VscFolder,
  VscFolderOpened,
} from "react-icons/vsc";
import type {  TFile } from "../../../types/type";
import FileExplorer from "./FileExplorer";

interface FolderProps {
  folder: TFile;
  level: number;
  isSelected: boolean;
  onFileSelect: (file: TFile) => void; 
}

const Folder: React.FC<FolderProps> = ({
  folder,
  level,
  isSelected,
  onFileSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleFolderClick = () => {
    onFileSelect(folder); 
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 ${
          isSelected ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
        } cursor-pointer`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleFolderClick}
      >
        <div onClick={handleClick} className="mr-1">
          {isExpanded ? (
            <VscChevronDown className="text-[#d4d4d4] w-4 h-4" />
          ) : (
            <VscChevronRight className="text-[#d4d4d4] w-4 h-4" />
          )}
        </div>
        {isExpanded ? (
          <VscFolderOpened className="text-yellow-400 mr-2" />
        ) : (
          <VscFolder className="text-yellow-400 mr-2" />
        )}
        <span className="text-[#d4d4d4] text-sm">{folder.name}</span>
      </div>
      {isExpanded && folder.children && folder.children.length > 0 && (
        <div className="ml-2">
          <FileExplorer
            files={folder.children}
            level={level + 1}
            selectedPath={folder.path}
            onFileSelect={onFileSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Folder;
