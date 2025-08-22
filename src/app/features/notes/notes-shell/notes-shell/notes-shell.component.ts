import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {NotesService} from '../../services/notes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NotePayload} from '../../../../core/models/note.model';
import {SearchBarComponent} from '../../../../shared/components/search-bar/search-bar.component';
import {NoteListComponent} from '../../components/note-list/note-list.component';
import {NoteEditorComponent} from '../../components/note-editor/note-editor.component';

@Component({
  selector: 'app-notes-shell',
  imports: [
    SearchBarComponent,
    NoteListComponent,
    NoteEditorComponent
  ],
  templateUrl: './notes-shell.component.html',
  styleUrl: './notes-shell.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesShellComponent {

  public notesService = inject(NotesService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.activatedRoute.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
      params => {
        const id = params.get('id');
        this.notesService.setActiveNoteId(id);
      }
    )
  }

  public onSearchChanged(term: string): void {
    this.notesService.setSearchTerm(term);
  }

  public onNoteSelected(noteId: string): void {
    this.router.navigate([`/notes/${noteId}`]);
  }

  public onNoteUpdated(payload: NotePayload): void {
    const activeNoteId = this.notesService.activeNoteId();

    if (activeNoteId) {
      this.notesService.updateNote(activeNoteId, payload).subscribe();
    }
  }

  public onNoteDelete(noteId: string): void {
    this.notesService.deleteNote(noteId).subscribe(() => this.router.navigate([`/notes`]));
  }

  public onCreateNote(): void {
    this.notesService
      .createNote({title: 'Untitled', content: ''})
      .subscribe(newNote => this.router.navigate([`/notes`, newNote.id]));
  }
}
