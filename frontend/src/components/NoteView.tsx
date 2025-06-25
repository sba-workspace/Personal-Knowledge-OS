
import React from 'react';
import { ArrowLeft, Edit, Calendar, Hash, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NoteViewProps {
  noteId: string | null;
  onEdit: () => void;
  onBack: () => void;
}

// Mock note data
const mockNote = {
  id: '1',
  title: 'React Architecture Patterns',
  summary: 'Exploring different architectural patterns in React applications including component composition and state management strategies.',
  content: `# React Architecture Patterns

React applications can be structured in many different ways, but following established architectural patterns can greatly improve maintainability and scalability.

## Component Composition

One of the most powerful patterns in React is component composition. This allows us to build complex UIs from simple, reusable components.

### Container and Presentational Components

- **Container Components**: Handle state and business logic
- **Presentational Components**: Focus purely on rendering UI

## State Management Strategies

### Local State
Use \`useState\` for component-specific state that doesn't need to be shared.

### Global State
For application-wide state, consider:
- React Context for simple cases
- Redux for complex state management
- Zustand for a lightweight alternative

## Performance Considerations

- Use React.memo for expensive renders
- Implement proper dependency arrays in useEffect
- Consider code splitting with React.lazy

## Conclusion

Choosing the right architectural pattern depends on your application's complexity and requirements.`,
  tags: ['React', 'Architecture', 'Frontend'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  linkedNotes: ['Database Design Principles', 'TypeScript Best Practices']
};

export const NoteView = ({ noteId, onEdit, onBack }: NoteViewProps) => {
  if (!noteId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Select a note to view its content</p>
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
            {mockNote.title}
          </h1>
          
          <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">AI Summary</h3>
            <p className="text-blue-800 text-sm">{mockNote.summary}</p>
          </Card>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Updated {mockNote.updatedAt.toLocaleDateString()}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {mockNote.tags.map((tag) => (
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
            {mockNote.content}
          </div>
        </div>

        {/* Linked Notes */}
        {mockNote.linkedNotes.length > 0 && (
          <Card className="p-4 mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Linked Notes</h3>
            <div className="space-y-2">
              {mockNote.linkedNotes.map((linkedNote, index) => (
                <button
                  key={index}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  → {linkedNote}
                </button>
              ))}
            </div>
          </Card>
        )}
      </article>
    </div>
  );
};
