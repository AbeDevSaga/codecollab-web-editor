import React from 'react';
import type { TFile } from "../../../types/type";
import File from './File';
import Folder from './Folder';

interface FileExplorerProps {
  files: TFile[];
  level?: number;
  selectedPath?: string;
  onFileSelect: (file: TFile) => void; 
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  level = 0, 
  selectedPath, 
  onFileSelect 
}) => {
  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full">
      {files.map((file) => {
        const isSelected = selectedPath === file.path;
        
        if (file.type === 'file') {
          return (
            <File
              key={file._id}
              file={file}
              level={level}
              isSelected={isSelected}
              onClick={() => onFileSelect(file)}
            />
          );
        }

        return (
          <Folder
            key={file._id}
            folder={file}
            level={level}
            isSelected={isSelected}
            onFileSelect={onFileSelect}
          />
        );
      })}
    </div>
  );
};

export default FileExplorer;