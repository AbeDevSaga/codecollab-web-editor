import React from 'react';

import { VscNewFile, VscNewFolder, VscCollapseAll, VscRefresh } from "react-icons/vsc";
function RootFolder() {
  return (
    <div className='w-full relative group'>
      <div className='flex items-center justify-between p-2'>
       <div className='flex-1 min-w-0'>
          <span className='group-hover:truncate block group-hover:whitespace-nowrap'>
            RootFolderrrrrrrrrrr
          </span>
        </div>
        
        <div className='flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button 
            className='p-1 text-white hover:bg-gray-400 rounded'
            title="Create File"
          >
            <VscNewFile size={16} />
          </button>
          <button 
            className='p-1 text-white hover:bg-gray-400 rounded'
            title="Create Folder"
          >
            <VscNewFolder size={16} />
          </button>
           <button 
            className='p-1 text-white hover:bg-gray-400 rounded'
            title="Refresh"
          >
            <VscRefresh size={16} />
          </button>
          <button 
            className='p-1 text-white hover:bg-gray-400 rounded'
            title="Collapse"
          >
            <VscCollapseAll size={16} />
          </button>
         
        </div>
      </div>
    </div>
  );
}

export default RootFolder;