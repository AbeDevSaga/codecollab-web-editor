"use client";
import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const XTermWrapper: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const commandBuffer = useRef<string>("");

  useEffect(() => {
    if (!terminalRef.current) return;
    // Initialize terminal
    terminal.current = new Terminal({
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4", 
      },
      fontSize: 14,
      cursorBlink: true,
    });

    fitAddon.current = new FitAddon();
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Welcome message and prompt
    terminal.current.writeln("Welcome to CodeCollab Terminal");
    writePrompt();

    // Handle terminal input
    terminal.current.onData((data) => {
      const printable = !(data.charCodeAt(0) < 32 || data.charCodeAt(0) === 127);

      if (data === "\r") {
        // Enter key pressed
        executeCommand();
      } else if (data === "\u007f") {
        // Backspace key pressed
        handleBackspace();
      } else if (printable) {
        handlePrintable(data);
      }
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.current?.fit();
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      terminal.current?.dispose();
    };
  }, []);

  const writePrompt = () => {
    terminal.current?.write("\r\n$ ");
    commandBuffer.current = "";
  };

  const executeCommand = () => {
    if (!terminal.current) return;
    
    // Get the full command from buffer
    const command = commandBuffer.current.trim();
    
    // Display the command that was executed
    terminal.current.write("\r\n");
    
    if (command) {
      // Process the command (replace this with your actual command processing)
      processCommand(command);
    }
    
    // Write new prompt
    writePrompt();
  };

  const processCommand = (command: string) => {
    terminal.current?.writeln(`> Executed: ${command}`);
    console.log("Command executed:", command);
    
    if (command === "clear") {
      terminal.current?.clear();
    }
    // Add more commands as needed
  };

  const handleBackspace = () => {
    if ((terminal.current?.buffer.active.cursorX ?? 0) > 2) {
      terminal.current?.write("\b \b");
      commandBuffer.current = commandBuffer.current.slice(0, -1);
    }
  };

  const handlePrintable = (data: string) => {
    terminal.current?.write(data);
    commandBuffer.current += data;
  };

  return (
    <div
      ref={terminalRef}
      className="h-full w-full scrollbar-hide"
      style={{ padding: "8px" }}
    />
  );
};

export default XTermWrapper;