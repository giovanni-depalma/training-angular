import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { CreateTodoInput } from '../../models/todo';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-todo-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
  host: { class: 'todo-form' }
})
export class TodoForm {
  readonly categories = input<Category[]>([]);
  readonly submitted = output<CreateTodoInput>();

  readonly form = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    categoryId: new FormControl<number | null>(null),
    completed: new FormControl<boolean>(false, { nonNullable: true })
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.submitted.emit({
      title: value.title,
      categoryId: value.categoryId ?? null,
      completed: value.completed
    });
    this.form.reset({ title: '', categoryId: null, completed: false });
  }
}
