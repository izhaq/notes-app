import {
  ChangeDetectionStrategy,
  Component, computed,
  effect,
  input,
  output,
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Note, NotePayload} from '../../../../core/models/note.model';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-note-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteEditorComponent{

  note = input<Note | null>(null);

  noteUpdated = output<NotePayload>();

  public noteForm = new FormGroup({
    title: new FormControl('', {nonNullable: true}),
    content: new FormControl('', {nonNullable: true}),
  })

  private formValue = toSignal(
    this.noteForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
  );

  public disableUpdate = computed<boolean>(() => {
    const latestValue = this.formValue();
    const originalValue = this.note();

    return (!latestValue || (latestValue?.title === originalValue?.title) &&
      (latestValue?.content === originalValue?.content));
  })

  constructor() {

    effect(() => {
      const originalValue = this.note();

      if(originalValue !== null) {
        this.noteForm.patchValue(originalValue, {emitEvent: false});
      } else {
        this.noteForm.reset({title: '', content: ''}, { emitEvent: false});
      }
    });
  }

  onSaveNote(): void {
    console.log(this.note());
    console.log(this.formValue());
    console.log(this.disableUpdate());
    if(!this.disableUpdate()) {
      this.noteUpdated.emit({
        title: this.formValue()?.title ?? '',
        content: this.formValue()?.content ?? '',
      })
    }
  }
}
