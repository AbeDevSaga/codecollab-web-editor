import React, { useState } from 'react';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

function DebugPanel() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('debug');
  // State to track if debugging is running
  const [isRunning, setIsRunning] = useState(false);
  // State to track if debugging is paused
  const [isPaused, setIsPaused] = useState(false);

  // Function to start debugging
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  // Function to pause/resume debugging
  const handlePause = () => {
    if (isRunning) {
      setIsPaused(!isPaused);
    }
  };

  // Function to stop debugging
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] border-t border-[#1e1e1e]">
      {/* Header: Control Bar with Start, Pause, Stop buttons and Tab selectors */}
      <div className="h-8 flex items-center px-2 border-b border-[#1e1e1e] text-xs text-gray-300 overflow-x-auto no-scrollbar">
        {/* Start Debugging Button */}
        <button onClick={handleStart} className="mr-2 hover:text-green-400" title="Start Debugging">
          <FaPlay size={12} />
        </button>
        {/* Pause Debugging Button */}
        <button onClick={handlePause} className="mr-2 hover:text-yellow-400" title="Pause">
          <FaPause size={12} />
        </button>
        {/* Stop Debugging Button */}
        <button onClick={handleStop} className="mr-4 hover:text-red-400" title="Stop Debugging">
          <FaStop size={12} />
        </button>

        {/* Navigation Tabs: Debug, Output, Terminal, Problems */}
        <div className="flex space-x-2">
          {['debug', 'output', 'terminal', 'problems'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-2 py-1 hover:text-white ${
                activeTab === tab ? 'text-white font-medium' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body: Dynamic content based on selected tab */}
      <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-300">
        {/* Debug Tab Content */}
        {activeTab === 'debug' && (
          <div>
            <h3 className="font-semibold mb-2">Debug Status</h3>
            <p>
              Debugger is{' '}
              <span className="text-yellow-300">
                {isRunning ? (isPaused ? 'paused' : 'running') : 'not active'}
              </span>.
            </p>
            <p className="mt-2">Use the controls above to start, pause, or stop debugging.</p>
          </div>
        )}

        {/* Output Tab Content */}
        {activeTab === 'output' && (
          <div>
            <h3 className="font-semibold mb-2">Output Logs</h3>
            <p>All output from the running application will be shown here.</p>
          </div>
        )}

        {/* Terminal Tab Content */}
        {activeTab === 'terminal' && (
          <div>
            <h3 className="font-semibold mb-2">Terminal</h3>
            <p>You can run commands in this integrated terminal window.</p>
          </div>
        )}

        {/* Problems Tab Content */}
        {activeTab === 'problems' && (
          <div>
            <h3 className="font-semibold mb-2">Problems</h3>
            <ul className="list-disc list-inside">
              <li>Linting and type-checking issues will appear here.</li>
              <li>Click a problem to navigate to the relevant file/line.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer: Status Bar showing current debug state */}
      <div className="px-2 py-1 text-xs text-gray-400 border-t border-[#1e1e1e]">
        {isRunning ? 'Debugging in progress' : 'Ready'}
      </div>
    </div>
  );
}

export default DebugPanel;
