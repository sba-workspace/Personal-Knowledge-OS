
import React, { useState } from 'react';
import { Save, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface NoteEditorProps {
  noteId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export const NoteEditor = ({ noteId, onSave, onCancel }: NoteEditorProps) => {
  const [title, setTitle] = useState(noteId ? 'React Architecture Patterns' : '');
  const [content, setContent] = useState(noteId ? 
    `# React Architecture Patterns

React applications can be structured in many different ways...` : '');
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    // Here you would typically make an API call to save the note
    console.log('Saving note:', { title, content });
    onSave();
  };

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
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="text-lg font-semibold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown supported)
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
            <h3 className="text-sm font-medium text-gray-900 mb-3">AI Assistant</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Generate Summary
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Suggest Tags
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Find Related Notes
              </Button>
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

          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Insert Template
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Add Link to Note
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Insert Code Block
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
