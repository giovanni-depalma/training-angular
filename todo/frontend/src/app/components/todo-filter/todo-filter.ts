import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-todo-filter',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-filter.html',
  styleUrl: './todo-filter.css',
  host: {
    class: 'todo-filter'
  }
})
export class TodoFilter {
  // Input signals
  readonly categories = input<Category[]>([]);
  readonly selectedCategoryId = input<number | null>(null);

  // Output event
  readonly selectedChange = output<number | null>();

  onSelectionChange(val: number | null): void {
    this.selectedChange.emit(val);
  }
}
