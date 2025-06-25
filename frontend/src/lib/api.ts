// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Note {
  id: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoteRequest {
  content: string;
  tags?: string[];
}

export interface UpdateNoteRequest {
  content?: string;
  summary?: string;
  tags?: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Notes API
  async createNote(data: CreateNoteRequest): Promise<Note> {
    return this.request<Note>('/notes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNote(id: string): Promise<Note> {
    return this.request<Note>(`/notes/${id}`);
  }

  async updateNote(id: string, data: UpdateNoteRequest): Promise<Note> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: string): Promise<void> {
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async listNotes(): Promise<Note[]> {
    return this.request<Note[]>('/notes/');
  }

  async searchNotes(query: string, limit: number = 5): Promise<Note[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });
    return this.request<Note[]>(`/notes/search/?${params}`);
  }

  async processNote(id: string): Promise<Note> {
    return this.request<Note>(`/notes/${id}/process`, {
      method: 'POST',
    });
  }

  async getRelatedNotes(id: string): Promise<Note[]> {
    return this.request<Note[]>(`/notes/${id}/related`);
  }

  // Links API
  async createLink(sourceId: string, targetId: string): Promise<void> {
    return this.request<void>(`/notes/${sourceId}/link/${targetId}`, {
      method: 'POST',
    });
  }

  async removeLink(sourceId: string, targetId: string): Promise<void> {
    return this.request<void>(`/notes/${sourceId}/link/${targetId}`, {
      method: 'DELETE',
    });
  }

  async getLinkedNotes(id: string): Promise<Note[]> {
    return this.request<Note[]>(`/notes/${id}/links`);
  }

  async autoLinkNotes(id: string): Promise<Note[]> {
    return this.request<Note[]>(`/notes/${id}/auto-link`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();