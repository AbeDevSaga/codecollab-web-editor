import React from "react";
import BottomBar from "./BottomBar";

interface VideoGridProps {
  isMaximized: boolean;
  containerWidth: number;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  isMaximized,
  containerWidth,
}) => {
  // Calculate columns based on container width and maximized state
  const getGridColumns = () => {
    if (isMaximized) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }

    if (containerWidth >= 1000) return "grid-cols-3";
    if (containerWidth >= 700) return "grid-cols-2";
    return "grid-cols-1";
  };

  return (
    <div className={`grid gap-4 p-4 h-full ${getGridColumns()}`}>
      {[1, 2, 3, 4, 5, 6].map((cam, idx) => (
        <div
          key={idx}
          className="bg-[#252526] border border-[#454545] rounded-md overflow-hidden flex flex-col"
          style={{ minHeight: "200px" }}
        >
          {/* Top Bar */}
          <div className="h-6 flex items-center px-3 bg-[#333333]">
            <span className="text-xs font-semibold text-[#d4d4d4]">
              Camera {cam}
            </span>
          </div>

          {/* Video Area */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <span className="text-sm text-[#d4d4d4]">Video Feed {cam}</span>
          </div>

          {/* Bottom Bar */}
          {/* <BottomBar /> */}
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
