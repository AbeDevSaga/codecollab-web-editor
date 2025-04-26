"use client";
import React from "react";
import {
  VscFiles,
  VscDebugAlt,
  VscSearch,
  VscExtensions,
} from "react-icons/vsc";
import { PiDotsThreeBold } from "react-icons/pi";

interface ActivityBarProps {
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
}

function ActivityBar({ activePanel, setActivePanel }: ActivityBarProps) {
  const togglePanel = (panel: string) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="w-12 bg-[#37373d] flex flex-col items-center py-3 space-y-6">
      <button
        onClick={() => togglePanel("files")}
        className={`p-1 rounded ${
          activePanel === "files" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscFiles className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        onClick={() => togglePanel("search")}
        className={`p-1 rounded ${
          activePanel === "search" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscSearch className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        onClick={() => togglePanel("debug")}
        className={`p-1 rounded ${
          activePanel === "debug" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscDebugAlt className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        onClick={() => togglePanel("extensions")}
        className={`p-1 rounded ${
          activePanel === "extensions" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscExtensions className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <PiDotsThreeBold className="text-[#d4d4d4] w-6 h-6 mt-auto" />
    </div>
  );
}

export default ActivityBar;
