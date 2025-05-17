import React, { useEffect } from "react";
import ExplorerTab from "./tabs/ExplorerTab";
import FileExplorer from "./bodies/FileExplorer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllFiles } from "@/app/redux/slices/fileSlice";
import { openFile } from "@/app/redux/slices/editorSlice";
import { TFile } from "@/app/types/type";
import RootFolder from "./bodies/RootFolder";

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
  const handleFileSelect = (file: TFile) => {
    console.log("Selected file:", file);
    if (file.type === "file") {
      dispatch(
        openFile({
          workspaceId: currentWorkspace || currentUser || "",
          file,
        })
      );
      console.log("Dispatching openFile:", {
        workspaceId: currentWorkspace || currentUser,
        file,
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full ">
      <ExplorerTab />
      <RootFolder />

      {/* Content section - takes remaining space */}
      <div className="flex-1 overflow-auto scrollbar-transparent">
        {/* Your explorer content goes here */}
        <FileExplorer files={files || []} onFileSelect={handleFileSelect} />
      </div>
    </div>
  );
}

export default ExplorerPanel;
