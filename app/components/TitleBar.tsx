import React from "react";

function TitleBar() {
  return (
    <div className="h-8 bg-[#3c3c3c] flex items-center px-4 drag-region">
      <div className="flex space-x-2 mr-4 no-drag">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
      </div>
      <span className="text-sm">Code Collab IDE</span>
    </div>
  );
}

export default TitleBar;
