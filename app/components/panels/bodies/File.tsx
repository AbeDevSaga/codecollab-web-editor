import React from "react";
import { VscFile } from "react-icons/vsc";
import { FaReact } from "react-icons/fa";
import { GrJs } from "react-icons/gr";
import { GiElephant } from "react-icons/gi";
import type {TFile } from "../../../types/type";
import { getIconAndColorFromFile } from "@/app/lib/files";

type IconMapping = {
  [key: string]: React.ComponentType<{ className?: string }>;
};
const iconMapping: IconMapping = {
  file: VscFile,
  tsx: FaReact,
  js: GrJs,
  php: GiElephant,
};
interface FileProps {
  file: TFile;
  level: number;
  isSelected: boolean;
  onClick: () => void;
}

const File: React.FC<FileProps> = ({ file, level, isSelected, onClick }) => {
  const [type, color] = getIconAndColorFromFile(file.name);
  const IconComponent = iconMapping[type] || VscFile; // Default to VscFile if type is not found in iconMapping
  const iconColor = color || "text-blue-400"; // Default color if not found
  return (
    <div
      className={`flex items-center py-1 px-2 ${
        isSelected ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
      } cursor-pointer`}
      style={{ paddingLeft: `${level * 12 + 12}px` }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {IconComponent && <IconComponent className={`${iconColor} mr-2`} />}
      <span className="text-[#d4d4d4] text-sm">{file.name}</span>
    </div>
  );
};

export default File;
