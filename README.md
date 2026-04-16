# 📚 Progetto2 – Sistema di Prenotazione Aule

**Badini · Angelantoni · Sciarrini**

## 📌 Descrizione

Applicazione web full-stack sviluppata a scopo didattico per la gestione delle **prenotazioni delle aule scolastiche**.

Il sistema consente di:

* visualizzare lo stato di occupazione delle aule;
* creare, modificare ed eliminare prenotazioni;
* associare una o più classi a una prenotazione;
* gestire utenti con ruoli differenti (studente, docente, ATA, amministratore);
* applicare controlli di sicurezza, autorizzazione e validazione dei dati.

L’applicazione è progettata secondo un’architettura modulare, che separa chiaramente frontend, backend e database.


## 🧱 Struttura del progetto

### 📁 Frontend (`Frontend/`)

* Applicazione **Angular (SPA)**
* Rendering lato client (CSR)
* Comunicazione con il backend tramite API REST
* Visualizzazione prenotazioni:

  * giornaliera
  * settimanale
  * calendario

### 📁 Backend (`Backend/`)

Tecnologie:

* Node.js
* Express
* TypeScript
* Sequelize (ORM)
* Zod (validazione dati)

Struttura principale:

* `src/`

  * `index.ts` → avvio server
  * `db/` → configurazione database
  * `models/` → modelli Sequelize
  * `routes/` → endpoint REST
  * `middleware/` → autenticazione, autorizzazione, validazione
  * `schemas/` → validazione input con Zod
  * `services/` → logica di business
  * `utils/` → funzioni di supporto
  * `types/` → tipi personalizzati TypeScript
  * `websocket/` → gestione comunicazione realtime
  * `tests/` → test automatici
  (I test sono mantenuti dentro src per avere accesso diretto ai moduli TypeScript e semplificare l’integrazione con la logica applicativa.)

Architettura:

Routes → Middleware → Services → Models → Database
                ↓
             Schemas

Questa struttura garantisce:

* separazione delle responsabilità
* manutenibilità
* testabilità
* scalabilità

### 📁 Database (`Database/script/`)

Database relazionale implementato in **MySQL**.

Script disponibili:

* `create_db.sql` → creazione database (DDL)
* `schema.sql` → creazione tabelle (DDL)
* `seed.sql` → popolamento dati iniziali
* `reset.sql` → reset completo database

Caratteristiche:

* entità: utenti, aule, classi, prenotazioni
* relazione molti-a-molti tra prenotazioni e classi
* vincoli di integrità referenziale (foreign key)
* dati realistici per test e dimostrazione

## ⚙️ Tecnologie utilizzate

### Frontend

* Angular
* TypeScript
* HTML / CSS

### Backend

* Node.js
* Express
* TypeScript
* Sequelize
* Zod

### Database

* MySQL
* MySQL Workbench / phpMyAdmin


## 🔐 Sicurezza e controlli applicativi

### 🔑 Autenticazione

* Basata su **JWT (JSON Web Token)**

### 🛡️ Autorizzazione

Controllo accessi basato su ruolo:

* **studente** → sola visualizzazione
* **docente / ATA** → gestione delle proprie prenotazioni
* **admin** → accesso completo

### 🔎 Validazione dati

* Validazione tramite **Zod**
* Controllo formato e coerenza input

### ⚠️ Controlli di business

* verifica sovrapposizione prenotazioni sulla stessa aula
* controllo proprietà delle prenotazioni
* gestione relazione prenotazioni ↔ classi


## 📊 Funzionalità principali

* CRUD Aule
* CRUD Classi
* CRUD Prenotazioni
* Associazione N:M Prenotazioni ↔ Classi
* Filtro prenotazioni per:

  * data (giornaliero / settimanale)
  * aula
  * classe
* Controllo sovrapposizione oraria
* Gestione utenti e ruoli
* Protezione API con JWT
* Validazione input con Zod
* Test automatici su logiche critiche
* Predisposizione comunicazione realtime (WebSocket)


## 🚀 Avvio del progetto

### ▶️ 1. Database (MySQL)

CREATE DATABASE prenotazione_aule;
USE prenotazione_aule;

Eseguire gli script nell’ordine:

reset.sql
schema.sql
seed.sql


### ▶️ 2. Backend

cd Backend
npm install
npm run build
npm run dev


Server disponibile su:
http://localhost:3000


### ▶️ 3. Frontend

cd Frontend
npm install
ng serve


Applicazione disponibile su:

http://localhost:4200

## 🔗 Configurazione ambiente

File `.env` (Backend):
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=prenotazione_aule
DB_USER=root
DB_PASSWORD=password

JWT_SECRET=INSERIRE_UN_SECRET_SICURO

FRONTEND_URL=http://localhost:4200

## 📌 Stato del progetto

✔ Backend completo e strutturato
✔ Database progettato e coerente con i requisiti
✔ API REST funzionanti e protette
✔ Validazione dati implementata
✔ Seed database completo
✔ Test automatici presenti

🚧 Possibili miglioramenti:

* integrazione completa autenticazione Google OAuth
* documentazione API (Swagger/OpenAPI)
* ampliamento test automatici
* ottimizzazione performance query


## 👥 Autori

* Badini
* Angelantoni
* Sciarrini

## 🏆 Considerazioni finali

Il progetto è stato sviluppato seguendo buone pratiche di ingegneria del software:

* separazione delle responsabilità (layered architecture)
* validazione robusta dei dati
* gestione sicura dei permessi
* progettazione coerente del database
* utilizzo di strumenti moderni (ORM, validazione schema-based)

La struttura modulare rende il sistema facilmente estendibile e manutenibile.
