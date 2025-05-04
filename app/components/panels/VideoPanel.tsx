import React from 'react'

interface VideoPanelProps {
  setIsVideoPanelOpen: (isOpen: boolean) => void
}
const VideoPanel:React.FC<VideoPanelProps> = ({setIsVideoPanelOpen}) => {
  return (
    <div className="h-8 flex flex-col items-center px-2 bg-[#252526] ">
      <span className="text-xs font-semibold">VideoPanel</span>
      <button
        className="ml-auto text-xs font-semibold text-[#d4d4d4] hover:text-[#ffffff]"
        onClick={() => setIsVideoPanelOpen(true)}
      >
        Open
      </button>
    </div>
  )
}

export default VideoPanel