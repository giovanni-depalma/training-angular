import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ContactsService } from './services/contacts.service';
import { GroupsService } from './services/groups.service';
import { ContactFilter } from './components/contact-filter/contact-filter';
import { ContactList } from './components/contact-list/contact-list';
import { ContactForm } from './components/contact-form/contact-form';
import { CreateContactInput } from './models/contact';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    ContactFilter,
    ContactList,
    ContactForm
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { class: 'app-root' }
})
export class App {
  private readonly contactsService = inject(ContactsService);
  private readonly groupsService = inject(GroupsService);

  // Expose readonly signals from services to the template
  readonly groups = this.groupsService.groups;
  readonly selectedGroupId = this.contactsService.selectedGroupId;
  readonly contacts = this.contactsService.contacts;

  // Merge loading and error from both services
  readonly loading = computed(() => this.groupsService.loading() || this.contactsService.loading());
  readonly error = computed(() => this.contactsService.error() ?? this.groupsService.error());

  // Event handlers
  onGroupChange(groupId: number | null): void {
    this.contactsService.setGroup(groupId);
  }

  onDelete(id: number): void {
    this.contactsService.delete(id);
  }

  onCreate(input: CreateContactInput): void {
    this.contactsService.create(input);
  }
}
