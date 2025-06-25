
import React from 'react';
import { Calendar, Hash, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Note {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NoteListProps {
  onNoteSelect: (id: string) => void;
}

// Mock data for demonstration
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'React Architecture Patterns',
    summary: 'Exploring different architectural patterns in React applications including component composition and state management strategies.',
    content: '# React Architecture Patterns\n\nThis note explores...',
    tags: ['React', 'Architecture', 'Frontend'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Knowledge Graphs in AI',
    summary: 'Understanding how knowledge graphs enhance AI systems by providing structured relationships between entities.',
    content: '# Knowledge Graphs in AI\n\nKnowledge graphs are...',
    tags: ['AI', 'Knowledge Graph', 'Machine Learning'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Database Design Principles',
    summary: 'Core principles for designing scalable and maintainable database schemas with proper normalization.',
    content: '# Database Design Principles\n\nWhen designing databases...',
    tags: ['Database', 'SQL', 'Design'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const NoteList = ({ onNoteSelect }: NoteListProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Notes</h2>
        <p className="text-gray-600">
          {mockNotes.length} notes in your knowledge base
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockNotes.map((note) => (
          <Card 
            key={note.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-blue-300"
            onClick={() => onNoteSelect(note.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {note.title}
              </h3>
              <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {note.summary}
            </p>
            
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
              Updated {note.updatedAt.toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
