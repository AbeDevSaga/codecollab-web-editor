"use client";
import React, { useEffect, useRef, useState } from "react";
import ExplorerPanel from "../panels/ExplorerPanel";
import SearchPanel from "../panels/SearchPanel";
import SourceControlPanel from "../panels/SourceControlPanel";
import DebugPanel from "../panels/DebugPanel";
import ExtensionsPanel from "../panels/ExtensionsPanel";
import AdditionalViewsPanel from "../panels/AdditionalViewsPanel";
import AccountsPanel from "../panels/AccountsPanel";
import SettingsPanel from "../panels/SettingsPanel";
import VideoPanel from "../video/VideoPanel";

interface SideBarProps {
  activePanel: string | null;
  width: number;
  setWidth: (width: number) => void;
  setIsVideoPanelOpen: (isOpen: boolean) => void;
}

function SideBar({ activePanel, width, setWidth, setIsVideoPanelOpen }: SideBarProps) {
  const startX = useRef(0);
  const startWidth = useRef(0);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startX.current;
      let newWidth = startWidth.current + deltaX;
      newWidth = Math.max(200, Math.min(400, newWidth));
      setWidth(newWidth);
    };

    const stopResize = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, setWidth]);

  if (!activePanel) return null;

  return (
    <div
      className="bg-[#252526] border-r border-[#1e1e1e] relative flex flex-col"
      style={{ width: `${width}px` }}
    >
      {/* Resize handle */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1 cursor-col-resize hover:bg-[#007acc] active:bg-[#007acc]"
        onMouseDown={startResize}
      />

      {/* Panel content */}
      {activePanel === "files" && (
        <>
          <ExplorerPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "search" && (
        <>
          <SearchPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "sourceControl" && (
        <>
          <SourceControlPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "debug" && (
        <>
          <DebugPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "extensions" && (
        <>
          <ExtensionsPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "video" && (
        <>
          <VideoPanel setIsVideoPanelOpen={setIsVideoPanelOpen} />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "additional" && (
        <>
          <AdditionalViewsPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "accounts" && (
        <>
          <AccountsPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
      {activePanel === "settings" && (
        <>
          <SettingsPanel />
          <div className="p-2 bg-[#252526] flex-1">
            <div className="h-full bg-[#2d2d2d] rounded"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default SideBar;
