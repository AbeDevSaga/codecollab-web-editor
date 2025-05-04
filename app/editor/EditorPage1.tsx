"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleBar from "./components/TitleBar";
import ActivityBar from "./components/ActivityBar";
import SideBar from "./components/sidebar/SideBar";
import StatusBar from "./components/statusbar/StatusBar";
import Terminal from "./components/terminal/Terminal";
import EditorSection from "./components/editor/EditorSection";
import { AppDispatch, RootState } from "./redux/store";
import { useParams } from "next/navigation";
import { setActivePanel, setSidebarWidth, setTerminalHeight, setTerminalOpen } from "./redux/slices/editorSlice";

function EditorPage() {

  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

   // Select state from Redux
   const { 
    terminalOpen, 
    terminalHeight, 
    activePanel, 
    sidebarWidth 
  } = useSelector((state: RootState) => state.editor);

  useEffect(() => {
    const savedHeight = localStorage.getItem(`terminalHeight-${workspaceId}`);
    if (savedHeight) {
      dispatch(setTerminalHeight(parseInt(savedHeight, 10)));
    }
  }, [dispatch, workspaceId]);

  const toggleTerminal = () => {
    dispatch(setTerminalOpen(!terminalOpen));
    if (!terminalOpen) {
      const savedHeight = localStorage.getItem(`terminalHeight-${workspaceId}`);
      dispatch(setTerminalHeight(savedHeight ? parseInt(savedHeight, 10) : 200));
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
