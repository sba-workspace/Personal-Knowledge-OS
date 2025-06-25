
import React from 'react';
import { FileText, Search, Network, Plus, Hash, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewType } from '@/pages/Index';

interface SidebarProps {
  isOpen: boolean;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onNewNote: () => void;
}

const navigationItems = [
  { id: 'notes' as ViewType, label: 'All Notes', icon: FileText },
  { id: 'graph' as ViewType, label: 'Knowledge Graph', icon: Network },
];

const mockTags = [
  'JavaScript', 'React', 'TypeScript', 'Database', 'AI', 'Machine Learning'
];

export const Sidebar = ({ isOpen, currentView, onViewChange, onNewNote }: SidebarProps) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}} 
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 top-16 lg:top-0
      `}>
        <div className="h-full flex flex-col py-6">
          {/* New Note Button */}
          <div className="px-4 mb-6">
            <Button 
              onClick={onNewNote}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Navigation */}
          <nav className="px-4 mb-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Button
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => onViewChange(item.id)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Recent Notes */}
          <div className="px-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Notes
            </h3>
            <ul className="space-y-1">
              {['Meeting Notes', 'Project Ideas', 'Research Links'].map((note, index) => (
                <li key={index}>
                  <button className="text-sm text-gray-600 hover:text-gray-900 block w-full text-left py-1 px-2 rounded hover:bg-gray-100">
                    {note}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="px-4 flex-1">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
              <Hash className="h-4 w-4 mr-2" />
              Tags
            </h3>
            <div className="space-y-1">
              {mockTags.map((tag) => (
                <button
                  key={tag}
                  className="text-sm text-gray-600 hover:text-gray-900 block w-full text-left py-1 px-2 rounded hover:bg-gray-100"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
