import React, { useState } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import SideBar from "./SideBar";

interface tabBarProps {
  setSidebarOpen: (open: boolean) => void;
}
const TabBar: React.FC<tabBarProps> = ({setSidebarOpen}) => {
  return (
    <div className="sticky w-full bg-black text-white px-4 py-2 flex items-center justify-between shadow-md border-b border-[#2a2a2a] z-50">
      {/* Left Side: Avatar and Name */}
      <div className="flex items-center space-x-3">
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          className="w-10 h-10 rounded-full border border-gray-500 shadow-sm"
        />
        <span className="text-base font-medium tracking-wide">John Doe</span>
      </div>

      {/* Right Side: Icons */}
      <div className="flex items-center space-x-4">
        <button
          className="hover:text-blue-400 transition-colors duration-200"
          title="Notifications"
        >
          <FiBell size={20} />
        </button>
        <button
          className="hover:text-blue-400 transition-colors duration-200"
          title="Menu"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu size={20} />
        </button>
      </div>
    </div>
  );
};

export default TabBar;
