import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiCode, FiFile, FiType } from 'react-icons/fi';

interface SearchResult {
  id: string;
  text: string;
  type: 'file' | 'symbol' | 'reference';
  path?: string;
  lineNumber?: number;
}

function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic search function with debounce
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchDelay = setTimeout(async () => {
      setIsSearching(true);
      
      try {
        // Replace this with actual search API call or file system search
        const mockResults = await simulateSearch(query);
        setResults(mockResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchDelay);
  }, [query]);

  // Simulate dynamic search (replace with your actual search implementation)
  const simulateSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    // This would be replaced with real file system or API search
    return new Promise(resolve => {
      setTimeout(() => {
        const mockResults: SearchResult[] = [];
        
        // Generate dynamic results based on query
        if (searchQuery.includes('.')) {
          mockResults.push({
            id: `file-${Date.now()}`,
            text: `${searchQuery.split('.')[0]}.${Math.random().toString(36).substring(2, 5)}`,
            type: 'file',
            path: `/src/components/${searchQuery.split('.')[0]}.tsx`,
            lineNumber: Math.floor(Math.random() * 100) + 1
          });
        }
        
        if (searchQuery.length > 2) {
          mockResults.push({
            id: `symbol-${Date.now()}`,
            text: `${searchQuery}Component`,
            type: 'symbol',
            path: `/src/components/${searchQuery}Component.tsx`,
            lineNumber: Math.floor(Math.random() * 50) + 1
          });
          
          mockResults.push({
            id: `ref-${Date.now()}`,
            text: `use${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}()`,
            type: 'reference',
            path: `/src/hooks/use${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}.ts`,
            lineNumber: Math.floor(Math.random() * 30) + 1
          });
        }
        
        resolve(mockResults);
      }, 200);
    });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Opening:', result);
    // In a real editor, this would open the file at the specific line
    // Example: editor.openFile(result.path, result.lineNumber);
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] border-t border-[#1e1e1e]">
      {/* Search Header */}
      <div className="h-8 flex items-center px-2 border-b border-[#1e1e1e]">
        <div className="relative flex-1 flex items-center">
          <FiSearch className="text-gray-400 mr-2" size={14} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search files, symbols, references..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500"
          />
          {query && (
            <button 
              onClick={clearSearch} 
              className="text-gray-400 hover:text-white ml-2"
              aria-label="Clear search"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Body */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center p-4 text-gray-400">
            <span>Searching...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="divide-y divide-[#1e1e1e]">
            {results.map((result) => (
              <div 
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="px-3 py-2 hover:bg-[#2a2d2e] cursor-pointer flex items-start"
              >
                <div className="mt-1 mr-3">
                  {result.type === 'file' ? (
                    <FiFile className="text-blue-400" />
                  ) : result.type === 'symbol' ? (
                    <FiCode className="text-purple-400" />
                  ) : (
                    <FiType className="text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{result.text}</div>
                  {result.path && (
                    <div className="text-xs text-gray-400 mt-1">
                      {result.path}
                      {result.lineNumber && `:${result.lineNumber}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="flex items-center justify-center p-4 text-gray-400">
            <span>No results found for "{query}"</span>
          </div>
        ) : (
          <div className="p-4 text-gray-400 text-sm">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Search Tips:</h3>
              <ul className="space-y-1">
                <li>• Type to search files, components, and references</li>
                <li>• Use <kbd>Ctrl+F</kbd> to focus search</li>
                <li>• Try searching for component names or file extensions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Recent Searches:</h3>
              <div className="text-gray-500">No recent searches</div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 text-xs text-gray-400 border-t border-[#1e1e1e]">
        {results.length > 0 ? `${results.length} results` : 'Ready'}
      </div>
    </div>
  );
}

export default SearchPanel;