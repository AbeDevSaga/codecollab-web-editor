// app/editor/[workspaceId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import TitleBar from "./components/TitleBar";
import ActivityBar from "./components/ActivityBar";
import SideBar from "./components/sidebar/SideBar";
import StatusBar from "./components/statusbar/StatusBar";
import Terminal from "./components/terminal/Terminal";
import EditorSection from "./components/editor/EditorSection";
import VideoContainer from "./components/video/VideoContainer";
import { AppDispatch, RootState } from "./redux/store";
import {
  setActivePanel,
  setSidebarWidth,
  setTerminalHeight,
  setTerminalOpen,
} from "./redux/slices/editorSlice";

function EditorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.token.user);
  console.log("User from Redux:", user);
  const { terminalOpen, terminalHeight, activePanel, sidebarWidth } =
    useSelector((state: RootState) => state.editor);

  // Video States
  const [isVideoPanelOpen, setIsVideoPanelOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleTerminal = () => {
    dispatch(setTerminalOpen(!terminalOpen));
    if (!terminalOpen) {
      const savedHeight = localStorage.getItem(`terminalHeight-${user?._id}`);
      dispatch(
        setTerminalHeight(savedHeight ? parseInt(savedHeight, 10) : 200)
      );
    }
  };


  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activePanel={activePanel}
          setActivePanel={(panel) => dispatch(setActivePanel(panel))}
        />
        <SideBar
          activePanel={activePanel}
          width={sidebarWidth}
          setWidth={(width) => {
            dispatch(setSidebarWidth(width));
            if (user?._id) {
              localStorage.setItem(
                `sidebarWidth-${user._id}`,
                width.toString()
              );
            }
          }}
          setIsVideoPanelOpen={setIsVideoPanelOpen}
        />
        <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
          <EditorSection workspaceId={user?._id || ""} />
          <Terminal
            terminalOpen={terminalOpen}
            terminalHeight={terminalHeight}
            setTerminalHeight={(height) => {
              dispatch(setTerminalHeight(height));
              if (user?._id) {
                localStorage.setItem(
                  `terminalHeight-${user._id}`,
                  height.toString()
                );
              }
            }}
            setTerminalOpen={(open) => dispatch(setTerminalOpen(open))}
          />
        </div>
        {isVideoPanelOpen && (
          <VideoContainer
            setIsVideoPanelOpen={setIsVideoPanelOpen}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            // setTerminalOpen={setTerminalOpen}
            // terminalOpen={terminalOpen}
            // terminalHeight={terminalHeight}
            // setTerminalHeight={setTerminalHeight}
            // setSidebarWidth={setSidebarWidth}
          />
        )}
      </div>
      <StatusBar
        terminalOpen={terminalOpen}
        onTerminalToggle={toggleTerminal}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
      />
    </div>
  );
}

export default EditorPage;
