import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'notes',
  },
  {
    path: 'notes',
    loadChildren: () =>import('./features/notes/notes.routes').then(m => m.NOTES_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'notes',
  }
];
