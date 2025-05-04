import React, { useState, useRef, useEffect } from 'react';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';
import VideoGrid from './GridSection';
import TabBar from './TabBar';

interface VideoContainerProps {
  setIsVideoPanelOpen: (isOpen: boolean) => void;
  isMinimized?: boolean;
  setIsMinimized?: (isMinimized: boolean) => void;
}

const VideoContainer: React.FC<VideoContainerProps> = ({
  setIsVideoPanelOpen,
  isMinimized,
  setIsMinimized
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 400, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleMinimize = () => {
    setIsMinimized?.(!isMinimized);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    setIsVideoPanelOpen(false);
  };

  return (
    <>
      {!isMinimized && (
        <div
          ref={panelRef}
          className={`fixed bg-[#363691] border border-[#454545] rounded shadow-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 overflow-hidden ${
            isMaximized ? 'w-full h-full top-0 left-0' : 'w-[800px] h-[500px]'
          }`}
          style={{
            left: isMaximized ? 0 : `${position.x}px`,
            top: isMaximized ? 0 : `${position.y}px`,
            zIndex: 2100,
            display: isMinimized ? 'none' : 'block',
            cursor: isDragging ? 'grabbing' : 'move',
          }}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            const tagName = target.tagName.toLowerCase();
            const isButtonClick = tagName === 'button' || target.closest('button');
            if (!isButtonClick) handleMouseDown(e);
          }}
        >
          <div
            className="h-8 flex items-center px-2 bg-[#333333] cursor-move select-none"
            onMouseDown={handleMouseDown}
          >
            <span className="text-xs font-semibold text-[#d4d4d4]">Video Panel</span>
            <div className="ml-auto flex space-x-2">
              <button
                onClick={toggleMinimize}
                className="text-[#d4d4d4] hover:bg-[#454545] p-1 rounded"
                title="Minimize"
              >
                <FiMinus size={14} />
              </button>
              <button
                onClick={toggleMaximize}
                className="text-[#d4d4d4] hover:bg-[#454545] p-1 rounded"
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                <FiMaximize2 size={14} />
              </button>
              <button
                onClick={handleClose}
                className="text-[#d4d4d4] hover:bg-[#f04747] p-1 rounded"
                title="Close"
              >
                <FiX size={14} />
              </button>
            </div>
          </div>

          <div className="h-[calc(100%-2rem)] flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
            <TabBar />
            <div className="flex-1 overflow-auto px-1">
              <VideoGrid isMaximized={false} />
            </div>
          </div>
        </div>
      )}

      {isMinimized && (
        <div
          className="fixed bottom-0 left-0 bg-[#333333] px-3 py-1 rounded-tr cursor-pointer"
          onClick={toggleMinimize}
        >
          <span className="text-xs text-[#d4d4d4]">Video Panel</span>
        </div>
      )}
    </>
  );
};

export default VideoContainer;