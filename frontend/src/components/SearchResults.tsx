
import React from 'react';
import { Search, Hash, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SearchResultsProps {
  query: string;
  onNoteSelect: (id: string) => void;
}

const mockSearchResults = [
  {
    id: '1',
    title: 'React Architecture Patterns',
    summary: 'Exploring different architectural patterns in React applications...',
    snippet: 'React applications can be structured in many different ways, but following established architectural patterns can greatly improve maintainability...',
    tags: ['React', 'Architecture'],
    relevanceScore: 0.92,
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    title: 'TypeScript Best Practices',
    summary: 'A comprehensive guide to writing clean and maintainable TypeScript code.',
    snippet: 'TypeScript provides excellent type safety for React applications. When combined with proper architectural patterns...',
    tags: ['TypeScript', 'React'],
    relevanceScore: 0.78,
    updatedAt: new Date('2024-01-18'),
  },
];

export const SearchResults = ({ query, onNoteSelect }: SearchResultsProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
        </div>
        <p className="text-gray-600">
          Found {mockSearchResults.length} results for "{query}"
        </p>
      </div>

      <div className="space-y-4">
        {mockSearchResults.map((result) => (
          <Card 
            key={result.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            onClick={() => onNoteSelect(result.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                {result.title}
              </h3>
              <div className="text-sm text-gray-500 font-medium">
                {Math.round(result.relevanceScore * 100)}% match
              </div>
            </div>
            
            <p className="text-gray-700 mb-3 leading-relaxed">
              {result.snippet}
            </p>
            
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
                {result.updatedAt.toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {mockSearchResults.length === 0 && (
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
