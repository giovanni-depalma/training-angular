# training-angular

prova 1 – To‑Do List

Crea una tabella todo (id, title, completed, created_at) in PostgreSQL.
Implementa un’API C# con endpoint GET /todos, POST /todos e DELETE /todos/{id}.
Realizza un’app Angular con componente per visualizzare la lista e form per aggiungere un nuovo todo, usando un servizio che chiama le API.
Task aggiuntivo 1: aggiungi tabella category (id, name) e relazione uno‑a‑molti con todo; popola la tabella con alcune categorie predefinite.
Task aggiuntivo 2: aggiungi nel frontend un filtro a tendina per categoria che mostri solo i todo della categoria selezionata.

esame prova 2 – Gestione contatti

Progetta una tabella contact (id, first_name, last_name, email, phone) in PostgreSQL.
Implementa un’API C# con GET /contacts, POST /contacts e DELETE /contacts/{id}.
Realizza un’interfaccia Angular per elencare i contatti e aggiungerne di nuovi.
Task extra 1: crea una tabella group (id, name) e collega i contatti con una relazione molti‑a‑molti (tabella ponte).
Task extra 2: aggiungi nel frontend un filtro a tendina per gruppo, mostrando solo i contatti appartenenti al gruppo scelto.

esame prova 3– Mini‑blog

Definisci la tabella post (id, title, body, created_at) in PostgreSQL.
Realizza un’API C# con gli endpoint GET /posts, POST /posts e DELETE /posts/{id}.
Costruisci un’app Angular che elenchi i post e permetta di crearne di nuovi tramite un form.
Task extra 1: aggiungi la tabella comment (id, post_id FK, author, content, created_at) per gestire la relazione molti‑a‑uno (un post può avere più commenti); inserisci alcuni commenti di esempio.
Task extra 2: nel frontend mostra, sotto ogni post, la lista dei relativi commenti e fornisci un piccolo form per aggiungere un nuovo commento (POST /comments).
Mi piace questa risposta
Segnala un problema

## Note progetto

- .gitignore: è stato aggiunto un file `.gitignore` alla radice che copre sia .NET (bin/obj, .vs, TestResults, ecc.) sia Angular (node_modules, dist, .angular, coverage). In questo modo possiamo mantenere un’unica configurazione valida per tutto il repo. Se in futuro vorrai usare un `.gitignore` separato all’interno della cartella dell’app Angular, potremo farlo senza conflitti: le regole più specifiche locali hanno priorità.
- Dipendenze backend: è stato rimosso il pacchetto `Microsoft.EntityFrameworkCore.Design` perché serve principalmente per tooling di design‑time (scaffolding/migrations). In questo progetto lo schema del DB è gestito dagli script SQL in `todo/init-scripts`, quindi non è necessario. Restano `Microsoft.EntityFrameworkCore` e `Npgsql.EntityFrameworkCore.PostgreSQL` per l’accesso al DB e `Swashbuckle.AspNetCore` per Swagger (documentazione live delle API).
- Commenti nel codice: sono stati aggiunti commenti ed XML docs in `Program.cs`, `Controllers/TodosController.cs`, `Models/*.cs` e `Data/TodoDbContext.cs` per facilitare la lettura a chi è alle prime armi.

Se in futuro vorremo introdurre le Migration di EF Core, potremo ri‑aggiungere il pacchetto `Microsoft.EntityFrameworkCore.Design` e abilitare la pipeline delle migrazioni; per ora è più semplice e trasparente usare gli script SQL già presenti.

# training-angular

prova 1 – To‑Do List

Crea una tabella todo (id, title, completed, created_at) in PostgreSQL.
Implementa un’API C# con endpoint GET /todos, POST /todos e DELETE /todos/{id}.
Realizza un’app Angular con componente per visualizzare la lista e form per aggiungere un nuovo todo, usando un servizio che chiama le API.
Task aggiuntivo 1: aggiungi tabella category (id, name) e relazione uno‑a‑molti con todo; popola la tabella con alcune categorie predefinite.
Task aggiuntivo 2: aggiungi nel frontend un filtro a tendina per categoria che mostri solo i todo della categoria selezionata.

esame prova 2 – Gestione contatti

Progetta una tabella contact (id, first_name, last_name, email, phone) in PostgreSQL.
Implementa un’API C# con GET /contacts, POST /contacts e DELETE /contacts/{id}.
Realizza un’interfaccia Angular per elencare i contatti e aggiungerne di nuovi.
Task extra 1: crea una tabella group (id, name) e collega i contatti con una relazione molti‑a‑molti (tabella ponte).
Task extra 2: aggiungi nel frontend un filtro a tendina per gruppo, mostrando solo i contatti appartenenti al gruppo scelto.

esame prova 3– Mini‑blog

Definisci la tabella post (id, title, body, created_at) in PostgreSQL.
Realizza un’API C# con gli endpoint GET /posts, POST /posts e DELETE /posts/{id}.
Costruisci un’app Angular che elenchi i post e permetta di crearne di nuovi tramite un form.
Task extra 1: aggiungi la tabella comment (id, post_id FK, author, content, created_at) per gestire la relazione molti‑a‑uno (un post può avere più commenti); inserisci alcuni commenti di esempio.
Task extra 2: nel frontend mostra, sotto ogni post, la lista dei relativi commenti e fornisci un piccolo form per aggiungere un nuovo commento (POST /comments).
Mi piace questa risposta
Segnala un problema

## Note progetto

- .gitignore: è stato aggiunto un file `.gitignore` alla radice che copre sia .NET (bin/obj, .vs, TestResults, ecc.) sia Angular (node_modules, dist, .angular, coverage). In questo modo possiamo mantenere un’unica configurazione valida per tutto il repo. Se in futuro vorrai usare un `.gitignore` separato all’interno della cartella dell’app Angular, potremo farlo senza conflitti: le regole più specifiche locali hanno priorità.
- Dipendenze backend: è stato rimosso il pacchetto `Microsoft.EntityFrameworkCore.Design` perché serve principalmente per tooling di design‑time (scaffolding/migrations). In questo progetto lo schema del DB è gestito dagli script SQL in `todo/init-scripts`, quindi non è necessario. Restano `Microsoft.EntityFrameworkCore` e `Npgsql.EntityFrameworkCore.PostgreSQL` per l’accesso al DB e `Swashbuckle.AspNetCore` per Swagger (documentazione live delle API).
- Commenti nel codice: sono stati aggiunti commenti ed XML docs in `Program.cs`, `Controllers/TodosController.cs`, `Models/*.cs` e `Data/TodoDbContext.cs` per facilitare la lettura a chi è alle prime armi.

Se in futuro vorremo introdurre le Migration di EF Core, potremo ri‑aggiungere il pacchetto `Microsoft.EntityFrameworkCore.Design` e abilitare la pipeline delle migrazioni; per ora è più semplice e trasparente usare gli script SQL già presenti.

## Frontend Angular (todo/frontend)

- Architettura didattica: componenti presentazionali (how it looks) + servizi (how it works), stato gestito con Signals.
- Componenti:
  - `TodoFilterComponent`: selezione categoria (dropdown).
  - `TodoListComponent`: lista dei To‑Do con pulsante elimina.
  - `TodoFormComponent`: form per creare un nuovo To‑Do.
  - `AppComponent`: container che orchestra segnali, chiama i servizi e compone i componenti.
- Servizi:
  - `TodosApi`: `list(categoryId?)`, `create(input)`, `delete(id)` contro le API backend.
  - `CategoriesApi`: `list()`.
- Modelli TS in `src/app/models`: `Todo`, `CreateTodoInput`, `Category`.

### Avvio ambiente
1) Database + backend API
```
cd todo
docker compose up -d
cd backend
set ASPNETCORE_ENVIRONMENT=Development
set ASPNETCORE_URLS=http://localhost:5273
 dotnet run
```
Swagger: http://localhost:5273/swagger

2) Frontend Angular
```
cd todo/frontend
npm install
npm start
```
App: http://localhost:4200

Se cambi la porta del backend, aggiorna `todo/frontend/src/environments/environment.ts` (`apiBaseUrl`). Per lo sviluppo non serve proxy perché il backend ha CORS aperto (policy `AllowAngular`).
