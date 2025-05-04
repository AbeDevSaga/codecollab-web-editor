interface StatusBarProps {
  terminalOpen: boolean;
  onTerminalToggle: () => void;
  isMinimized?: boolean;
  setIsMinimized?: (isMinimized: boolean) => void;
}
const StatusBar: React.FC<StatusBarProps> = ({
  terminalOpen,
  onTerminalToggle,
  isMinimized,
  setIsMinimized,
}) => {
  const toggleMinimize = () => {
    if (setIsMinimized) {
      setIsMinimized(!isMinimized);
    }
  };
  return (
    <div className="h-6 flex items-center justify-between bg-[#007acc] px-2 text-xs">
      <div className="">Status information</div>
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={onTerminalToggle}
          className="text-gray-200 hover:text-white"
        >
          {terminalOpen ? "Hide Terminal" : "Show Terminal"}
        </button>
        {isMinimized && (
          <button
            onClick={toggleMinimize}
            className="text-gray-200 hover:text-white"
          >
            Open Video Panel
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
