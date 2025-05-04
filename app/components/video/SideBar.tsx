import React from 'react';
import { FiPhoneCall, FiX } from 'react-icons/fi';

const members = [
  { id: 1, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Bob Smith', avatar: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Carol Davis', avatar: 'https://via.placeholder.com/40' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`absolute top-0 right-0 h-full w-72 bg-[#1e1e1e] text-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-[#333]">
        <h2 className="text-lg font-semibold">Members</h2>
        <button onClick={onClose} title="cancle" className="text-gray-400 hover:text-red-400">
          <FiX size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full border border-gray-500"
              />
              <span className="text-sm">{member.name}</span>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-green-400 hover:text-green-300"
                title="Call"
              >
                <FiPhoneCall size={18} />
              </button>
              <button
                className="text-red-400 hover:text-red-300"
                title="Decline"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
