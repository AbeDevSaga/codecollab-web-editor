import React from "react";
import ExplorerTab from "./tabs/ExplorerTab";
import FileExplorer from "./bodies/FileExplorer";
import { fileTreeData } from "@/app/types/fileTree";

function ExplorerPanel() {
  return (
    <div className="flex flex-col h-full w-full bg-[#252526]">
      <ExplorerTab />

      {/* Content section - takes remaining space */}
      <div className="flex-1 bg-[#1e1e1e] overflow-auto scrollbar-transparent">
        {/* Your explorer content goes here */}
        <FileExplorer data={fileTreeData} />
      </div>
    </div>
  );
}

export default ExplorerPanel;
