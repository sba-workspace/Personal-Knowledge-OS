import React from 'react';
import { Search, Hash, Calendar, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSearchNotes } from '@/hooks/useNotes';

interface SearchResultsProps {
  query: string;
  onNoteSelect: (id: string) => void;
}

export const SearchResults = ({ query, onNoteSelect }: SearchResultsProps) => {
  const { results, isLoading } = useSearchNotes();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Searching...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
        </div>
        <p className="text-gray-600">
          Found {results.length} results for "{query}"
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <Card 
            key={result.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            onClick={() => onNoteSelect(result.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                {result.content.slice(0, 100)}...
              </h3>
            </div>
            
            {result.summary && (
              <p className="text-gray-700 mb-3 leading-relaxed">
                {result.summary}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {result.updatedAt ? new Date(result.updatedAt).toLocaleDateString() : 'Recently'}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && query && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or create a new note with this content.
          </p>
        </div>
      )}
    </div>
  );
};