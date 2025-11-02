import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { CreatePostInput } from '../../models/post';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
  host: { class: 'post-form' }
})
export class PostForm {
  readonly submitted = output<CreatePostInput>();

  readonly form = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    body: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit(formDir: FormGroupDirective): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.submitted.emit({ title: value.title, body: value.body });
    // Use FormGroupDirective.resetForm to clear submitted/touched/dirty states
    formDir.resetForm({ title: '', body: '' });
  }
}
