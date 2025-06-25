import React, { useState, useEffect } from 'react';
import { Save, X, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useNote, useCreateNote, useUpdateNote } from '@/hooks/useNotes';

interface NoteEditorProps {
  noteId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor = ({ noteId, onSave, onCancel }: NoteEditorProps) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const { data: existingNote, isLoading: noteLoading } = useNote(noteId);
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();

  const isLoading = createNoteMutation.isPending || updateNoteMutation.isPending;

  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content);
      setTags(existingNote.tags || []);
    }
  }, [existingNote]);

  const handleSave = async () => {
    if (!content.trim()) return;

    try {
      if (noteId && existingNote) {
        await updateNoteMutation.mutateAsync({
          id: noteId,
          data: { content, tags }
        });
      } else {
        await createNoteMutation.mutateAsync({
          content,
          tags
        });
      }
      onSave();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (noteLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading note...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {noteId ? 'Edit Note' : 'Create New Note'}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={onCancel} size="sm">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            {isPreview ? (
              <Card className="p-4 min-h-[500px] bg-gray-50">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{content}</div>
                </div>
              </Card>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note..."
                className="min-h-[500px] font-mono text-sm"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tag..."
                  className="text-xs"
                />
                <Button onClick={handleAddTag} size="sm" variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Writing Stats</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Words:</span>
                <span>{content.split(/\s+/).filter(word => word.length > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span>{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Reading time:</span>
                <span>~{Math.ceil(content.split(/\s+/).length / 200)} min</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};