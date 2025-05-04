import React from 'react';
import { FiMic, FiVideo, FiPhoneOff } from 'react-icons/fi';

const BottomBar = () => {
  return (
    <div className="w-full bg-black bg-opacity-60 text-white px-3 py-2 flex items-center justify-center space-x-4 rounded-b-md">
      <button
        className="hover:text-green-400 transition-colors duration-200"
        title="Toggle Microphone"
      >
        <FiMic size={18} />
      </button>

      <button
        className="hover:text-blue-400 transition-colors duration-200"
        title="Toggle Camera"
      >
        <FiVideo size={18} />
      </button>

      <button
        className="text-red-600 hover:text-red-500 transition-colors duration-200"
        title="End Call"
      >
        <FiPhoneOff size={18} />
      </button>
    </div>
  );
};

export default BottomBar;
