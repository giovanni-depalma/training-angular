# Progetto Contact — Spiegazione per chi inizia

Questo documento spiega il progetto Contact in modo semplice, dividendo l’architettura in Database, Backend e Frontend e mostrando come comunicano. Include una guida pratica per modifiche tipiche da esame (aggiungere un campo o uno stato del contatto) e un glossario.

Tecnologie usate in questo progetto:
- Database: PostgreSQL
- Backend: C# (.NET)
- Frontend: Angular


## 1) Panorama generale
Il Frontend (Angular) permette di gestire contatti e gruppi. Le azioni dell’utente (creare/eliminare contatti, filtrare per gruppo) generano richieste HTTP verso il Backend .NET, che legge/scrive su PostgreSQL e risponde con JSON.

Schema concettuale:
```
[Browser/Frontend (Angular)]  ⇄  [Backend (C#/.NET) /api/...]  ⇄  [DB (PostgreSQL)]
```


## 2) Database (PostgreSQL)
- Tabelle tipiche:
  - `contacts`: `id`, `name`, `email`, `group_id`, `created_at`, ...
  - `groups`: `id`, `name`
- Relazione: `contacts.group_id` → `groups.id` (molti contatti per un gruppo).
- Il DB non è accessibile dal browser; il Backend gestisce validazioni, sicurezza e regole.


## 3) Backend (C#/.NET) — a grandissime linee
- API REST esposte (nomenclatura attesa dai client Angular del progetto):
  - `GET /api/contacts?groupId=...` → lista contatti, filtrabile per gruppo.
  - `POST /api/contacts` → crea un contatto.
  - `DELETE /api/contacts/{id}` → elimina un contatto.
  - `GET /api/groups` → elenco gruppi.
- Flusso tipico: valida input → esegue query su PostgreSQL → ritorna JSON con codice HTTP appropriato.
- In sviluppo, il Frontend usa un dev proxy `/api` verso il server .NET locale.


## 4) Frontend (Angular) — struttura e approfondimento
Percorso: `contact/frontend/src/app`

### 4.1 API Client (HTTP)
- `api/contacts.api.ts`
  - `baseUrl = '/api/contacts'`
  - Metodi: `list({ groupId? })`, `create(input)`, `delete(id)`
- `api/groups.api.ts`
  - `baseUrl = '/api/groups'`
  - Metodi: `list()`

### 4.2 Modelli (tipi TypeScript)
- `models/contact.ts`
  - `interface Contact { id, name, email, groupId | null, createdAt }`
  - `interface CreateContactInput { name, email, groupId | null }`
- `models/group.ts`
  - `interface Group { id, name }`

### 4.3 Servizi applicativi (stato con Signals)
- `services/contacts.service.ts`
  - Signals interni: `_selectedGroupId`, `_contacts`, `_loading`, `_error`.
  - Signals pubblici (readonly): `selectedGroupId`, `contacts`, `loading`, `error`.
  - `effect` su `_selectedGroupId`: quando cambia il gruppo selezionato, richiama automaticamente `refresh(groupId)`.
  - Metodi: `setGroup(groupId)`, `refresh(groupId?)`, `create(input)`, `delete(id)`.
- `services/groups.service.ts`
  - Carica la lista dei gruppi; espone signals `groups`, `loading`, `error`.

Perché i Signals: aggiornano reattivamente i componenti che li leggono, con `ChangeDetectionStrategy.OnPush` efficiente.

### 4.4 Componenti UI (standalone) e responsabilità
- `components/contact-filter/*`
  - Scopo: selezione/filtraggio per gruppo. Espone `output` con l’`id` del gruppo scelto o `null`.
- `components/contact-list/*`
  - Scopo: mostra l’elenco contatti e emette eventi di eliminazione.
- `components/contact-form/*`
  - Scopo: Reactive Form per creare un contatto. Input opzionale: elenco gruppi per popolare una `select`. Output: `CreateContactInput`.

Pattern usati:
- Componenti standalone; API tra componenti con `input()`/`output()`.
- Reactive Forms per validazioni (required, email, max length, ecc.).
- Angular Material per UI (toolbar, card, list, button, icon, spinner).

### 4.5 Shell dell’app
- `app.ts` compone il tutto: inietta `ContactsService` e `GroupsService`, espone i signals al template (`app.component.html`), e gestisce gli eventi dei componenti figli (cambio gruppo, crea, elimina).

### 4.6 Routing
- `app.routes.ts` presente. Nel progetto base, la root mostra filtro, lista e form. Ulteriori rotte possono essere aggiunte se richiesto (es. dettaglio contatto).


## 5) Avvio in locale
1) Backend (.NET):
- Da `contact/backend` (cartella esempio):
  - `dotnet restore`
  - `dotnet run`
- URL locale es.: `https://localhost:5001` o `http://localhost:5000`.

2) Frontend (Angular):
- Da `contact/frontend`:
  - `npm install`
  - `npm start` (o `ng serve`)
- Browser: `http://localhost:4200`

3) Proxy di sviluppo
- Il Frontend chiama `/api/...`. Verifica che il proxy Angular punti al backend locale.


## 6) Guida d’esame — modifiche tipiche
> In questa guida, le modifiche al database si applicano direttamente con SQL (senza migrazioni).

### 6.1 Aggiungere `phoneNumber` al Contatto
A) Database (PostgreSQL)
```sql
ALTER TABLE contacts
  ADD COLUMN phone_number text NULL;
```

B) Backend (C#/.NET)
- Aggiorna DTO/modello per includere `PhoneNumber` (stringa opzionale):
```csharp
public class ContactDto {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? GroupId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? PhoneNumber { get; set; } // nuovo campo
}

public class CreateContactInput {
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? GroupId { get; set; }
    public string? PhoneNumber { get; set; } // opzionale
}
```
- Valida lato server (es. lunghezza/regex basica) e mappa verso/da DB negli endpoint `POST/GET /api/contacts`.

C) Frontend (Angular)
- `models/contact.ts`:
```ts
export interface Contact {
  id: number;
  name: string;
  email: string;
  groupId: number | null;
  createdAt: string;
  phoneNumber: string | null; // nuovo campo
}

export interface CreateContactInput {
  name: string;
  email: string;
  groupId: number | null;
  phoneNumber: string | null; // nuovo campo
}
```
- `contact-form`: aggiungi `FormControl('phoneNumber')` (validazioni: opzionale, `maxlength`, eventualmente regex).
- `contact-list`: mostra il numero se presente.
- `ContactsApi`/`ContactsService`: nessun cambio di codice, i tipi aggiornati faranno transitare il nuovo campo.

### 6.2 Aggiungere `status` al Contatto (`new | read | archived`)
A) Database (PostgreSQL)
```sql
ALTER TABLE contacts
  ADD COLUMN status text NOT NULL DEFAULT 'new';

ALTER TABLE contacts
  ADD CONSTRAINT chk_contacts_status
  CHECK (status IN ('new','read','archived'));
```

B) Backend (C#/.NET)
- Usa un `enum` o una string con validazione.
```csharp
public enum ContactStatus { New, Read, Archived }

public class ContactDto {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? GroupId { get; set; }
    public DateTime CreatedAt { get; set; }
    public ContactStatus Status { get; set; } // nuovo campo
}

public class CreateContactInput {
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? GroupId { get; set; }
    public ContactStatus Status { get; set; } = ContactStatus.New; // default
}
```
- Endpoints: accetta/ritorna `Status`. Se preferisci valori stringa (`"new"|"read"|"archived"`), valida in controller/service.

C) Frontend (Angular)
- `models/contact.ts`:
```ts
export type ContactStatus = 'new' | 'read' | 'archived';

export interface Contact { /* ... */ status: ContactStatus; }

export interface CreateContactInput { /* ... */ status: ContactStatus; }
```
- `contact-form`: aggiungi `select` per scegliere lo stato iniziale:
```html
<label>
  Stato
  <select [formControl]="form.controls.status">
    <option value="new">Nuovo</option>
    <option value="read">Letto</option>
    <option value="archived">Archiviato</option>
  </select>
</label>
```
- `contact-list`: mostra un badge/colore diverso in base allo stato.


## 7) Test manuale rapido
- Crea un contatto con `phoneNumber` e verifica che sia mostrato; ricarica la pagina per confermare la persistenza.
- Crea un contatto con stato non di default (es. `archived`) e verifica che sia visualizzato correttamente.


## 8) Buone pratiche
- Tipi rigorosi e gestione esplicita dei `null`.
- Signals + `OnPush` per UI reattiva e performante.
- Validazioni su Backend e Frontend per coerenza e UX.
- Conserva nel repository gli script SQL applicati (data/nome) per tracciare le modifiche di schema anche senza sistema di migrazioni.


## 9) Glossario veloce
- API, DTO, JSON, HTTP, Signal, Observable: vedi anche README del To‑Do per definizioni sintetiche.


## 10) Dove si trova questo documento
- File: `contact/README-progetto-contact.md`
