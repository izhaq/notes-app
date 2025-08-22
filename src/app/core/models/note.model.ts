export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type NotePayload = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type NoteId = Note['id'];
