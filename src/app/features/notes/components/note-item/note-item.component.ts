import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {Note} from '../../../../core/models/note.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-note-item',
  imports: [
    DatePipe
  ],
  templateUrl: './note-item.component.html',
  styleUrl: './note-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteItemComponent {

  note = input.required<Note>();
  isActive = input<boolean>(false);

  selected = output<string>();
  deleted = output<string>();

  public contentPreview = computed(() => {
    const content = this.note().content

    return content.length > 60 ? content.substring(0, 60).replace(/\n/g, ' ') + '...' : content.replace(/\n/g, ' ');
  })

  public onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleted.emit(this.note().id);
  }
}
