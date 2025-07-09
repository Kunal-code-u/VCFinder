import React, { useState, useEffect } from 'react';
import { TrendingUp, Shield, Moon, Sun, ArrowUp } from 'lucide-react';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import { VC, SearchState } from './types/vc';
import vcsData from './data/vcs.json';

function App() {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    suggestions: [],
    showSuggestions: false
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [allVCs] = useState<VC[]>(vcsData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Extract unique industries for suggestions
  const allIndustries = Array.from(
    new Set(allVCs.flatMap(vc => vc.industries))
  ).sort();

  useEffect(() => {
    if (searchState.query.length > 0) {
      const filteredSuggestions = allIndustries.filter(industry =>
        industry.toLowerCase().includes(searchState.query.toLowerCase())
      );
      
      setSearchState(prev => ({
        ...prev,
        suggestions: filteredSuggestions.slice(0, 8),
        showSuggestions: true
      }));
    } else {
      setSearchState(prev => ({
        ...prev,
        suggestions: [],
        showSuggestions: false
      }));
    }
  }, [searchState.query, allIndustries]);

  const handleSearch = (query: string) => {
    setSearchState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API delay
    setTimeout(() => {
      const filteredVCs = allVCs.filter(vc =>
        vc.industries.some(industry =>
          industry.toLowerCase().includes(query.toLowerCase())
        )
      );

      setSearchState(prev => ({
        ...prev,
        results: filteredVCs,
        isLoading: false,
        showSuggestions: false
      }));
      
      setHasSearched(true);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchState(prev => ({ ...prev, query: suggestion }));
    handleSearch(suggestion);
  };

  const handleInputChange = (value: string) => {
    setSearchState(prev => ({ ...prev, query: value }));
    if (value === '') {
      setSearchState(prev => ({ ...prev, results: [] }));
      setHasSearched(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Track scroll position and show back to top button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBackToTop(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setScrollPosition(window.scrollY);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToPreviousPosition = () => {
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-50/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/30 dark:border-gray-700/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={scrollToTop}
                className="bg-blue-600 p-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                title="Back to top"
              >
                <TrendingUp className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={scrollToTop}
                className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                title="Back to top"
              >
                VCFinder
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Find VCs by Industry
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Venture Capitalists by Industry
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with the right venture capital firms for your startup. 
            Search our comprehensive database of VCs with verified email addresses and detailed investment focus areas.
          </p>
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <Shield className="h-4 w-4 mr-2 text-green-600" />
            All email addresses are verified and regularly updated
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <SearchForm
            onSearch={handleSearch}
            suggestions={searchState.suggestions}
            showSuggestions={searchState.showSuggestions}
            isLoading={searchState.isLoading}
            onSuggestionClick={handleSuggestionClick}
            onInputChange={handleInputChange}
            query={searchState.query}
          />
        </div>

        {/* Search Results */}
        <SearchResults
          results={searchState.results}
          isLoading={searchState.isLoading}
          searchQuery={searchState.query}
          hasSearched={hasSearched}
        />

        {/* Popular Industries */}
        {!hasSearched && (
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Industries
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Click on any industry to see relevant VCs</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['fintech', 'healthcare', 'SaaS', 'consumer', 'enterprise', 'AI', 'automotive', 'fashion'].map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleSuggestionClick(industry)}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all duration-200 capitalize font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <div className="space-y-2">
              <p>© 2025 VCFinder. Find the perfect venture capital partner for your startup.</p>
              <p className="text-sm flex items-center justify-center gap-4">
                <span className="flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-green-600" />
                  Verified Emails
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-blue-600" />
                  Updated Daily
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top / Previous Position Button */}
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {scrollPosition > 0 && (
            <button
              onClick={scrollToPreviousPosition}
              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Back to previous position"
            >
              <ArrowUp className="h-5 w-5 rotate-180" />
            </button>
          )}
          <button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;