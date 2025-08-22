import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {NoteItemComponent} from '../note-item/note-item.component';
import {Note} from '../../../../core/models/note.model';

@Component({
  selector: 'app-note-list',
  imports: [NoteItemComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent {

  notes = input.required<Note[]>();

  activeNodeId = input<string | null>(null);

  noteSelected = output<string>();

  noteDeleted = output<string>();
}
