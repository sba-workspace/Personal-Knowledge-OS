import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, Note, CreateNoteRequest, UpdateNoteRequest } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => apiClient.listNotes(),
  });
};

export const useNote = (id: string | null) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => id ? apiClient.getNote(id) : null,
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateNoteRequest) => apiClient.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create note');
      console.error('Create note error:', error);
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteRequest }) =>
      apiClient.updateNote(id, data),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', updatedNote.id] });
      toast.success('Note updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update note');
      console.error('Update note error:', error);
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete note');
      console.error('Delete note error:', error);
    },
  });
};

export const useSearchNotes = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => apiClient.searchNotes(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return {
    query,
    setQuery,
    results: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    error: searchQuery.error,
  };
};

export const useRelatedNotes = (id: string | null) => {
  return useQuery({
    queryKey: ['related', id],
    queryFn: () => id ? apiClient.getRelatedNotes(id) : [],
    enabled: !!id,
  });
};

export const useLinkedNotes = (id: string | null) => {
  return useQuery({
    queryKey: ['linked', id],
    queryFn: () => id ? apiClient.getLinkedNotes(id) : [],
    enabled: !!id,
  });
};