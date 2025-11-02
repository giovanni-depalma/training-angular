import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Group } from '../../models/group';
import { CreateContactInput } from '../../models/contact';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
  host: { class: 'contact-form' }
})
export class ContactForm {
  readonly groups = input<Group[]>([]);
  readonly submitted = output<CreateContactInput>();

  readonly form = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(200)] }),
    phone: new FormControl<string | null>(null),
    groupIds: new FormControl<number[] | null>(null)
  });

  onSubmit(formDir: FormGroupDirective): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.submitted.emit({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone ?? null,
      groupIds: value.groupIds ?? null
    });
    // Reset using FormGroupDirective to clear the submitted/touched/dirty state
    formDir.resetForm({ firstName: '', lastName: '', email: '', phone: null, groupIds: null });
  }
}
