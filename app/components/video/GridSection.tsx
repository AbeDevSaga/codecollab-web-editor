import React from 'react';
import BottomBar from './BottomBar';

interface VideoGridProps {
  isMaximized: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ isMaximized }) => {
  return (
    <div
      className={`grid gap-4 p-4 h-[calc(100vh-14rem)] ${
        isMaximized ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
      }`}
    >    
     
      {[1, 2, 3].map((cam, idx) => (
        <div
          key={idx}
          className="bg-[#252526] border border-[#454545] rounded-md overflow-hidden flex flex-col h-full"
        >
          {/* Top Bar */}
          <div className="h-6 flex items-center px-3 bg-[#333333]">
            <span className="text-xs font-semibold text-[#d4d4d4]">Camera {cam}</span>
          </div>

          {/* Video Area */}
          <div className="flex-1 bg-black flex items-center justify-center min-h-[150px]">
            <span className="text-sm text-[#d4d4d4]">Video Feed {cam}</span>
          </div>

          {/* Bottom Bar */}
          <BottomBar />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
