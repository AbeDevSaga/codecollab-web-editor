import React from 'react'
import { PiDotsThreeBold } from "react-icons/pi";

interface ExplorerTabProps {
  
}
const Tab: React.FC<ExplorerTabProps> = ({}) => {
  return (
    <div className="h-8 flex items-center px-4 bg-[#252526] border-b border-[#1e1e1e]">
      <span className="text-xs font-semibold text-[#cccccc]">EXPLORER</span>
      <div className="ml-auto">
        <PiDotsThreeBold className="text-[#d4d4d4] w-4 h-4 hover:bg-[#2a2d2e] rounded" />  
      </div>
    </div>
  )
}

export default Tab;