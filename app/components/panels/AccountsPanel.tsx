import React, { useState } from 'react';
import { FiUser, FiGithub, FiSettings, FiCheck, FiPlus } from 'react-icons/fi';

interface Account {
  id: string;
  provider: 'microsoft' | 'github' | 'other';
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
}

function AccountsPanel() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      provider: 'microsoft',
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true
    },
    {
      id: '2',
      provider: 'github',
      name: 'johndoe',
      email: 'john@github.com',
      isActive: false
    }
  ]);
  const [showAddAccount, setShowAddAccount] = useState(false);


  const addAccount = (provider: 'microsoft' | 'github' | 'other') => {
    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      provider,
      name: provider === 'github' ? 'newuser' : 'New User',
      email: `newuser@${provider}.com`,
      isActive: false
    };
    setAccounts([...accounts, newAccount]);
    setShowAddAccount(false);
  };

  const getProviderIcon = (provider: string) => {
    switch(provider) {
      case 'github': return <FiGithub className="text-white" />;
      case 'microsoft': return <FiUser className="text-blue-400" />;
      default: return <FiUser className="text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] text-[#cccccc] text-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#1e1e1e]">
        <div className="flex items-center">
          <FiUser className="mr-2" />
          <span className="font-medium">ACCOUNTS</span>
        </div>
        <button 
          onClick={() => setShowAddAccount(!showAddAccount)}
          className="p-1 rounded hover:bg-[#2d2d2d]"
          title="Add account"
        >
          <FiPlus size={14} />
        </button>
      </div>

      {/* Add Account Dropdown */}
      {showAddAccount && (
        <div className="bg-[#1e1e1e] p-2 border-b border-[#333]">
          <div className="text-xs text-gray-400 mb-1">Sign in to add account:</div>
          <button 
            onClick={() => addAccount('microsoft')}
            className="w-full text-left px-2 py-1.5 hover:bg-[#2d2d2d] rounded flex items-center"
          >
            <FiUser className="mr-2 text-blue-400" />
            <span>Microsoft</span>
          </button>
          <button 
            onClick={() => addAccount('github')}
            className="w-full text-left px-2 py-1.5 hover:bg-[#2d2d2d] rounded flex items-center"
          >
            <FiGithub className="mr-2" />
            <span>GitHub</span>
          </button>
        </div>
      )}

      {/* Accounts List */}
      <div className="flex-1 overflow-y-auto">
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
            <FiUser size={32} className="mb-2" />
            <p>No accounts signed in</p>
            <button 
              onClick={() => setShowAddAccount(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              Add Account
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {accounts.map(account => (
              <div key={account.id} className="p-2 hover:bg-[#2d2d2d]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center mr-2">
                      {account.avatar ? (
                        <img src={account.avatar} alt={account.name} className="w-full h-full rounded-full" />
                      ) : (
                        getProviderIcon(account.provider)
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-gray-400">{account.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {account.isActive && (
                      <FiCheck className="text-green-500 mr-2" />
                    )}
                    <button className="text-gray-400 hover:text-white" title="Account settings">
                      <FiSettings size={14} />
                    </button>
                  </div>
                </div>
                {account.isActive && (
                  <div className="mt-2 text-xs text-gray-400">
                    <div className="flex items-center">
                      <span className="w-8"></span>
                      <span>Active session</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="w-8"></span>
                      <button className="text-blue-400 hover:text-blue-300">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 text-xs text-gray-400 border-t border-[#1e1e1e]">
        {accounts.filter(a => a.isActive).length > 0 ? (
          <div className="flex items-center">
            <FiCheck className="text-green-500 mr-1" />
            <span>Signed in</span>
          </div>
        ) : (
          <span>Not signed in</span>
        )}
      </div>
    </div>
  );
}

export default AccountsPanel;