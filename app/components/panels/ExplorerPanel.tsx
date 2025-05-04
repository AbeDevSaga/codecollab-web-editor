import React, { useEffect } from "react";
import ExplorerTab from "./tabs/ExplorerTab";
import FileExplorer from "./bodies/FileExplorer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllFiles } from "@/app/redux/slices/fileSlice";

function ExplorerPanel() {
  const files = useSelector((state: RootState) => state.file.files);
  const dispatch = useDispatch<AppDispatch>();
  if (!files) {
    useEffect(()=> {
      dispatch(fetchAllFiles());
    })
  }
  return (
    <div className="flex flex-col h-full w-full bg-[#252526]">
      <ExplorerTab />

      {/* Content section - takes remaining space */}
      <div className="flex-1 bg-[#1e1e1e] overflow-auto scrollbar-transparent">
        {/* Your explorer content goes here */}
        <FileExplorer files={files} />
      </div>
    </div>
  );
}

export default ExplorerPanel;
