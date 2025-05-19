import React, { useEffect } from "react";
import ExplorerTab from "./tabs/ExplorerTab";
import FileExplorer from "./bodies/FileExplorer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllFiles, fetchFileById } from "@/app/redux/slices/fileSlice";
import { openFile } from "@/app/redux/slices/editorSlice";
import { TFile } from "@/app/types/type";
import RootFolder from "./bodies/RootFolder";
import { socketService } from "@/app/services/socketService";

function ExplorerPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const files = useSelector((state: RootState) => state.file.files);
  const currentWorkspace = useSelector(
    (state: RootState) => state.editor.currentWorkspace
  );
  const currentUser = useSelector((state: RootState) => state.token.user?._id);


  useEffect(() => {
    if (!files) {
      dispatch(fetchAllFiles());
    }
  }, [dispatch, files]);

  const handleFileSelect = async (file: TFile) => {
    console.log("Selected file:", file);
    if (file.type === "file") {
      try {
        // First try to fetch fresh content via socket
        const content = await socketService.getFileContent(
          file.path, 
          currentWorkspace || currentUser || ""
        );
        
        // Dispatch with fresh content
        dispatch(
          openFile({
            workspaceId: currentWorkspace || currentUser || "",
            file: {
              ...file,
              content
            },
            forceRefresh: true
          })
        );
      } catch (error) {
        console.error("Failed to fetch file content:", error);
        // Fallback to opening file with existing content
        dispatch(
          openFile({
            workspaceId: currentWorkspace || currentUser || "",
            file
          })
        );
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ExplorerTab />
      <RootFolder />

      <div className="flex-1 overflow-auto scrollbar-transparent">
        <FileExplorer files={files || []} onFileSelect={handleFileSelect} />
      </div>
    </div>
  );
}

export default ExplorerPanel;