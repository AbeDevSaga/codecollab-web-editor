import React, { useEffect, useRef } from "react";
import BottomBar from "./BottomBar";

interface VideoItemProps {
  stream: MediaStream;
  isLocal: boolean;
  onCallEnd: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ stream, isLocal, onCallEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log(`VideoItem useEffect - stream:`, stream);
    console.log(`VideoItem mounted - isLocal: ${isLocal}`, {
      streamId: stream?.id,
      active: stream?.active,
      tracks: stream?.getTracks().map((t) => t.kind),
    });
    if (videoRef.current && stream) {
      console.log(`Setting stream for ${isLocal ? "local" : "remote"} video`, {
        id: stream.id,
        active: stream.active,
        tracks: stream.getTracks().map((t) => ({
          kind: t.kind,
          enabled: t.enabled,
          readyState: t.readyState,
        })),
      });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        console.log(`Video metadata loaded for ${isLocal ? 'local' : 'remote'} stream`);
      };
      
      videoRef.current.onerror = (e) => {
        console.error(`Video error for ${isLocal ? 'local' : 'remote'} stream:`, e);
      };
    }
  }, [stream]);

  return (
    <div className="bg-[#252526] border border-[#454545] rounded-md overflow-hidden flex flex-col">
      <div className="h-6 flex items-center px-3 bg-[#333333]">
        <span className="text-xs font-semibold text-[#d4d4d4]">
          {isLocal ? "You" : "Participant"}
        </span>
      </div>
      <div className="flex-1 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="h-full w-full object-cover"
        />
      </div>
      <BottomBar stream={stream} isLocal={isLocal} onCallEnd={onCallEnd} />
    </div>
  );
};

export default VideoItem;
