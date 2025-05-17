import React, { useState, useRef, useEffect } from 'react';
import { PiDotsThreeBold } from 'react-icons/pi';
import ExplorerSetting from '../../Setting/ExplorerSetting';

const ExplorerTab: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close if clicked outside both the button and dropdown
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className="h-8 flex items-center px-4 bg-[#252526] border-b border-[#1e1e1e] relative">
      <span className="text-xs font-semibold text-[#cccccc]">EXPLORER</span>
      <div className="ml-auto">
        <button
          ref={buttonRef}
          onClick={toggleSettings}
          className="p-1 text-[#d4d4d4] hover:bg-[#2a2d2e] rounded focus:outline-none"
          aria-label="Explorer settings"
          aria-expanded={showSettings}
        >
          <PiDotsThreeBold className="w-4 h-4" />
        </button>

        {showSettings && (
          <div className="absolute left-50 top-full mt-1 z-50" ref={dropdownRef}>
            <ExplorerSetting onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerTab;