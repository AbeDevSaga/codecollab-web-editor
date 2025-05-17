import React from "react";
import { FiPhoneCall, FiX } from "react-icons/fi";
import { TUser } from "../../types/type";

interface userPanelProps {
  user: TUser;
}
const UserVideoPanel: React.FC<userPanelProps> = ({ user }) => {
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
        <button className="text-green-400 hover:text-green-300 cursor-pointer" title="Call">
          <FiPhoneCall size={18} />
        </button>
      </div>
    </div>
  );
};

export default UserVideoPanel;
