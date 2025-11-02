import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../models/group';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-contact-filter',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-filter.html',
  styleUrl: './contact-filter.css',
  host: { class: 'contact-filter' }
})
export class ContactFilter {
  readonly groups = input<Group[]>([]);
  readonly selectedGroupId = input<number | null>(null);

  readonly selectedChange = output<number | null>();

  onSelectionChange(val: number | null): void {
    this.selectedChange.emit(val);
  }
}
