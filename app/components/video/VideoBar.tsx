import React, { forwardRef } from "react";
import { FiMinus, FiMaximize2, FiX } from "react-icons/fi";

interface VideoBarProps {
    isMaximized: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onMinmize: () => void;
    onMaximize: () => void;
    onClose: () => void;
}

const VideoBar = forwardRef<HTMLDivElement, VideoBarProps>(({
    isMaximized,
    onMouseDown,
    onMinmize,
    onMaximize,
    onClose
}, ref) => {
  return (
    <div
      ref={ref}
      className="h-8 flex items-center px-2 bg-[#333333] cursor-move select-none"
      onMouseDown={onMouseDown}
    >
      <span className="text-xs font-semibold text-[#d4d4d4]">Video Panel</span>
      <div className="ml-auto flex space-x-2">
        <button
          onClick={onMinmize}
          className="text-[#d4d4d4] hover:bg-[#454545] p-1 rounded"
          title="Minimize"
        >
          <FiMinus size={14} />
        </button>
        <button
          onClick={onMaximize}
          className="text-[#d4d4d4] hover:bg-[#454545] p-1 rounded"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          <FiMaximize2 size={14} />
        </button>
        <button
          onClick={onClose}
          className="text-[#d4d4d4] hover:bg-[#f04747] p-1 rounded"
          title="Close"
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  );
});

VideoBar.displayName = "VideoBar";

export default VideoBar;