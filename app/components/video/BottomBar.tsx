import { videoSocketService } from '@/app/sockets/videoSocketService';
import React, { useState } from 'react';
import { FiMic, FiVideo, FiPhoneOff, FiMicOff, FiVideoOff } from 'react-icons/fi';

interface BottomBarProps {
  stream: MediaStream;
  isLocal: boolean;
  onCallEnd: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ stream, isLocal,onCallEnd  }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleAudio = () => {
    const newMutedState = !isMuted;
    stream.getAudioTracks().forEach(track => {
      track.enabled = !newMutedState;
    });
    setIsMuted(newMutedState);
    
    if (isLocal) {
      // Notify server about mute state change
      videoSocketService.toggleAudioMute(newMutedState);
    }
  };

  const toggleVideo = () => {
    const newVideoState = !isVideoOff;
    stream.getVideoTracks().forEach(track => {
      track.enabled = !newVideoState;
    });
    setIsVideoOff(newVideoState);
    
    if (isLocal) {
      // Notify server about video state change
      videoSocketService.toggleVideoMute(newVideoState);
    }
  };

  return (
    <div className="w-full bg-black bg-opacity-60 text-white px-3 py-2 flex items-center justify-center space-x-4 rounded-b-md">
      <button
        onClick={toggleAudio}
        className={`${isMuted ? 'text-red-400' : 'text-white'} hover:text-${isMuted ? 'red-300' : 'gray-300'} transition-colors duration-200`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <FiMicOff size={18} /> : <FiMic size={18} />}
      </button>

      <button
        onClick={toggleVideo}
        className={`${isVideoOff ? 'text-red-400' : 'text-white'} hover:text-${isVideoOff ? 'red-300' : 'gray-300'} transition-colors duration-200`}
        title={isVideoOff ? "Turn on video" : "Turn off video"}
      >
        {isVideoOff ? <FiVideoOff size={18} /> : <FiVideo size={18} />}
      </button>

      {isLocal && (
        <button
          onClick={() => onCallEnd()}
          className="text-red-600 hover:text-red-500 transition-colors duration-200"
          title="End Call"
        >
          <FiPhoneOff size={18} />
        </button>
      )}
    </div>
  );
};

export default BottomBar;