# Progetto To‑Do — Spiegazione per chi inizia

Questo documento spiega il progetto To‑Do in modo semplice, suddividendo l’architettura in tre parti (Database, Backend, Frontend) e mostrando come parlano tra loro. Include anche una guida pratica per modificare il progetto durante un esame (es.: aggiungere un nuovo campo ai To‑Do) e un breve glossario.

Tecnologie usate in questo progetto:
- Database: PostgreSQL
- Backend: C# (.NET)
- Frontend: Angular


## 1) Panorama generale
L’utente usa l’applicazione web nel browser (Frontend). Il Frontend invia richieste HTTP al Backend per leggere/creare/cancellare To‑Do. Il Backend, a sua volta, legge e scrive i dati nel Database PostgreSQL e risponde al Frontend con risultati in formato JSON.

Schema concettuale:
```
[Browser/Frontend (Angular)]  ⇄  [Backend (C#/.NET) /api/...]  ⇄  [DB (PostgreSQL)]
```


## 2) Database (PostgreSQL)
- Scopo: conservare in modo persistente i dati dei To‑Do.
- Tabelle tipiche:
  - `todos`: `id`, `title`, `completed`, `created_at`, `category_id`, ...
  - `categories`: `id`, `name`, ...
- Relazioni: `todos.category_id` è una chiave esterna verso `categories.id` (facoltativa se si vogliono le categorie).
- Il database non è accessibile direttamente dal browser: il Backend fa da intermediario (sicurezza e regole di business).


## 3) Backend (C#/.NET) — a grandissime linee
- Espone API HTTP REST per operare sui To‑Do. Esempi:
  - `GET /api/todos?categoryId=...` → lista dei To‑Do, filtrabile per categoria.
  - `POST /api/todos` → crea un nuovo To‑Do.
  - `DELETE /api/todos/{id}` → elimina un To‑Do.
- Flusso tipico per una richiesta:
  1. Valida i dati ricevuti (es. campi obbligatori).
  2. Interagisce con PostgreSQL (query o tramite ORM come Entity Framework).
  3. Risponde con JSON (dati o messaggio d’errore) e un codice HTTP (200, 201, 400, 404, ecc.).
- In sviluppo, il Frontend usa un “dev proxy” su `/api` che inoltra le richieste al server .NET in esecuzione locale.


## 4) Frontend (Angular) — struttura
Percorso di riferimento: `todo/frontend/src/app`
- API client (chiamate HTTP):
  - `api/todos.api.ts` → chiama le rotte del Backend per i To‑Do.
  - `api/categories.api.ts` → chiama le rotte del Backend per le Categorie.
- Servizi (stato e orchestrazione):
  - `services/todos.service.ts` → gestisce lo stato dei To‑Do con Angular Signals e usa `TodosApi`.
- Componenti UI:
  - `components/todo-list/*` → mostra la lista dei To‑Do.
  - `components/todo-filter/*` → selezione/filtraggio per categoria.
  - `components/todo-form/*` → form per creare nuovi To‑Do (presente in base ai riferimenti import).
- Bootstrap/app shell:
  - `app.ts` e `app.component.html` → entrypoint e template principale.

Estratto reale (semplificato) da `services/todos.service.ts` per capire il flusso:
```
readonly todos = this._todos.asReadonly();

refresh(categoryId: number | null = this._selectedCategoryId()): void {
  this._loading.set(true);
  this._error.set(null);
  this.api.list({ categoryId }).subscribe({
    next: (data) => this._todos.set(data),
    error: () => this._error.set('Errore nel caricamento dei To‑Do'),
    complete: () => this._loading.set(false)
  });
}
```


## 5) Come avviare il progetto in locale
Di seguito uno schema tipico. Adatta i comandi se nel tuo ambiente ci sono script specifici.

1. Avviare il Backend (C#/.NET)
   - Requisiti: .NET SDK installato.
   - Dalla cartella del backend (es.: `todo/backend`):
     - Ripristino pacchetti: `dotnet restore`
     - Esecuzione (sviluppo): `dotnet run`
   - Il server espone le API su un URL locale (es.: `https://localhost:5001` o `http://localhost:5000`). Assicurati che il proxy del Frontend punti correttamente qui.

2. Avviare il Frontend (Angular)
   - Requisiti: Node.js + npm installati.
   - Dalla cartella `todo/frontend`:
     - Installa dipendenze: `npm install`
     - Avvia in sviluppo: `npm start` oppure `ng serve` (a seconda degli script presenti)
   - Apri il browser su `http://localhost:4200`.

3. Proxy di sviluppo (Front-end → Back-end)
   - Il Frontend chiama il Backend via `/api/...` (vedi `api/todos.api.ts` con `baseUrl = '/api/todos'`).
   - In sviluppo, Angular dev server inoltra `/api` al vero server .NET (configurazione proxy, di solito in `proxy.conf.json`). Se non funziona, controlla la configurazione proxy e l’URL del Backend.


## 6) Guida d’esame — aggiungere un nuovo campo a `Todo`
Vengono mostrati due esempi molto frequenti: una data di scadenza (`dueDate`) e una priorità (`priority`). Segui lo stesso schema in tre livelli: Database, Backend, Frontend.

> Nota: Adatta i nomi se la commissione chiede un altro campo; la procedura resta identica.
> In questa guida semplificata, le modifiche al database si applicano direttamente con SQL, senza usare migrazioni.

### 6.1) Aggiungere `dueDate` (data di scadenza)

A) Database (PostgreSQL)
- SQL diretto da eseguire sul DB:
```sql
ALTER TABLE todos
  ADD COLUMN due_date timestamp with time zone NULL;
```

B) Backend (C#/.NET)
- Aggiorna i modelli/DTO e la logica di persistenza per includere `DueDate`.
  - Esempio di DTO (semplificato):
    ```csharp
    public class TodoDto {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool Completed { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CategoryId { get; set; }
        public DateTimeOffset? DueDate { get; set; } // nuovo campo
    }

    public class CreateTodoInput {
        public string Title { get; set; } = string.Empty;
        public bool Completed { get; set; }
        public int? CategoryId { get; set; }
        public DateTimeOffset? DueDate { get; set; } // nuovo campo
    }
    ```
  - Negli endpoint (`POST /api/todos`, `GET /api/todos`) mappa il campo da/verso il DB.

C) Frontend (Angular)
- Modifica `todo/frontend/src/app/models/todo.ts`:
  ```ts
  export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string; // ISO UTC dal backend
    categoryId: number | null;
    dueDate: string | null; // nuovo campo
  }

  export interface CreateTodoInput {
    title: string;
    completed: boolean;
    categoryId: number | null;
    dueDate: string | null; // nuovo campo
  }
  ```
- Form di creazione (`components/todo-form`): aggiungi un `FormControl` e un input HTML (es. `type="date"`). Prima dell’invio, converti in ISO string se necessario.
- Lista (`components/todo-list`): mostra il valore se presente.
- `TodosApi`/`TodosService`: i metodi restano invariati; i tipi aggiornati faranno transitare il nuovo campo.


### 6.2) Aggiungere `priority` (bassa/media/alta)

A) Database (PostgreSQL)
- Variante semplice con `TEXT` e vincolo di check:
```sql
ALTER TABLE todos
  ADD COLUMN priority text NULL;

ALTER TABLE todos
  ADD CONSTRAINT chk_todos_priority
  CHECK (priority IN ('low','medium','high'));
```

B) Backend (C#/.NET)
- Rappresenta la priorità come `string` vincolata o come `enum`.
  - Esempio con enum:
    ```csharp
    public enum Priority { Low, Medium, High }

    public class TodoDto {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool Completed { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? CategoryId { get; set; }
        public Priority? Priority { get; set; } // nuovo campo
    }

    public class CreateTodoInput {
        public string Title { get; set; } = string.Empty;
        public bool Completed { get; set; }
        public int? CategoryId { get; set; }
        public Priority? Priority { get; set; } // nuovo campo
    }
    ```
  - Se preferisci stringhe (`"low"|"medium"|"high"`), valida i valori in controller/service.

C) Frontend (Angular)
- Aggiorna i modelli TypeScript:
  ```ts
  export type Priority = 'low' | 'medium' | 'high';

  export interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    categoryId: number | null;
    priority: Priority | null; // nuovo campo
  }

  export interface CreateTodoInput {
    title: string;
    completed: boolean;
    categoryId: number | null;
    priority: Priority | null; // nuovo campo
  }
  ```
- Nel form di creazione aggiungi una `select`:
  ```html
  <label>
    Priorità
    <select [formControl]="form.controls.priority">
      <option [ngValue]="null">(nessuna)</option>
      <option value="low">Bassa</option>
      <option value="medium">Media</option>
      <option value="high">Alta</option>
    </select>
  </label>
  ```
- In lista, mostra un badge/etichetta in base alla priorità; puoi usare classi CSS condizionali.


### 6.3) Test manuale rapido
- Crea un To‑Do con il nuovo campo valorizzato (scadenza o priorità).
- Verifica che compaia correttamente in lista e che al refresh della pagina il dato sia ancora presente (quindi salvato in DB via Backend).
- Prova anche il caso con campo `null` o non impostato.


## 7) Buone pratiche sintetiche
- Tipi rigorosi: usa interfacce/enum su Frontend e DTO/entità su Backend; evita tipi generici non necessari.
- UI reattiva: sfrutta Signals (`signal`, `computed`, `effect`) e `ChangeDetectionStrategy.OnPush` per performance.
- Validazione: lato Backend (fondamentale) e lato Frontend (per UX). 
- Compatibilità: gestisci i valori `null` per i record già esistenti.
- Script SQL: salva nel repository gli script SQL usati per modificare lo schema (con versione/data) per tenere traccia dei cambiamenti anche senza sistema di migrazioni.


## 8) Glossario veloce (per chi inizia)
- API: insieme di “porte” (URL) che il Backend espone; il Frontend le chiama per ottenere o modificare dati.
- JSON: formato testuale per scambiare dati tra client e server (es.: `{ "title": "Comprare il latte" }`).
- DTO (Data Transfer Object): oggetto “da trasporto” usato per inviare/ricevere dati (es.: `CreateTodoInput`).
- ORM (Object‑Relational Mapper): libreria che mappa oggetti del linguaggio alle tabelle del DB (es.: Entity Framework).
- HTTP: protocollo usato per comunicare tra browser e server (metodi comuni: GET, POST, DELETE).
- Signal (Angular): variabile reattiva che notifica automaticamente i cambiamenti ai componenti che la usano.
- Observable (RxJS): flusso di dati che possono arrivare nel tempo; `HttpClient` restituisce Observables per le chiamate HTTP.


## 9) Dove si trova questo documento
- File: `todo/README-progetto-todo.md`

Se vuoi, posso integrare con esempi più specifici (controller C# reali, configurazione proxy Angular, snippet di form completi) in base ai dettagli del tuo backend.