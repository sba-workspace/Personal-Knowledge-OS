import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { NoteList } from '@/components/NoteList';
import { NoteView } from '@/components/NoteView';
import { NoteEditor } from '@/components/NoteEditor';
import { GraphView } from '@/components/GraphView';
import { SearchResults } from '@/components/SearchResults';

export type ViewType = 'notes' | 'note' | 'editor' | 'graph' | 'search';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('notes');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleViewChange = (view: ViewType, noteId?: string) => {
    setCurrentView(view);
    if (noteId) {
      setSelectedNoteId(noteId);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('search');
    } else {
      setCurrentView('notes');
    }
  };

  const handleNoteSelect = (id: string) => {
    setSelectedNoteId(id);
    setCurrentView('note');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'notes':
        return <NoteList onNoteSelect={handleNoteSelect} />;
      case 'note':
        return (
          <NoteView 
            noteId={selectedNoteId} 
            onEdit={() => handleViewChange('editor', selectedNoteId)}
            onBack={() => handleViewChange('notes')}
            onNoteSelect={handleNoteSelect}
          />
        );
      case 'editor':
        return (
          <NoteEditor 
            noteId={selectedNoteId}
            onSave={() => selectedNoteId ? handleViewChange('note', selectedNoteId) : handleViewChange('notes')}
            onCancel={() => selectedNoteId ? handleViewChange('note', selectedNoteId) : handleViewChange('notes')}
          />
        );
      case 'graph':
        return <GraphView onNodeClick={handleNoteSelect} />;
      case 'search':
        return <SearchResults query={searchQuery} onNoteSelect={handleNoteSelect} />;
      default:
        return <NoteList onNoteSelect={handleNoteSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar 
          isOpen={isSidebarOpen}
          currentView={currentView}
          onViewChange={handleViewChange}
          onNewNote={() => {
            setSelectedNoteId(null);
            handleViewChange('editor');
          }}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0' : 'ml-0'} lg:${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="h-full overflow-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;