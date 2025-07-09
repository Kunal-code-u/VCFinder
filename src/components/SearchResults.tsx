import React from 'react';
import { Search, AlertCircle } from 'lucide-react';
import VCCard from './VCCard';
import { VC } from '../types/vc';

interface SearchResultsProps {
  results: VC[];
  isLoading: boolean;
  searchQuery: string;
  hasSearched: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery,
  hasSearched
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Searching for VCs in {searchQuery}...</p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No VCs found for "{searchQuery}"
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          Try searching for different industries like "fintech", "healthcare", "SaaS", or "consumer"
        </p>
      </div>
    );
  }

  if (hasSearched && results.length > 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {results.length} Venture Capital Firm{results.length !== 1 ? 's' : ''} found for "{searchQuery}"
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            All firms below have verified email addresses and actively invest in {searchQuery}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((vc) => (
            <VCCard key={vc.id} vc={vc} searchQuery={searchQuery} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Ready to find your perfect VC match?
      </h3>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        Try searching for different industries like "fintech", "healthcare", "SaaS", "consumer", "automotive", or "fashion"
      </p>
    </div>
  );
};

export default SearchResults;