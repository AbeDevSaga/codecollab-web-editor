import React, { useState, useRef, useEffect } from "react";
import { FiMinus, FiMaximize2, FiX } from "react-icons/fi";
import VideoGrid from "./GridSection";
import TabBar from "./TabBar";
import SideBar from "./SideBar";
import VideoBar from "./VideoBar";

interface VideoContainerProps {
  setIsVideoPanelOpen: (isOpen: boolean) => void;
  isMinimized?: boolean;
  setIsMinimized?: (isMinimized: boolean) => void;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  setIsVideoPanelOpen,
  isMinimized,
  setIsMinimized,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 400, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const videoBarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isButton = target.tagName === 'BUTTON' || target.closest('button');
    
    if (!isButton && videoBarRef.current?.contains(target)) {
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true);
      }
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.cursor = 'nwse-resize';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    } else if (isResizing && !isMaximized) {
      const newWidth = Math.max(400, e.clientX - position.x);
      const newHeight = Math.max(300, e.clientY - position.y);
      setSize({
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isResizing) {
      setIsResizing(false);
      document.body.style.cursor = '';
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, isResizing, dragOffset, position]);

  const toggleMinimize = () => {
    setIsMinimized?.(!isMinimized);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      // Save current size before maximizing
      setSize(prev => ({ ...prev }));
    }
  };

  const handleClose = () => {
    setIsVideoPanelOpen(false);
  };

  return (
    !isMinimized && (
      <div
        ref={panelRef}
        className={`fixed bg-[#363691] border border-[#454545] rounded shadow-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 overflow-hidden ${
          isMaximized ? "w-full h-full top-0 left-0" : ""
        }`}
        style={{
          left: isMaximized ? 0 : `${position.x}px`,
          top: isMaximized ? 0 : `${position.y}px`,
          width: isMaximized ? '100%' : `${size.width}px`,
          height: isMaximized ? '100%' : `${size.height}px`,
          zIndex: 2100,
          display: isMinimized ? "none" : "block",
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        <VideoBar 
          ref={videoBarRef}
          isMaximized={isMaximized}
          onMouseDown={handleMouseDown}
          onMaximize={toggleMaximize}
          onMinmize={toggleMinimize}
          onClose={handleClose}
        />

        <div className="h-[calc(100%-2rem)] flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
          <TabBar setSidebarOpen={setSidebarOpen} />
          <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 overflow-auto no-scrollbar px-1">
            <VideoGrid isMaximized={isMaximized} containerWidth={size.width} />
          </div>
        </div>

        {!isMaximized && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-[#454545]"
            onMouseDown={handleResizeMouseDown}
          />
        )}
      </div>
    )
  );
};

export default VideoContainer;