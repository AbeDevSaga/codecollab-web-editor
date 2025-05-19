import React from "react";
import { FiPhoneCall, FiX } from "react-icons/fi";
import { TUser } from "../../types/type";

interface userPanelProps {
  user: TUser;
  currentChatId: string;
  onCallStart: (userId: string) => void;
  onCallEnd: () => void;
  isCallActive: boolean;
}
const UserVideoPanel: React.FC<userPanelProps> = ({
  user,
  currentChatId,
  onCallStart,
  onCallEnd,
  isCallActive,
}) => {
  const handleCallClick = () => {
    if (isCallActive) {
      onCallEnd();
    } else {
      console.log("user id: ", user._id)
      onCallStart(user._id);
    }
  };
  return (
    <div
      key={user._id}
      className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg"
    >
      <div className="flex items-center space-x-3">
        <img
          src={user.profileImage}
          alt={user.username}
          className="w-10 h-10 rounded-full border border-gray-500"
        />
        <span className="text-sm">{user.username}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleCallClick}
          className={`${
            isCallActive ? "text-red-400" : "text-green-400"
          } hover:text-${
            isCallActive ? "red-300" : "green-300"
          } cursor-pointer`}
          title={isCallActive ? "End Call" : "Start Call"}
        >
          {isCallActive ? <FiX size={18} /> : <FiPhoneCall size={18} />}
        </button>
      </div>
    </div>
  );
};

export default UserVideoPanel;
