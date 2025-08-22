import { Routes } from '@angular/router';
import {NotesShellComponent} from './notes-shell/notes-shell/notes-shell.component';

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    component: NotesShellComponent,
  },
  {
    path: ':id',
    component: NotesShellComponent,
  }
];
