# Progetto Blog — Spiegazione per chi inizia

Questo documento spiega il progetto Blog in modo semplice, suddividendo l’architettura in tre parti (Database, Backend, Frontend) e mostrando come parlano tra loro. Include una guida pratica per modifiche tipiche da esame (es.: aggiungere un campo al Post o una funzionalità come i like) e un glossario.

Tecnologie usate in questo progetto:
- Database: PostgreSQL
- Backend: C# (.NET)
- Frontend: Angular


## 1) Panorama generale
L’utente usa l’app web (Frontend). Il Frontend invia richieste HTTP al Backend per leggere/creare/cancellare Post e Commenti. Il Backend interagisce con PostgreSQL e risponde con JSON.

Schema concettuale:
```
[Browser/Frontend (Angular)]  ⇄  [Backend (C#/.NET) /api/...]  ⇄  [DB (PostgreSQL)]
```


## 2) Database (PostgreSQL)
- Tabelle tipiche:
  - `posts`: `id`, `title`, `body`, `created_at`, ...
  - `comments`: `id`, `post_id`, `author`, `content`, `created_at`, ...
- Relazione: `comments.post_id` → `posts.id` (molti commenti per un post).
- Il DB non è accessibile dal browser; il Backend fa da intermediario (sicurezza, validazioni).


## 3) Backend (C#/.NET) — a grandissime linee
- Espone API REST:
  - `GET /api/posts` → lista dei post con commenti.
  - `POST /api/posts` → crea un nuovo post.
  - `DELETE /api/posts/{id}` → elimina un post.
  - `POST /api/comments` → crea un commento per un post.
- Flusso tipico: valida dati → esegue query su PostgreSQL → ritorna JSON + codice HTTP.
- In sviluppo, il Frontend usa un dev proxy `/api` per inoltrare al server .NET locale.


## 4) Frontend (Angular) — struttura e approfondimento
Percorso: `blog/frontend/src/app`

### 4.1 API Client (HTTP)
- `api/posts.api.ts`
  - `baseUrl = '/api/posts'`
  - Metodi: `list()`, `create(input)`, `delete(id)`
- `api/comments.api.ts`
  - `baseUrl = '/api/comments'`
  - Metodi: `create(input)`

Uso tipico (`HttpClient` restituisce `Observable`):
```ts
this.http.get<Post[]>(this.baseUrl)
```

### 4.2 Modelli (tipi TypeScript)
- `models/post.ts`
  - `interface Post { id, title, body, createdAt, comments: Comment[] }`
  - `interface CreatePostInput { title, body }`
- `models/comment.ts`
  - `interface Comment { id, postId, author, content, createdAt }`
  - `interface CreateCommentInput { postId, author, content }`

### 4.3 Servizio applicativo (stato con Signals)
- `services/posts.service.ts`
  - Signals interni: `_posts`, `_loading`, `_error` (tutti `WritableSignal`)
  - Signals pubblici in sola lettura: `posts`, `loading`, `error`
  - Orchestrazione chiamate:
    - `refresh()` → carica lista post
    - `createPost(input)` → crea post e poi `refresh()`
    - `deletePost(id)` → elimina e poi `refresh()`
    - `createComment(input)` → crea commento e poi `refresh()`

Vantaggi dei Signals: quando il servizio aggiorna `_posts`, i componenti che leggono `posts()` si aggiornano automaticamente, con `ChangeDetectionStrategy.OnPush` efficiente.

### 4.4 Componenti UI (standalone)
- `components/post-form/*`
  - Scopo: form reattivo per creare un Post (Reactive Forms, validazioni, emette un `CreatePostInput`).
- `components/post-list/*`
  - Scopo: mostra la lista di Post. Espone `input()` per i post, `output()` per eventi (delete, submit comment).
  - Composizione: include `comments-list` (visualizza commenti) e `comment-form` (invia nuovo commento).
- `components/comments-list/*`
  - Scopo: renderizza i commenti di un post.
- `components/comment-form/*`
  - Scopo: Reactive Form per inviare un commento. Espone `input postId` e `output submitted`.

Pattern usati:
- Componenti standalone con `imports: [CommonModule, Material, ...]`.
- `input()`/`output()` (API semplice e tipizzata tra componenti).
- Reactive Forms: `FormGroup`, `FormControl`, `Validators`.
- Angular Material per UI (toolbar, card, button, input, ecc.).

### 4.5 Shell dell’app
- `app.ts` collega template e servizi: legge signals (`posts`, `loading`, `error`), passa i dati a `post-list`, gestisce eventi (crea/elimina post, invia commento).
- `app.component.html` è il template principale.

### 4.6 Routing
- `app.routes.ts` presente: nel progetto base la root visualizza la lista/forme. Puoi aggiungere nuove rotte (es.: dettaglio post) con lazy-loading se necessario.


## 5) Avvio in locale
1) Backend (.NET):
- Da `blog/backend` (cartella esempio):
  - `dotnet restore`
  - `dotnet run`
- URL locale es.: `https://localhost:5001` o `http://localhost:5000`.

2) Frontend (Angular):
- Da `blog/frontend`:
  - `npm install`
  - `npm start` (o `ng serve`)
- Browser: `http://localhost:4200`

3) Proxy di sviluppo
- Il Frontend chiama `/api/...`. Assicurati che il proxy Angular punti al backend locale (file proxy, es. `proxy.conf.json`).


## 6) Guida d’esame — modifiche tipiche
> In questa guida, le modifiche al database si applicano direttamente con SQL (senza migrazioni).

### 6.1 Aggiungere `excerpt` (riassunto) al Post
A) Database (PostgreSQL)
```sql
ALTER TABLE posts
  ADD COLUMN excerpt text NULL;
```

B) Backend (C#/.NET)
- Aggiorna DTO/modello per includere `Excerpt`.
```csharp
public class PostDto {
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? Excerpt { get; set; } // nuovo campo
}

public class CreatePostInput {
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? Excerpt { get; set; } // opzionale
}
```
- Negli endpoint `POST/GET /api/posts` mappa la proprietà verso/da DB.

C) Frontend (Angular)
- `models/post.ts`:
```ts
export interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  comments: Comment[];
  excerpt: string | null; // nuovo campo
}

export interface CreatePostInput {
  title: string;
  body: string;
  excerpt: string | null; // nuovo campo
}
```
- `post-form`: aggiungi un `FormControl('excerpt')` con `maxlength` se vuoi.
- `post-list`: visualizza l’excerpt se presente.
- `PostsApi`/`PostsService`: restano invariati; i tipi aggiornati propagano il nuovo campo.

### 6.2 Aggiungere `likeCount` (contatore like) al Post
A) Database
```sql
ALTER TABLE posts
  ADD COLUMN like_count integer NOT NULL DEFAULT 0;
```

B) Backend
- Aggiungi `LikeCount` a DTO/entità; espone un endpoint per incrementare (opzionale):
  - `POST /api/posts/{id}/like` → incrementa `like_count` e ritorna il post aggiornato.

C) Frontend
- `models/post.ts`:
```ts
export interface Post { /* ... */ likeCount: number; }
```
- UI: aggiungi un pulsante "Mi piace" accanto ad ogni Post; al click chiama `POST /api/posts/{id}/like` (puoi aggiungere un metodo in `PostsApi`), poi `refresh()` nel servizio.

### 6.3 Variante: `tags` per i Post
A) Database
- Opzione semplice (colonna testuale con lista separata da virgole):
```sql
ALTER TABLE posts ADD COLUMN tags text NULL; -- es.: "angular,typescript"
```

B) Backend
- Gestisci `Tags` come `string?` (CSV) o come tabella relazionale `post_tags` (più avanzato). Per l’esame va bene la variante CSV.

C) Frontend
- Modelli: `tags: string | null` e campo input nel form.
- In lista: mostra i tag splittando `tags?.split(',')` per renderizzare etichette.


## 7) Test manuale rapido
- Crea un Post con `excerpt` o `tags` e verifica che compaia.
- Prova il like e verifica l’incremento.
- Ricarica la pagina per verificare persistenza via backend/DB.


## 8) Buone pratiche
- Tipi rigorosi e `null` gestito esplicitamente.
- Signals + `OnPush` per performance.
- Validazione: lato Backend (fondamentale) e lato Frontend (UX migliore).
- Salva nel repository gli script SQL applicati (data/nome) per tracciare gli schemi.


## 9) Glossario veloce
- API, DTO, JSON, HTTP, Signal, Observable: vedi anche README del To‑Do per definizioni sintetiche.


## 10) Dove si trova questo documento
- File: `blog/README-progetto-blog.md`
