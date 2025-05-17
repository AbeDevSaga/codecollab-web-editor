import React from "react";
import { PiDotsThreeBold } from "react-icons/pi";
import { VscPlay, VscSplitHorizontal, VscGitCompare } from "react-icons/vsc";

function TitleBar() {
  return (
    <div className="h-8 bg-[#3c3c3c] flex items-center px-4 drag-region">
      <div className="flex space-x-2 mr-4 no-drag">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>
      <span className="text-sm">Code Collab IDE</span>
      <div className="ml-auto space-x-3">
        <button title="Run">
          <VscPlay className="w-6 h-6 " />
        </button>
        <button title="Compare">
          <VscGitCompare className="w-6 h-6" />
        </button>
        <button title="Split View">
          <VscSplitHorizontal className="w-6 h-6" />
        </button>
        <button title="More Options">
          <PiDotsThreeBold className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
