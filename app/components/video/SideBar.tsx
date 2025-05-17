import React, { useEffect, useState } from "react";
import { FiPhoneCall, FiX } from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchAllChats,
  fetchChatById,
} from "@/app/redux/slices/chatGroupSlice";
import { TUser } from "@/app/types/type";
import UserVideoPanel from "./UserVideoPanel";
import { formatChatMembers } from "@/app/utils/userUtils";
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, currentChat } = useSelector(
    (state: RootState) => state.chatGroup
  );
  const [members, setMembers] = useState<TUser[]>([]);
  useEffect(() => {
    if (!currentChat) {
      dispatch(fetchAllChats());
    } else {
      dispatch(fetchChatById(chats[0]._id || ""));
    }
  }, [dispatch, chats]);

  useEffect(() => {
    if (currentChat?.participants) {
      setMembers(formatChatMembers(currentChat.participants));
    }
  }, [currentChat]);
  return (
    <div
      className={`absolute top-0 right-0 h-full w-72 bg-[#1e1e1e] text-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-[#333]">
        <h2 className="text-lg font-semibold">Members</h2>
        <button
          onClick={onClose}
          title="cancle"
          className="text-gray-400 hover:text-red-400"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="h-[calc(100%-56px)] overflow-y-auto no-scrollbar">
        <div className="space-y-2 p-2">
          {members.map((member) => (
            <UserVideoPanel key={member._id} user={member} />
          ))}

          {members.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No members found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
