import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onInputChange: (value: string) => void;
  query: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  suggestions,
  showSuggestions,
  isLoading,
  onSuggestionClick,
  onInputChange,
  query
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If a suggestion is selected, use it
    if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      onSuggestionClick(selectedSuggestion);
    } else if (query.trim()) {
      onSearch(query.trim());
    }
    
    setIsFocused(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case 'Tab':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          onInputChange(selectedSuggestion);
          setIsFocused(false);
          setSelectedSuggestionIndex(-1);
        } else if (suggestions.length > 0) {
          e.preventDefault();
          onInputChange(suggestions[0]);
          setIsFocused(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
        
      case 'Escape':
        setIsFocused(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
        
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedSuggestion = suggestions[selectedSuggestionIndex];
          onSuggestionClick(selectedSuggestion);
          setIsFocused(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange(value);
    setIsFocused(value.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    setIsFocused(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionHover = (index: number) => {
    setSelectedSuggestionIndex(index);
  };

  const clearSearch = () => {
    onInputChange('');
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(query.length > 0)}
            placeholder="Search for an industry (e.g., fintech, healthcare, automotive, fashion)"
            className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 focus:ring-0 focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Separate Search Button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none cursor-pointer disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          <div className="flex items-center justify-center space-x-3">
            <Search className="h-5 w-5" />
            <span className="text-lg">{isLoading ? 'Searching...' : 'Search VCs'}</span>
          </div>
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => handleSuggestionHover(index)}
              className={`w-full px-4 py-3 text-left transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 dark:border-gray-600 last:border-b-0 cursor-pointer ${
                selectedSuggestionIndex === index
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <Search className={`h-4 w-4 mr-3 ${
                  selectedSuggestionIndex === index
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-400'
                }`} />
                <span className={
                  selectedSuggestionIndex === index
                    ? 'text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchForm;