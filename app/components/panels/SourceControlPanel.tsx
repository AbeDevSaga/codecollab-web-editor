import React, { useState, useEffect, useRef } from 'react';
import { 
  FiGitBranch, FiRefreshCw, FiMoreVertical, FiCheck, FiPlus, 
  FiMinus, FiCircle, FiChevronDown, FiDownload,
  FiUpload, FiCopy, FiEye, FiFilter, FiTag, FiArchive,
  FiGitPullRequest, FiGitMerge, FiServer,
} from 'react-icons/fi';

interface Change {
  id: string;
  file: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  changes: string;
}

interface Branch {
  name: string;
  isCurrent: boolean;
}

function SourceControlPanel() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stagedChanges, setStagedChanges] = useState<Change[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setChanges([
        { id: '1', file: 'src/components/SideBar.tsx', status: 'modified', changes: '+12 -4' },
        { id: '2', file: 'src/panels/SearchPanel.tsx', status: 'modified', changes: '+23 -7' },
        { id: '3', file: 'src/context/AppContext.ts', status: 'added', changes: '+45 -0' },
        { id: '4', file: 'src/old/DeprecatedComponent.tsx', status: 'deleted', changes: '+0 -128' },
        { id: '5', file: 'src/new/Feature.tsx', status: 'untracked', changes: '+0 -0' },
      ]);

      setBranches([
        { name: 'main', isCurrent: true },
        { name: 'develop', isCurrent: false },
        { name: 'feature/search-enhancements', isCurrent: false },
      ]);

      setStagedChanges([
        { id: '6', file: 'package.json', status: 'modified', changes: '+2 -2' },
      ]);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const gitOperations = [
    { name: 'Pull', icon: <FiDownload size={14} />, action: () => {} },
    { name: 'Push', icon: <FiUpload size={14} />, action: () => {} },
    { name: 'Fetch', icon: <FiDownload size={14} />, action: () => {} },
    { name: 'Clone', icon: <FiCopy size={14} />, action: () => {} },
    { name: 'View Changes', icon: <FiEye size={14} />, action: () => {} },
    { name: 'Sort Changes', icon: <FiFilter size={14} />, action: () => {} },
    { name: 'Manage Remotes', icon: <FiServer size={14} />, action: () => {} },
    { name: 'Branches', icon: <FiGitBranch size={14} />, action: () => {} },
    { name: 'Tags', icon: <FiTag size={14} />, action: () => {} },
    { name: 'Stash', icon: <FiArchive size={14} />, action: () => {} },
    { name: 'Merge', icon: <FiGitMerge size={14} />, action: () => {} },
    { name: 'Pull Request', icon: <FiGitPullRequest size={14} />, action: () => {} }
  ];

  const handleCommit = () => {
    if (!commitMessage.trim() || stagedChanges.length === 0) return;
    setCommitMessage('');
    setStagedChanges([]);
  };

  const stageChange = (change: Change) => {
    setChanges(changes.filter(c => c.id !== change.id));
    setStagedChanges([...stagedChanges, change]);
  };

  const unstageChange = (change: Change) => {
    setStagedChanges(stagedChanges.filter(c => c.id !== change.id));
    setChanges([...changes, change]);
  };

  const stageAll = () => {
    setStagedChanges([...stagedChanges, ...changes]);
    setChanges([]);
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'added': return <FiPlus className="text-green-500" size={14} />;
      case 'modified': return <FiCircle className="text-blue-500" size={14} />;
      case 'deleted': return <FiMinus className="text-red-500" size={14} />;
      case 'untracked': return <FiCircle className="text-gray-500" size={14} />;
      default: return <FiCircle size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] text-[#cccccc] text-sm">
      <div className="flex items-center justify-between p-2 border-b border-[#1e1e1e]">
        <div className="flex items-center">
          <FiGitBranch className="mr-2" />
          <span className="font-semibold">{currentBranch}</span>
          <FiChevronDown className="ml-1" size={14} />
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={refresh}
            className="p-1 rounded hover:bg-[#2d2d2d]"
            title="Refresh"
          >
            <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={14} />
          </button>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-[#2d2d2d]"
              title="More actions"
            >
              <FiMoreVertical size={14} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-[#1e1e1e] rounded shadow-lg z-10 border border-[#333]">
                {gitOperations.map((op) => (
                  <button
                    key={op.name}
                    onClick={() => {
                      op.action();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#2a2d2e] flex items-center"
                  >
                    <span className="mr-2">{op.icon}</span>
                    <span>{op.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {stagedChanges.length > 0 && (
          <>
            <div className="px-2 py-1.5 bg-[#1b1b1b] flex justify-between items-center">
              <span>STAGED CHANGES</span>
              <span className="text-xs text-gray-400">{stagedChanges.length} files</span>
            </div>
            <div className="divide-y divide-[#1e1e1e]">
              {stagedChanges.map(change => (
                <div key={change.id} className="px-2 py-1.5 hover:bg-[#2d2d2d] flex justify-between items-center">
                  <div className="flex items-center truncate">
                    <span className="mr-2">{getStatusIcon(change.status)}</span>
                    <span className="truncate">{change.file}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">{change.changes}</span>
                    <button 
                      onClick={() => unstageChange(change)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Unstage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="px-2 py-1.5 bg-[#1b1b1b] flex justify-between items-center">
          <span>CHANGES</span>
          {changes.length > 0 && (
            <button 
              onClick={stageAll}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Stage All
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">Loading changes...</div>
        ) : changes.length > 0 ? (
          <div className="divide-y divide-[#1e1e1e]">
            {changes.map(change => (
              <div key={change.id} className="px-2 py-1.5 hover:bg-[#2d2d2d] flex justify-between items-center">
                <div className="flex items-center truncate">
                  <span className="mr-2">{getStatusIcon(change.status)}</span>
                  <span className="truncate">{change.file}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2">{change.changes}</span>
                  <button 
                    onClick={() => stageChange(change)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Stage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400">
            {stagedChanges.length === 0 ? "No changes detected" : "All changes staged"}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-[#1e1e1e]">
        <div className="mb-2">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Message (press Ctrl+Enter to commit)"
            className="w-full bg-[#2d2d2d] text-sm p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            rows={3}
            onKeyDown={(e) => e.ctrlKey && e.key === 'Enter' && handleCommit()}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {stagedChanges.length} staged {stagedChanges.length === 1 ? 'change' : 'changes'}
          </span>
          <button
            onClick={handleCommit}
            disabled={!commitMessage.trim() || stagedChanges.length === 0}
            className={`px-3 py-1.5 rounded flex items-center space-x-1 ${
              !commitMessage.trim() || stagedChanges.length === 0
                ? 'bg-[#1e1e1e] text-gray-500 cursor-not-allowed'
                : 'bg-[#0e639c] hover:bg-[#1177bb]'
            }`}
          >
            <FiCheck size={14} />
            <span>Commit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SourceControlPanel;