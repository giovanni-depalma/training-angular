# Copilot Instructions

## Contesto del Progetto
Questo è un progetto di training per imparare lo sviluppo full-stack. L'obiettivo è mantenere il codice pulito, ben commentato e didattico.

## Stack Tecnologico
- Database: PostgreSQL 15 (in Docker)
- Backend: ASP.NET Core Web API (C#)
- Frontend: Angular (ultima versione)

## Struttura del Progetto
```
todo/
├── docker-compose.yml
├── init-scripts/
├── backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Data/
│   │   ├── Repositories/
│   │   └── Entities/
│   ├── Services/
│   └── DTOs/
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── services/
    │   │   ├── models/
    │   │   └── utils/
    │   ├── assets/
    │   └── environments/
    ├── package.json
    └── angular.json
```

## Linee Guida Generali

### Stile di Codice
- Usa nomi di variabili e funzioni descrittivi e in inglese
- Aggiungi commenti esplicativi per le parti complesse
- Segui le convenzioni di naming di ogni linguaggio
- Mantieni i file e le funzioni piccoli e focalizzati

### Pattern e Principi
- Implementa SOLID principles
- Usa Dependency Injection
- Implementa Repository Pattern nel backend
- Usa Signal per la gestione dello stato in Angular

## Istruzioni Specifiche per Componente

### Database
Schema esistente:
```sql
todo (id, title, completed, created_at, category_id)
category (id, name)
```

### Backend (C#)
- Usa ASP.NET Core Web API
- Implementa il pattern Repository
- Usa Entity Framework Core con PostgreSQL
- Implementa CORS per Angular

### Frontend (Angular)
- Usa l'approccio standalone components
- Implementa Signal per la gestione dello stato
- Usa TypeScript in strict mode

## API Endpoints
Implementa le seguenti API:
```
GET    /api/todos        - Lista todos con filtri
POST   /api/todos        - Crea nuovo todo
PUT    /api/todos/{id}   - Aggiorna todo
DELETE /api/todos/{id}   - Elimina todo
GET    /api/categories   - Lista categorie
```

## Features da Implementare
1. CRUD completo per todos
2. Gestione categorie
3. Filtri e ordinamento
4. Validazione input
5. Error handling
6. Loading states

## Test
- Implementa unit test per il backend
- Implementa unit test per i componenti Angular
- Test i casi edge e gli errori

## Note per Copilot
- Genera codice con commenti esplicativi
- Mantieni uno stile consistente
- Usa le ultime best practices di ogni tecnologia
- Privilegia l'approccio Signal in Angular
- Implementa error handling robusto
- Genera codice type-safe
- Usa async/await invece di Promise chains
- Implementa logging appropriato

## Sicurezza
- Sanitizza gli input
- Usa prepared statements per le query
- Implementa validazione sia frontend che backend
- Gestisci correttamente gli errori HTTP

## Performance
- Usa la lazy loading per i moduli Angular
- Implementa caching appropriato
- Ottimizza le query database
- Usa paginazione per liste lunghe
```
