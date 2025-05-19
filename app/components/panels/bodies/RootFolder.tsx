import React, { useState, useRef, useEffect } from 'react';
import { VscNewFile, VscNewFolder, VscCollapseAll, VscRefresh } from "react-icons/vsc";

function RootFolder() {
  const [files, setFiles] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null);
  const [tempName, setTempName] = useState('');
  const rootFolderRef = useRef<HTMLDivElement>(null);

  // Handle click outside to cancel creation
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootFolderRef.current && !rootFolderRef.current.contains(event.target as Node)) {
        handleCancelCreate();
      }
    };

    if (creatingType) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [creatingType]);

  const handleConfirmCreate = () => {
    const name = tempName.trim();
    if (name) {
      if (creatingType === 'file') {
        setFiles(prev => [name, ...prev]);
      } else if (creatingType === 'folder') {
        setFolders(prev => [name, ...prev]);
      }
    }
    setCreatingType(null);
    setTempName('');
  };

  const handleCancelCreate = () => {
    setCreatingType(null);
    setTempName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirmCreate();
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  const handleCreateFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreatingType('file');
    setTempName('');
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreatingType('folder');
    setTempName('');
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Refreshing...");
    setFiles([]);
    setFolders([]);
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(prev => !prev);
  };

  return (
    <div 
      className='w-full relative group bg-[#252526] text-white rounded'
      ref={rootFolderRef}
      onClick={() => {
        if (creatingType) handleCancelCreate();
      }}
    >
      <div className='flex items-center justify-between p-2 border-b border-gray-600'>
        <div className='flex-1 min-w-0'>
          <span className='group-hover:truncate block group-hover:whitespace-nowrap font-semibold'>
            RootFolderrrrrrr
          </span>
        </div>

        <div className='flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button 
            className='p-1 hover:bg-gray-600 rounded' 
            onClick={handleCreateFile} 
            title="Create File"
          >
            <VscNewFile size={16} />
          </button>
          <button 
            className='p-1 hover:bg-gray-600 rounded' 
            onClick={handleCreateFolder} 
            title="Create Folder"
          >
            <VscNewFolder size={16} />
          </button>
          <button 
            className='p-1 hover:bg-gray-600 rounded' 
            onClick={handleRefresh} 
            title="Refresh"
          >
            <VscRefresh size={16} />
          </button>
          <button 
            className='p-1 hover:bg-gray-600 rounded' 
            onClick={handleCollapse} 
            title="Collapse"
          >
            <VscCollapseAll size={16} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-2 space-y-1">
          {creatingType && (
            <div 
              className="flex items-center space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{creatingType === 'folder' ? '📁' : '📄'}</span>
              <input
                type="text"
                className="bg-gray-700 border border-gray-500 rounded px-2 py-1 w-full text-white focus:outline-none"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder={`Enter ${creatingType} name`}
                onBlur={handleConfirmCreate}
              />
            </div>
          )}
          {folders.map((folder, index) => (
            <div key={`folder-${index}`} className="text-yellow-400">📁 {folder}</div>
          ))}
          {files.map((file, index) => (
            <div key={`file-${index}`} className="text-blue-400">📄 {file}</div>
          ))}
          {/* {files.length === 0 && folders.length === 0 && !creatingType && (
            <div className="text-gray-400 italic">No files or folders</div>
          )} */}
        </div>
      )}
    </div>
  );
}

export default RootFolder;