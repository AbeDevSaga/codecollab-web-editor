import React from 'react';
import type { TFile } from "../../../types/type";
import File from './File';
import Folder from './Folder';

interface FileExplorerProps {
  files: TFile[];
  level?: number;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  level = 0, 
  selectedPath, 
  onSelect 
}) => {
  return (
    <div className="w-full">
      {files.map((file) => {
        const isSelected = selectedPath === file.path;
        
        if (file.type === 'file') {
          return (
            <File
              key={file._id}
              file={file}
              level={level}
              isSelected={isSelected}
              onClick={() => onSelect && onSelect(file.path)}
            />
          );
        }

        return (
          <Folder
            key={file._id}
            folder={file}
            level={level}
            isSelected={isSelected}
            onClick={() => onSelect && onSelect(file.path)}
          />
        );
      })}
    </div>
  );
};

export default FileExplorer;