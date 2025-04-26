"use client";
import React from "react";
import { FiTerminal, FiChevronUp, FiX, FiPlus } from "react-icons/fi";

interface TerminalBarProps {
  isOpen: boolean;
  terminals: { id: number }[];
  activeTerminal: number;
  onToggle: () => void;
  onAddTerminal: () => void;
  onRemoveTerminal: (id: number) => void;
  onTerminalSelect: (id: number) => void;
  maximizeTerminal: () => void;
}

const TerminalBar: React.FC<TerminalBarProps> = ({
  isOpen,
  terminals,
  activeTerminal,
  onToggle,
  onAddTerminal,
  onRemoveTerminal,
  onTerminalSelect,
  maximizeTerminal,
}) => {
  return (
    <div className="flex items-center justify-between bg-[#252526] h-8 px-2">
      <div className="flex items-center">
        <FiTerminal className="mr-2 text-gray-400" />
        <span className="text-xs font-medium text-gray-300">TERMINAL</span>
        <button
          onClick={maximizeTerminal}
          className="ml-2 text-gray-400 hover:text-white text-xs"
          title="Maximize"
        >
          ⤢
        </button>
      </div>

      <div className="flex items-center">
        {/* Terminal Tabs */}
        <div className="flex mr-4">
          {terminals.map((terminal) => (
            <div
              key={terminal.id}
              className={`flex items-center px-3 h-8 text-xs cursor-pointer ${
                activeTerminal === terminal.id
                  ? "bg-[#1e1e1e]"
                  : "hover:bg-[#2d2d2d]"
              }`}
              onClick={() => onTerminalSelect(terminal.id)}
            >
              <span className="mr-1 text-gray-400">{terminal.id + 1}</span>
              <span>bash</span>
              <FiX
                className="ml-2 text-gray-500 hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTerminal(terminal.id);
                }}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <button
          className="p-1 text-gray-400 hover:text-gray-200 hover:bg-[#37373d] rounded"
          onClick={onAddTerminal}
        >
          <FiPlus size={14} />
        </button>
        <button
          className="p-1 text-gray-400 hover:text-gray-200 hover:bg-[#37373d] rounded ml-1"
          onClick={onToggle}
        >
          <FiChevronUp
            size={14}
            className={`transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default TerminalBar;
