import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllChats, fetchChatById } from "@/app/redux/slices/chatGroupSlice";
import { TUser } from "@/app/types/type";
import { GoDeviceCameraVideo } from "react-icons/go";


interface VideoPanelProps {
  setIsVideoPanelOpen: (isOpen: boolean) => void;
}
const VideoPanel: React.FC<VideoPanelProps> = ({ setIsVideoPanelOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [members, setMembers] = useState<TUser[]>([]);
  const {chats, currentChat} = useSelector(
    (state: RootState) => state.chatGroup
  );
  const user = useSelector(
    (state: RootState) => state.token.user
  );
  useEffect(() => {
    if (!chats) {
      dispatch(fetchAllChats());
    } else {
      dispatch(fetchChatById(chats[0]._id || ""))
    }
  }, [dispatch, chats]);



  return (
    <div className="w-full flex flex-col min-h-screen bg-[#252526] border-b border-[#1e1e1e]  text-white rounded-lg ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-center">Video Conference</h2>
      
      </div>

      {/* Pre-call View */}
      <div className="flex flex-col items-center p-8 space-y-6 flex-grow">
        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
          <GoDeviceCameraVideo size={40} className="text-gray-400" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium">Start a new video call</h3>
          <p className="text-gray-400 max-w-md">
            Connect with your team members through high-quality video conferencing.
            Share your screen, collaborate in real-time, and stay productive.
          </p>
        </div>

        <button
           onClick={() => setIsVideoPanelOpen(true)}
          className="w-full max-w-md py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <GoDeviceCameraVideo size={18} />
          <span>Start Call</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPanel;