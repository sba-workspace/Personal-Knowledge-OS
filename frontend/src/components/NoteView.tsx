import React from 'react';
import { ArrowLeft, Edit, Calendar, Hash, Share2, Loader2, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNote, useRelatedNotes, useLinkedNotes } from '@/hooks/useNotes';

interface NoteViewProps {
  noteId: string | null;
  onEdit: () => void;
  onBack: () => void;
  onNoteSelect: (id: string) => void;
}

export const NoteView = ({ noteId, onEdit, onBack, onNoteSelect }: NoteViewProps) => {
  const { data: note, isLoading, error } = useNote(noteId);
  const { data: relatedNotes } = useRelatedNotes(noteId);
  const { data: linkedNotes } = useLinkedNotes(noteId);

  if (!noteId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Select a note to view its content</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading note...</span>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading note. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={onEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Note Content */}
      <article className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {note.content.slice(0, 100)}...
          </h1>
          
          {note.summary && (
            <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">AI Summary</h3>
              <p className="text-blue-800 text-sm">{note.summary}</p>
            </Card>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Recently'}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {note.content}
          </div>
        </div>

        {/* Related Notes */}
        {(relatedNotes && relatedNotes.length > 0) && (
          <Card className="p-4 mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Related Notes
            </h3>
            <div className="space-y-2">
              {relatedNotes.map((relatedNote) => (
                <button
                  key={relatedNote.id}
                  onClick={() => onNoteSelect(relatedNote.id)}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  → {relatedNote.content.slice(0, 60)}...
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Linked Notes */}
        {(linkedNotes && linkedNotes.length > 0) && (
          <Card className="p-4 mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Linked Notes
            </h3>
            <div className="space-y-2">
              {linkedNotes.map((linkedNote) => (
                <button
                  key={linkedNote.id}
                  onClick={() => onNoteSelect(linkedNote.id)}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  → {linkedNote.content.slice(0, 60)}...
                </button>
              ))}
            </div>
          </Card>
        )}
      </article>
    </div>
  );
};