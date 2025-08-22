import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements OnInit{

  searchChange = output<string>();

  private destroy$ = inject(DestroyRef);
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroy$)
    )
    .subscribe(searchTerm => this.searchChange.emit(searchTerm));
  }

  public onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value)
  }
}
