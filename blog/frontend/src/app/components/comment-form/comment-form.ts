import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { CreateCommentInput } from '../../models/comment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
  host: { class: 'comment-form' }
})
export class CommentForm {
  readonly postId = input<number>(0);
  readonly submitted = output<CreateCommentInput>();

  readonly form = new FormGroup({
    author: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  onSubmit(formDir: FormGroupDirective): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.submitted.emit({ postId: this.postId(), author: value.author, content: value.content });
    // Reset submitted/touched state so fields don't appear in error after successful submit
    formDir.resetForm({ author: '', content: '' });
  }
}
