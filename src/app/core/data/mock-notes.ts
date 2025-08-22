import {Note, NoteId, NotePayload} from '../models/note.model';
import {delay, Observable, of, tap} from 'rxjs';

const OneDay = 24 * 60 * 60 * 1000;
const now = Date.now();
const oneDayAgo = now - OneDay
const twoDaysAgo = now - (2 * oneDayAgo);

export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Interview with Refael',
    content: 'It will be an interview foe a frontend expert position.\n Interview will include technicals questions about frontend in general and angular specifclly.\n it will be conducted by two interviews.',
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo
  },
  {
    id: 'note-2',
    title: 'Shopping list',
    content: '1. Milk\n2. Bread\n3. Cheese\n4. Snacks\n5. Apples\n6. Bananas',
    createdAt: oneDayAgo,
    updatedAt: now
  },
  {
    id: 'note-3',
    title: 'Actions items left to complete before flight to Italy',
    content: '1. check family passports\n2. Book hotel for last 2 days\n3. Buy some snacks',
    createdAt: now,
    updatedAt: now
  }
];

export const setNodesInDB = (notes: Note[]): void =>  {
  localStorage.setItem('notesDb', JSON.stringify(notes));
}

export const fetchNodesFromDB = (): Note[] => {
  try {
    const data = localStorage.getItem('notesDb')!;
    const notes: Note[] = JSON.parse(data);

    if(notes && notes.length > 0){
      return notes;
    }

    setNodesInDB(MOCK_NOTES);

    return [...MOCK_NOTES];

  }catch (error) {

    setNodesInDB(MOCK_NOTES);

    return [...MOCK_NOTES];
  }
}

export const createNote = (payload: NotePayload): Note => {
  const now = Date.now();
  const newNote: Note = {
    id: `note-${crypto.randomUUID()}`,
    createdAt: now,
    updatedAt: now,
    ...payload
  }

  const currentNotesData = [newNote, ...fetchNodesFromDB()];

  setNodesInDB(currentNotesData);

  return newNote;
}

export const updateNote = (id: NoteId, payload: NotePayload): Note => {
  let currentNotesData = fetchNodesFromDB();

  const noteToUpdate = currentNotesData.find((note) => note.id === id)!;

  const updatedNote: Note = {
    ...noteToUpdate,
    ...payload,
    updatedAt: Date.now()
  };

  currentNotesData = [updatedNote, ...currentNotesData.filter(note => note.id !== id)];

  setNodesInDB(currentNotesData);

  return updatedNote;
}

export const deleteNote = (id: NoteId): NoteId => {
  let currentNotesData = fetchNodesFromDB();

  const noteIndexToDelete = currentNotesData.findIndex((note) => note.id === id)!;

  currentNotesData.splice(noteIndexToDelete, 1);

  setNodesInDB(currentNotesData);

  return id;
}































































































































































































































































































































































































































