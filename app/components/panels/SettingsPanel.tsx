import React, { useState } from 'react';
import { FiSettings, FiSearch, FiChevronRight, 
         FiCode, FiTerminal, FiGitBranch, FiUser,FiX } from 'react-icons/fi';

interface SettingCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  name: string;
  value: string | boolean;
  type: 'boolean' | 'string' | 'dropdown';
  options?: string[];
}

function SettingsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingCategory[]>([
    {
      id: 'editor',
      title: 'Editor',
      icon: <FiCode />,
      description: 'Text editor appearance and behavior',
      items: [
        { id: 'fontSize', name: 'Font Size', value: '14', type: 'string' },
        { id: 'wordWrap', name: 'Word Wrap', value: true, type: 'boolean' },
        { id: 'tabSize', name: 'Tab Size', value: '2', type: 'string' }
      ]
    },
    {
      id: 'terminal',
      title: 'Terminal',
      icon: <FiTerminal />,
      description: 'Integrated terminal settings',
      items: [
        { id: 'shellPath', name: 'Shell Path', value: '/bin/zsh', type: 'string' },
        { id: 'fontFamily', name: 'Font Family', value: 'monospace', type: 'string' }
      ]
    },
    {
      id: 'git',
      title: 'Git',
      icon: <FiGitBranch />,
      description: 'Version control configuration',
      items: [
        { id: 'autofetch', name: 'Auto Fetch', value: true, type: 'boolean' },
        { id: 'confirmSync', name: 'Confirm Sync', value: false, type: 'boolean' }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      icon: <FiUser />,
      description: 'User profile and preferences',
      items: [
        { id: 'syncSettings', name: 'Sync Settings', value: true, type: 'boolean' },
        { id: 'theme', name: 'Theme', value: 'dark', type: 'dropdown', options: ['dark', 'light', 'system'] }
      ]
    }
  ]);

  const toggleSetting = (categoryId: string, itemId: string) => {
    setSettings(settings.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId && item.type === 'boolean') {
              return { ...item, value: !item.value };
            }
            return item;
          })
        };
      }
      return category;
    }));
  };

  const filteredCategories = settings.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search Settings"
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

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedCategory ? (
          <div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="flex items-center p-2 text-blue-400 hover:text-blue-300"
            >
              <FiChevronRight className="transform rotate-180 mr-1" />
              Back to all settings
            </button>
            <div className="p-2">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                {settings.find(c => c.id === selectedCategory)?.icon}
                <span className="ml-2">{settings.find(c => c.id === selectedCategory)?.title}</span>
              </h2>
              <div className="space-y-4">
                {settings.find(c => c.id === selectedCategory)?.items.map(item => (
                  <div key={item.id} className="bg-[#2d2d2d] p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.type === 'boolean' && (
                          <button 
                            onClick={() => toggleSetting(selectedCategory, item.id)}
                            className={`mt-2 px-3 py-1 rounded text-xs ${
                              item.value ? 'bg-green-600 hover:bg-green-700' : 'bg-[#3a3a3a] hover:bg-[#4a4a4a]'
                            }`}
                          >
                            {item.value ? 'Enabled' : 'Disabled'}
                          </button>
                        )}
                        {item.type === 'string' && (
                          <input
                            type="text"
                            value={item.value as string}
                            onChange={(e) => {
                              setSettings(settings.map(category => {
                                if (category.id === selectedCategory) {
                                  return {
                                    ...category,
                                    items: category.items.map(i => {
                                      if (i.id === item.id) {
                                        return { ...i, value: e.target.value };
                                      }
                                      return i;
                                    })
                                  };
                                }
                                return category;
                              }));
                            }}
                            className="mt-2 bg-[#1e1e1e] text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={`Enter ${item.name}`}
                            title={item.name}
                          />
                        )}
                        {item.type === 'dropdown' && (
                          <select
                            value={item.value as string}
                            onChange={(e) => {
                              setSettings(settings.map(category => {
                                if (category.id === selectedCategory) {
                                  return {
                                    ...category,
                                    items: category.items.map(i => {
                                      if (i.id === item.id) {
                                        return { ...i, value: e.target.value };
                                      }
                                      return i;
                                    })
                                  };
                                }
                                return category;
                              }));
                            }}
                            className="mt-2 bg-[#1e1e1e] text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            aria-label={item.name}
                            title={item.name}
                          >
                            {item.options?.map(option => (
                              <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <FiSettings className="mr-2" />
              Settings
            </h2>
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FiSearch size={32} className="mb-2" />
                <p>No settings found for &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredCategories.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-[#2d2d2d] p-4 rounded cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center mr-3">
                        {category.icon}
                      </div>
                      <h3 className="font-medium">{category.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400">{category.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {category.items.length} settings
                      </span>
                      <FiChevronRight className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPanel;