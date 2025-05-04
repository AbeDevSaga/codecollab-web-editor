// app/editor/[workspaceId]/page.tsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";

import TitleBar from "./components/TitleBar";
import ActivityBar from "./components/ActivityBar";
import SideBar from "./components/sidebar/SideBar";
import StatusBar from "./components/statusbar/StatusBar";
import Terminal from "./components/terminal/Terminal";
import EditorSection from "./components/editor/EditorSection";
<<<<<<< HEAD
import VideoContainer from "./components/video/VideoContainer";
=======
import { AppDispatch, RootState } from "./redux/store";
import {
  initializeWorkspace,
  setActivePanel,
  setSidebarWidth,
  setTerminalHeight,
  setTerminalOpen,
} from "./redux/slices/editorSlice";
import { verifyToken } from "./redux/slices/tokenSlice";
>>>>>>> 156eadee4d008c03aabcfb06844839be0c9a5a20

function EditorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const user = useSelector((state: RootState) => state.token.user);
  const isLoading = useSelector((state: RootState) => state.token.isLoading);

  const { terminalOpen, terminalHeight, activePanel, sidebarWidth } =
    useSelector((state: RootState) => state.editor);

  // Video States
  const [isVideoPanelOpen, setIsVideoPanelOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!token) return;
    dispatch(verifyToken(token));
  }, [dispatch, token]);

  useEffect(() => {
    // Only initialize workspace after we have both the user and workspaceId
    if (user?._id) {
      dispatch(
        initializeWorkspace({
          workspaceId: user._id, // From URL params
          userId: user._id, // From verified token
        })
      );

      // Load saved terminal height
      const savedHeight = localStorage.getItem(`terminalHeight-${user._id}`);
      if (savedHeight) {
        dispatch(setTerminalHeight(parseInt(savedHeight, 10)));
      }
    }
  }, [dispatch, user?._id, isLoading]);

  const toggleTerminal = () => {
    dispatch(setTerminalOpen(!terminalOpen));
    if (!terminalOpen) {
      const savedHeight = localStorage.getItem(`terminalHeight-${user?._id}`);
      dispatch(
        setTerminalHeight(savedHeight ? parseInt(savedHeight, 10) : 200)
      );
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activePanel={activePanel}
<<<<<<< HEAD
          setActivePanel={setActivePanel}  />
        <SideBar
          activePanel={activePanel}
          width={sidebarWidth}
          setWidth={setSidebarWidth}
          setIsVideoPanelOpen={setIsVideoPanelOpen}
=======
          setActivePanel={(panel) => dispatch(setActivePanel(panel))}
        />
        <SideBar
          activePanel={activePanel}
          width={sidebarWidth}
          setWidth={(width) => dispatch(setSidebarWidth(width))}
>>>>>>> 156eadee4d008c03aabcfb06844839be0c9a5a20
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