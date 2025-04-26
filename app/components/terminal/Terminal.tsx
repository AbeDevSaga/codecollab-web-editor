"use client";
import React, { useState, useEffect, useRef } from "react";
import TerminalBar from "./TerminalBar";
import XTermWrapper from "./XTermWrapper";

interface TerminalProps {
  terminalOpen: boolean;
  terminalHeight: number;
  setTerminalHeight: (height: number) => void;
  setTerminalOpen: (open: boolean) => void;
}

const Terminal: React.FC<TerminalProps> = ({
  terminalOpen,
  setTerminalOpen,
  terminalHeight,
  setTerminalHeight,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const [terminalCount, setTerminalCount] = useState(1);
  const [activeTerminal, setActiveTerminal] = useState(0);
  const [terminals, setTerminals] = useState([{ id: 0 }]);

  const addTerminal = () => {
    const newId = terminalCount;
    setTerminals([...terminals, { id: newId }]);
    setTerminalCount(terminalCount + 1);
    setActiveTerminal(newId);
  };

  const removeTerminal = (id: number) => {
    if (terminals.length <= 1) return;

    const newTerminals = terminals.filter((term) => term.id !== id);
    setTerminals(newTerminals);

    if (activeTerminal === id) {
      setActiveTerminal(newTerminals[newTerminals.length - 1].id);
    }
  };

  useEffect(() => {
    const savedHeight = localStorage.getItem("terminalHeight");
    if (savedHeight) {
      setTerminalHeight(parseInt(savedHeight, 10));
    }
  }, []);

  // Save terminal height to localStorage when it changes
  useEffect(() => {
    if (terminalHeight > 0) {
      localStorage.setItem("terminalHeight", terminalHeight.toString());
    }
  }, [terminalHeight]);

  // Handle mouse down on the drag handle
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = terminalHeight;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  // Handle mouse move for resizing
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = startY.current - e.clientY;
    const newHeight = startHeight.current + deltaY;

    // Set minimum height constraint (50px), no maximum constraint
    if (newHeight > 50) {
      setTerminalHeight(newHeight);
    }
  };

  // Handle mouse up to stop resizing
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  // Add event listeners for dragging
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const toggleTerminal = () => {
    setTerminalOpen(!terminalOpen);
    // Reset to default height when opening
    if (!terminalOpen) {
      const savedHeight = localStorage.getItem("terminalHeight");
      setTerminalHeight(savedHeight ? parseInt(savedHeight, 10) : 200);
    }
  };

  const maximizeTerminal = () => {
    if (terminalRef.current) {
      const editorHeight = terminalRef.current.parentElement?.clientHeight || 0;
      setTerminalHeight(editorHeight);
    }
  };

  return (
    terminalOpen && (
      <div
        ref={terminalRef}
        className="absolute bottom-0 left-0 right-0 flex flex-col border-t border-[#252526] bg-[#1e1e1e] z-10"
        style={{ height: `${terminalHeight}px` }}
      >
        {/* Terminal Bar */}
        <TerminalBar
          isOpen={terminalOpen}
          terminals={terminals}
          activeTerminal={activeTerminal}
          onToggle={toggleTerminal}
          onAddTerminal={addTerminal}
          onRemoveTerminal={removeTerminal}
          onTerminalSelect={setActiveTerminal}
          maximizeTerminal={maximizeTerminal}
        />

        {/* Terminal Body */}
        {terminalOpen && (
          <div className="flex-1 relative">
            {terminals.map((terminal) => (
              <div
                key={terminal.id}
                className={`absolute inset-0 ${
                  activeTerminal === terminal.id ? "block" : "hidden"
                }`}
              >
                <XTermWrapper />
              </div>
            ))}
          </div>
        )}

        {/* Drag Handle */}
        <div
          ref={dragHandleRef}
          className="absolute top-0 left-0 right-0 h-1 bg-transparent cursor-row-resize hover:bg-[#007acc]"
          onMouseDown={handleMouseDown}
        />
      </div>
    )
  );
};

export default Terminal;
