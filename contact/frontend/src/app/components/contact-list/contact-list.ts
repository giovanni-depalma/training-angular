import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../models/contact';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
  host: { class: 'contact-list' }
})
export class ContactList {
  readonly contacts = input<Contact[]>([]);
  readonly deleteClicked = output<number>();
}
