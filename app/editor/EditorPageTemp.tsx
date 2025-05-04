"use client";
import React, { useState, useEffect } from "react";
import TitleBar from "../components/TitleBar";
import ActivityBar from "../components/ActivityBar";
import SideBar from "../components/sidebar/SideBar";
import StatusBar from "../components/statusbar/StatusBar";
import Terminal from "../components/terminal/Terminal";
import EditorSection from "../components/editor/EditorSection";

function EditorPage() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [activePanel, setActivePanel] = useState<string | null>("files");
  const [sidebarWidth, setSidebarWidth] = useState(250);

  useEffect(() => {
    const savedHeight = localStorage.getItem("terminalHeight");
    if (savedHeight) {
      setTerminalHeight(parseInt(savedHeight, 10));
    }
  }, []);

  const toggleTerminal = () => {
    setTerminalOpen(!terminalOpen);
    if (!terminalOpen) {
      const savedHeight = localStorage.getItem("terminalHeight");
      setTerminalHeight(savedHeight ? parseInt(savedHeight, 10) : 200);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
        <SideBar
          activePanel={activePanel}
          width={sidebarWidth}
          setWidth={setSidebarWidth}
        />
        <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
          <EditorSection />
          <Terminal
            terminalOpen={terminalOpen}
            terminalHeight={terminalHeight}
            setTerminalHeight={setTerminalHeight}
            setTerminalOpen={setTerminalOpen}
          />
        </div>
      </div>
      <StatusBar
        terminalOpen={terminalOpen}
        onTerminalToggle={toggleTerminal}
      />
    </div>
  );
}

export default EditorPage;
