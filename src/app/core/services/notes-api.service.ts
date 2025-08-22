import { Injectable } from '@angular/core';
import {Note, NoteId, NotePayload} from '../models/note.model';
import {createNote, deleteNote, fetchNodesFromDB, MOCK_NOTES, updateNote} from '../data/mock-notes';
import {delay, never, Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesApiService {

  private networkDelay = 200;

  fetchNotes(): Observable<Note[]> {
    return of(fetchNodesFromDB()).pipe(
      tap(() => console.log('Start: Simulating api call')),
      delay(this.networkDelay),
      tap(() => console.log('Start: Simulating api call')),
    );
  }

  createNote(payload: NotePayload): Observable<Note> {
    return of(createNote(payload)).pipe(
      tap(() => console.log('Start: Simulating api call')),
      delay(this.networkDelay),
      tap(() => console.log('Start: Simulating api call')),
    );
  }

  updateNote(id: NoteId, payload: NotePayload): Observable<Note> {
    return of(updateNote(id, payload)).pipe(
      tap(() => console.log('Start: Simulating api call')),
      delay(this.networkDelay),
      tap(() => console.log('Start: Simulating api call')),
    );
  }

  deleteNote(id: NoteId): Observable<NoteId> {

    return of(deleteNote(id)).pipe(
      tap(() => console.log('Start: Simulating api call')),
      delay(this.networkDelay),
      tap(() => console.log('Start: Simulating api call')),
    );
  }

}
