import {computed, inject, Injectable, signal} from '@angular/core';
import {NotesApiService} from '../../../core/services/notes-api.service';
import {Note, NoteId, NotePayload} from '../../../core/models/note.model';
import {catchError, EMPTY, finalize, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private noteApiService = inject(NotesApiService);

  private _notes = signal<Note[]>([]);
  private _activeNoteId = signal<NoteId | null>(null);
  private _searchTerm = signal<string>('');
  private _isLoading = signal<boolean>(true);
  private _error = signal<string | null>(null);

  public notes = this._notes.asReadonly();
  public activeNoteId = this._activeNoteId.asReadonly()
  public searchTerm = this._searchTerm.asReadonly();
  public isLoading = this._isLoading.asReadonly();
  public error = this._error.asReadonly();

  public activeNote = computed<Note>(() => {

    return this.notes().find((note) => note.id === this.activeNoteId())!;
  });

  public filteredNotes = computed(() => {
    const searchTerm = this.searchTerm().toLowerCase();

    return searchTerm ? this.notes().filter(note =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm)
        ) : this.notes();
  });

  constructor() {
    this.loadNotes();
  }

  public setActiveNoteId(id: NoteId | null): void {
    this._activeNoteId.set(id);
  }

  public setSearchTerm(searchTerm: string): void {
    this._searchTerm.set(searchTerm);
  }

  public createNote(payload: NotePayload): Observable<Note> {
    const action$ = this.noteApiService.createNote(payload).pipe(
      tap(newNote => {
        this._notes.update(notes => [newNote, ...notes]);
        this.setActiveNoteId(newNote.id);
      })
    );

    return this.handleAction<Note>(action$);
  }

  public updateNote(id: NoteId, payload: NotePayload): Observable<Note> {
    const action$ = this.noteApiService.updateNote(id, payload)
      .pipe(
        tap(updatedNote => {
          this._notes.update(notes =>
            notes.map(noteItem => noteItem.id === id ? updatedNote: noteItem)
          )
      })
    )

    return this.handleAction<Note>(action$);
  }

  public deleteNote(id: NoteId): Observable<NoteId> {
    const action$ = this.noteApiService.deleteNote(id).pipe(
      tap(() => {
        if (this.activeNoteId() === id) {
          this.setActiveNoteId(null);
        }

        this._notes.update(notes => notes.filter(note => note.id !== id));
      })
    )

    return this.handleAction<NoteId>(action$);
  }

  private loadNotes(): void {
    const action$ = this.noteApiService.fetchNotes().pipe(
      tap(notes => this._notes.set(notes))
    );

    this.handleAction<Note[]>(action$).subscribe(notes => this._notes.set(notes));
  }


  private handleAction<T>(action$: Observable<T>): Observable<T> {
    this._isLoading.set(true);
    this._error.set(null);

    return action$.pipe(
      finalize(() => this._isLoading.set(false)),
      catchError(err => {
        this._error.set(err.message);

        return EMPTY;
      })
    )
  }
}
