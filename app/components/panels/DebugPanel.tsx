import React from 'react';

interface DebugPanelProps {
  isRunning?: boolean;
  isPaused?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onStepOver?: () => void;
  onStepInto?: () => void;
  onStepOut?: () => void;
  onRestart?: () => void;
}

function DebugPanel({
  isRunning = false,
  isPaused = false,
  onStart,
  onPause,
  onStop,
  onStepOver,
  onStepInto,
  onStepOut,
  onRestart,
}: DebugPanelProps) {
  return (
    <div className="h-8 flex items-center px-2 bg-[#252526] text-xs text-[#CCCCCC] border-t border-[#1E1E1E]">
      <div className="flex items-center space-x-4">
        {/* Debug controls */}
        <button 
          className={`p-1 rounded hover:bg-[#3C3C3C] ${isRunning && !isPaused ? 'text-[#569CD6]' : ''}`}
          onClick={isRunning && !isPaused ? onPause : onStart}
          disabled={isRunning && isPaused}
          title="Start/Pause Debugging (F5)"
        >
          {isRunning && !isPaused ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <rect x="5" y="3" width="2" height="10" rx="1"/>
              <rect x="9" y="3" width="2" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.018 14L14.41 8 4.018 2z"/>
            </svg>
          )}
        </button>
        
        <button 
          className="p-1 rounded hover:bg-[#3C3C3C] disabled:opacity-50" 
          onClick={onStop}
          disabled={!isRunning}
          title="Stop Debugging (Shift+F5)"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="3" width="10" height="10" rx="1"/>
          </svg>
        </button>
        
        <button 
          className="p-1 rounded hover:bg-[#3C3C3C] disabled:opacity-50" 
          onClick={onRestart}
          disabled={!isRunning}
          title="Restart Debugging (Ctrl+Shift+F5)"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.018 14L14.41 8 4.018 2v4H1.996v4h2.022v4zM11.03 3.51a5.5 5.5 0 0 1 3.48 4.5h1.003a6.5 6.5 0 0 0-4.1-5.5l-.383.5z"/>
          </svg>
        </button>
        
        <div className="h-4 w-px bg-[#3C3C3C] mx-1"></div>
        
        <button 
          className="p-1 rounded hover:bg-[#3C3C3C] disabled:opacity-50" 
          onClick={onStepOver}
          disabled={!isPaused}
          title="Step Over (F10)"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.8 3.51l.7-.7L16 7.95l-4.5 5.14-.7-.7 3.52-4.31H0V7.82h14.32L10.8 3.51z"/>
          </svg>
        </button>
        
        <button 
          className="p-1 rounded hover:bg-[#3C3C3C] disabled:opacity-50" 
          onClick={onStepInto}
          disabled={!isPaused}
          title="Step Into (F11)"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.8 3.51l.7-.7L16 7.95l-4.5 5.14-.7-.7 3.52-4.31H6.5v-1h7.32L10.8 3.51zM0 12.5v-1h5.5v1H0z"/>
          </svg>
        </button>
        
        <button 
          className="p-1 rounded hover:bg-[#3C3C3C] disabled:opacity-50" 
          onClick={onStepOut}
          disabled={!isPaused}
          title="Step Out (Shift+F11)"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 3.51H0v1h5.5v1H1.68l3.52 4.31-.7.7L0 7.95l4.5-5.14.7.7L1.68 7.82H5.5v1.68z"/>
          </svg>
        </button>
      </div>
      
      {/* Status area */}
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-[#A0A0A0]">Debug</span>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#569CD6] mr-1"></div>
          <span>{isRunning ? (isPaused ? 'Paused' : 'Running') : 'Inactive'}</span>
        </div>
      </div>
    </div>
  );
}

export default DebugPanel;