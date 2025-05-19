import React, { useState, useEffect } from 'react';
import { FiSearch, FiX, FiStar, FiDownload, 
         FiCheck, FiMoreVertical } from 'react-icons/fi';

interface Extension {
  id: string;
  name: string;
  publisher: string;
  description: string;
  rating: number;
  installCount: number;
  isInstalled: boolean;
  icon?: string;
}

function ExtensionsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('installed');

  useEffect(() => {
    // Simulate loading extensions
    const loadExtensions = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setExtensions([
        {
          id: '1',
          name: 'Prettier - Code formatter',
          publisher: 'Prettier',
          description: 'Code formatter using prettier',
          rating: 4.5,
          installCount: 10000000,
          isInstalled: true
        },
        {
          id: '2',
          name: 'ESLint',
          publisher: 'Microsoft',
          description: 'Integrates ESLint into VS Code',
          rating: 4.7,
          installCount: 8000000,
          isInstalled: true
        },
        {
          id: '3',
          name: 'GitLens',
          publisher: 'GitKraken',
          description: 'Supercharge Git within VS Code',
          rating: 4.8,
          installCount: 5000000,
          isInstalled: false
        },
        {
          id: '4',
          name: 'Live Server',
          publisher: 'Ritwick Dey',
          description: 'Launch a development local Server',
          rating: 4.8,
          installCount: 7000000,
          isInstalled: false
        }
      ]);
      setIsLoading(false);
    };

    loadExtensions();
  }, []);

  const filteredExtensions = extensions.filter(ext => 
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(ext => 
    activeTab === 'installed' ? ext.isInstalled : true
  );

  const installExtension = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, isInstalled: true } : ext
    ));
  };

  const uninstallExtension = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, isInstalled: false } : ext
    ));
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] text-[#cccccc] text-sm">
      {/* Search Bar */}
      <div className="p-2 border-b border-[#1e1e1e]">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-2 text-gray-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Extensions"
            className="w-full bg-[#1e1e1e] text-white text-sm pl-8 pr-6 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-gray-400 hover:text-white"
              title="Clear search"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e1e]">
        <button
          onClick={() => setActiveTab('installed')}
          className={`px-4 py-2 text-sm ${activeTab === 'installed' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
        >
          Installed
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 text-sm ${activeTab === 'marketplace' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
        >
          Marketplace
        </button>
      </div>

      {/* Extensions List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-400">Loading extensions...</div>
          </div>
        ) : filteredExtensions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <FiSearch size={32} className="mb-2" />
            <p>No extensions found</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-blue-400 hover:text-blue-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {filteredExtensions.map(ext => (
              <div key={ext.id} className="p-3 hover:bg-[#2d2d2d]">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#1e1e1e] rounded mr-3 flex items-center justify-center">
                    {ext.icon ? (
                      <img src={ext.icon} alt={ext.name} className="w-8 h-8" />
                    ) : (
                      <div className="text-gray-400 text-xl">{ext.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium truncate">{ext.name}</h3>
                      <span className="ml-2 text-xs text-gray-400">{ext.publisher}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{ext.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-yellow-400 text-xs">
                        <FiStar className="mr-1" />
                        {ext.rating}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <FiDownload className="mr-1" />
                        {ext.installCount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    {ext.isInstalled ? (
                      <>
                        <button 
                          onClick={() => uninstallExtension(ext.id)}
                          className="text-xs text-gray-400 hover:text-white flex items-center"
                        >
                          <FiCheck className="mr-1 text-green-500" />
                          Installed
                        </button>
                        <button className="text-xs text-blue-400 hover:text-blue-300 mt-1">
                          Disable
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => installExtension(ext.id)}
                        className="px-2 py-1 bg-[#0e639c] hover:bg-[#1177bb] rounded text-xs"
                      >
                        Install
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-white mt-2" title="More options">
                      <FiMoreVertical size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 text-xs text-gray-400 border-t border-[#1e1e1e]">
        {filteredExtensions.length} {filteredExtensions.length === 1 ? 'extension' : 'extensions'}
      </div>
    </div>
  );
}

export default ExtensionsPanel;