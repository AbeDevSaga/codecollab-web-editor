"use client";
import React from "react";
import {
  VscFiles,
  VscDebugAlt,
  VscSearch,
  VscExtensions,
  VscSourceControl,
  VscAccount,
  VscSettingsGear,
} from "react-icons/vsc";
import { PiDotsThreeBold } from "react-icons/pi";
import { IoVideocamOutline } from "react-icons/io5";

interface ActivityBarProps {
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
}

function ActivityBar({ activePanel, setActivePanel }: ActivityBarProps) {
  const togglePanel = (panel: string) => {
    setActivePanel(activePanel === panel ? null : panel);
    console.log(`Toggled ${panel} panel`);
  };

  return (
    <div className="w-12 bg-[#37373d] flex flex-col items-center py-3 space-y-6">
      <button
        title="Files"
        onClick={() => togglePanel("files")}
        className={`p-1 rounded ${
          activePanel === "files" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscFiles className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        title="Search"
        onClick={() => togglePanel("search")}
        className={`p-1 rounded ${
          activePanel === "search" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscSearch className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        title="Source Control"
        onClick={() => togglePanel("sourceControl")}
        className={`p-1 rounded ${
          activePanel === "sourceControl"
            ? "bg-[#1e1e1e]"
            : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscSourceControl className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        title="Debug"
        onClick={() => togglePanel("debug")}
        className={`p-1 rounded ${
          activePanel === "debug" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscDebugAlt className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        title="Extensions"
        onClick={() => togglePanel("extensions")}
        className={`p-1 rounded ${
          activePanel === "extensions" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <VscExtensions className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        title="Video"
        onClick={() => togglePanel("video")}
        className={`p-1 rounded ${
          activePanel === "video" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <IoVideocamOutline className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <button
        title="More"
        onClick={() => togglePanel("additional")}
        className={`p-1 rounded ${
          activePanel === "additional" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
        }`}
      >
        <PiDotsThreeBold className="text-[#d4d4d4] w-6 h-6" />
      </button>
      <div className="mt-auto flex flex-col items-center space-y-6">
        <button
          title="Accounts"
          onClick={() => togglePanel("accounts")}
          className={`p-1 rounded ${
            activePanel === "accounts" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
          }`}
        >
          <VscAccount className="text-[#d4d4d4] w-6 h-6" />
        </button>
        <button
          title="Settings"
          onClick={() => togglePanel("settings")}
          className={`p-1 rounded ${
            activePanel === "settings" ? "bg-[#1e1e1e]" : "hover:bg-[#2a2d2e]"
          }`}
        >
          <VscSettingsGear className="text-[#d4d4d4] w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default ActivityBar;
