import React from 'react';
import { Calendar, Hash, FileText, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNotes } from '@/hooks/useNotes';

interface NoteListProps {
  onNoteSelect: (id: string) => void;
}

export const NoteList = ({ onNoteSelect }: NoteListProps) => {
  const { data: notes, isLoading, error } = useNotes();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading notes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading notes. Please try again.</p>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-500">Create your first note to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Notes</h2>
        <p className="text-gray-600">
          {notes.length} notes in your knowledge base
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card 
            key={note.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            onClick={() => onNoteSelect(note.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {note.content.slice(0, 50)}...
              </h3>
              <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            
            {note.summary && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {note.summary}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.map((tag) => (
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
              {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Recently'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};