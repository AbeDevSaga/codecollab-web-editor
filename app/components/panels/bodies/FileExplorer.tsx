import React from 'react';
import type { FileItem } from "../../../types/type";
import File from './File';
import Folder from './Folder';

interface FileExplorerProps {
  data: FileItem[];
  level?: number;
  selectedPath?: string;
  onSelect?: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  data, 
  level = 0, 
  selectedPath, 
  onSelect 
}) => {
  return (
    <div className="w-full">
      {data.map((item) => {
        const isSelected = selectedPath === item.path;
        
        if (item.type === 'file') {
          return (
            <File
              key={item.id}
              file={item}
              level={level}
              isSelected={isSelected}
              onClick={() => onSelect && onSelect(item.path)}
            />
          );
        }

        return (
          <Folder
            key={item.id}
            folder={item}
            level={level}
            isSelected={isSelected}
            onClick={() => onSelect && onSelect(item.path)}
          />
        );
      })}
    </div>
  );
};

export default FileExplorer;