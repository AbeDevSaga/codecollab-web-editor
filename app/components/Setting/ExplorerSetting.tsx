// components/panels/tabs/ExplorerSetting.tsx
import React from 'react';

interface ExplorerSettingProps {
  onClose?: () => void;
}

const ExplorerSetting: React.FC<ExplorerSettingProps> = ({ onClose }) => {
  return (
    <div className="w-48 bg-[#252526] border border-[#1e1e1e] shadow-lg rounded-md p-1 text-sm text-[#cccccc]">
      <button 
        className="w-full text-left p-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
        onClick={onClose}
      >
        Refresh Explorer
      </button>
      <button 
        className="w-full text-left p-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
        onClick={onClose}
      >
        Collapse All
      </button>
      <button 
        className="w-full text-left p-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
        onClick={onClose}
      >
        Explorer Settings
      </button>
    </div>
  );
};

export default ExplorerSetting;