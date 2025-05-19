import React, { useState, useRef, useEffect } from "react";
import VideoGrid from "./GridSection";
import TabBar from "./TabBar";
import SideBar from "./SideBar";
import VideoBar from "./VideoBar";
import { videoSocketService } from "@/app/sockets/videoSocketService";
import VideoItem from "./VideoItem";

interface RemoteStream {
  userId: string;
  stream: MediaStream;
}

interface CallState {
  isActive: boolean;
  participants: string[];
  currentChatId: string | null;
}

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
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    participants: [],
    currentChatId: null,
  });
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize video service
  // useEffect(() => {
  //   const token = localStorage.getItem("token"); // Get your auth token
  //   videoSocketService.connect(token || " ");

  //   videoSocketService.setRemoteStreamCallbacks(
  //     (userId, stream) => {
  //       setRemoteStreams((prev) => [...prev, { userId, stream }]);
  //     },
  //     (userId) => {
  //       setRemoteStreams((prev) =>
  //         prev.filter((stream) => stream.userId !== userId)
  //       );
  //     }
  //   );

  //   return () => {
  //     videoSocketService.disconnect();
  //   };
  // }, []);
  // Replace your current useEffect with this:
  useEffect(() => {
    const token = localStorage.getItem("token");
    videoSocketService.connect(token || " ");

    // Properly manage remote streams with no duplicates
    const handleStreamAdded = (userId: string, stream: MediaStream) => {
      setRemoteStreams((prev) => {
        // Filter out any existing stream for this user
        const filtered = prev.filter((s) => s.userId !== userId);
        return [...filtered, { userId, stream }];
      });
    };

    const handleStreamRemoved = (userId: string) => {
      setRemoteStreams((prev) => prev.filter((s) => s.userId !== userId));
    };

    videoSocketService.setRemoteStreamCallbacks(
      handleStreamAdded,
      handleStreamRemoved
    );

    return () => {
      videoSocketService.disconnect();
    };
  }, []);

  // const startCall = async (chatGroupId: string, participants: string[]) => {
  //   try {
  //     console.log("[1] Starting call process...");

  //     console.log("[2] Ensuring ready for broadcast...");
  //     await videoSocketService.ensureReadyForBroadcast(chatGroupId);
  //     console.log("[2] Broadcast ready confirmed");

  //     console.log("[3] Getting user media...");
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     console.log("[3] Got user media", stream.getTracks());

  //     if (localVideoRef.current) {
  //       console.log("[4] Setting local video stream");
  //       localVideoRef.current.srcObject = stream;
  //     }

  //     console.log("[5] Starting broadcasting...");
  //     await videoSocketService.startBroadcasting(stream);
  //     console.log("[5] Broadcasting started");

  //     setCallState({
  //       isActive: true,
  //       participants,
  //       currentChatId: chatGroupId,
  //     });
  //     console.log("[6] Call state updated");
  //   } catch (error) {
  //     console.error("Error starting call:", error);
  //   }
  // };
  const startCall = async (chatGroupId: string, participants: string[]) => {
    try {
      console.log("[1] Starting call process...");

      console.log("[2] Ensuring ready for broadcast...");
      const joinResult = await videoSocketService.joinRoom(chatGroupId);
      console.log("[2] Broadcast ready confirmed", joinResult);

      console.log("[3] Getting user media...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Verify media tracks
      const tracks = stream.getTracks();
      console.log(
        "[3.1] Media tracks obtained:",
        tracks.map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState,
        }))
      );

      if (localVideoRef.current) {
        console.log("[4] Setting local video stream");
        localVideoRef.current.srcObject = stream;

        // Add event listeners to verify video element
        localVideoRef.current.onloadedmetadata = () => {
          console.log("[4.1] Local video metadata loaded");
        };
        localVideoRef.current.onerror = (e) => {
          console.error("[4.2] Local video error:", e);
        };
      }

      console.log("[5] Starting broadcasting...");
      await videoSocketService.startBroadcasting(stream);
      console.log("[5] Broadcasting started");

      setCallState({
        isActive: true,
        participants,
        currentChatId: chatGroupId,
      });
      console.log("[6] Call state updated");
    } catch (error) {
      console.error("Error starting call:", error);
      // Handle error state if needed
    }
  };
  const endCall = async () => {
    try {
      await videoSocketService.leaveRoom();
      videoSocketService.stopBroadcasting();

      // Stop all media tracks
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }

      setCallState({
        isActive: false,
        participants: [],
        currentChatId: null,
      });
      setRemoteStreams([]);
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isButton = target.tagName === "BUTTON" || target.closest("button");

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
    document.body.style.cursor = "nwse-resize";
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
      document.body.style.cursor = "";
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
      document.body.style.cursor = "";
    };
  }, [isDragging, isResizing, dragOffset, position]);

  const toggleMinimize = () => {
    setIsMinimized?.(!isMinimized);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      // Save current size before maximizing
      setSize((prev) => ({ ...prev }));
    }
  };

  const handleClose = () => {
    setIsVideoPanelOpen(false);
  };

  const renderVideoGrid = () => {
    // const allStreams = [
    //   ...remoteStreams,
    //   ...(localVideoRef.current?.srcObject
    //     ? [
    //         {
    //           userId: "local",
    //           stream: localVideoRef.current.srcObject as MediaStream,
    //         },
    //       ]
    //     : []),
    // ];
    const allStreams = [
      ...remoteStreams,
      ...(localStream ? [{ userId: "local", stream: localStream }] : []),
    ];

    console.log("Rendering streams:", allStreams);

    if (allStreams.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No active video streams</p>
        </div>
      );
    }

    const getGridColumns = () => {
      if (isMaximized) {
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      }
      if (size.width >= 1000) return "grid-cols-3";
      if (size.width >= 700) return "grid-cols-2";
      return "grid-cols-1";
    };

    return (
      <div className={`grid gap-4 p-4 h-full ${getGridColumns()}`}>
        {allStreams.map(({ userId, stream }) => (
          <VideoItem
            key={userId}
            stream={stream}
            isLocal={userId === "local"}
          />
        ))}
      </div>
    );
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
          width: isMaximized ? "100%" : `${size.width}px`,
          height: isMaximized ? "100%" : `${size.height}px`,
          zIndex: 2100,
          display: isMinimized ? "none" : "block",
          cursor: isDragging ? "grabbing" : "default",
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
          <SideBar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            startCall={startCall}
            endCall={endCall}
          />
          <div className="flex-1 overflow-auto no-scrollbar px-1">
            {renderVideoGrid()}
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
