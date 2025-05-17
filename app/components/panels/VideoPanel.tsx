import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllChats, fetchChatById } from "@/app/redux/slices/chatGroupSlice";
import { TUser } from "@/app/types/type";

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

  // useEffect(() => {
  //   if (currentChat?.participants) {
  //     const formattedMembers = currentChat.participants.map(participant => ({
  //       _id: participant.user._id,
  //       username: participant.user.username,
  //       email: participant.user.email,
  //       role: participant.role, // Using the role from participant section
  //       profileImage: participant.user.profileImage,
  //       status: participant.status
  //     }));
  //     setMembers(formattedMembers);
  //   }
  // }, [currentChat]);

  console.log()
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
  );
};

export default VideoPanel;
