interface StatusBarProps {
  terminalOpen: boolean;
  onTerminalToggle: () => void;
}
const StatusBar: React.FC<StatusBarProps> = ({
  terminalOpen,
  onTerminalToggle,
}) => {
  return (
    <div className="h-6 flex items-center justify-between bg-[#007acc] px-2 text-xs">
      <div>Status information</div>
      <button
        onClick={onTerminalToggle}
        className="text-gray-200 hover:text-white"
      >
        {terminalOpen ? "Hide Terminal" : "Show Terminal"}
      </button>
    </div>
  );
};

export default StatusBar;
