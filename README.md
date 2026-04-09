# Progetto2 - Badini, Angelantoni, Sciarrini

## 📌 Descrizione

Applicazione web full-stack sviluppata a scopo didattico.

Il progetto è strutturato in tre parti principali:

* Frontend (Angular)
* Backend (Node.js + Express)
* Database (PostgreSQL)

---

## 🧱 Struttura del progetto

### 📁 Frontend

* `Frontend/` → applicazione Angular

---

### 📁 Backend

* `Backend/`

  * `src/`

    * `index.ts` → punto di avvio del server
    * `db/` → configurazione connessione al database
    * `routes/` → definizione degli endpoint API
    * `services/` → logica di business
    * `repositories/` → gestione query database
    * `models/` → interfacce e strutture dati
  * `.env` → variabili d’ambiente
  * `package.json`
  * `tsconfig.json`
  * `node_modules/`

Il backend segue un’architettura a livelli:

* **Routes → Services → Repositories → Database**

---

### 📁 Database

* `Database/`

  * `script/`

    * `create_db.sql` → script SQL (in sviluppo)

---

## ⚙️ Tecnologie utilizzate

### Frontend

* Angular
* TypeScript
* HTML
* CSS

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL

---

## 🚀 Avvio del progetto

### Frontend

```bash
cd Frontend
npm install
ng serve
```

Aprire:
http://localhost:4200/

---

### Backend

```bash
cd Backend
npm install
npm run dev
```

---

## 🗄️ Setup Database (PostgreSQL)

Per eseguire correttamente il progetto è necessario installare PostgreSQL.

### 🔧 Installazione

Scaricare PostgreSQL dal sito ufficiale:

👉 https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Selezionare la versione più recente disponibile (es. 18.x).

Durante l’installazione:

* Annotare username e password
* Assicurarsi che il server PostgreSQL sia in esecuzione

---

### 🛠️ pgAdmin 4

Per la gestione del database è consigliato utilizzare **pgAdmin 4**, incluso nell’installazione di PostgreSQL.

Permette di:

* creare database
* eseguire query SQL
* gestire tabelle

---

### ▶️ Avvio database

1. Avviare PostgreSQL
2. Aprire pgAdmin 4
3. Connettersi al server locale

---

### 📜 Script SQL

Gli script del database si trovano in:

```bash
Database/script/
```

Esempio:

* `create_db.sql` → creazione database (in sviluppo)

---

### ⚠️ Nota

Attualmente il backend è configurato ma non ancora collegato al database.
La configurazione della connessione sarà definita nelle fasi successive dello sviluppo.

---

## 🌐 Rendering

Il frontend è configurato per supportare:

* **SSR (Server-Side Rendering)** → rendering dinamico lato server
* **SSG (Static Site Generation / Prerendering)** → generazione statica delle pagine in fase di build

Questa configurazione permette di scegliere la strategia di rendering più adatta in base alle esigenze dell’applicazione.

---

## 👥 Autori

* Badini
* Angelantoni
* Sciarrini

---

## 📌 Stato del progetto

In sviluppo 🚧

* Architettura full-stack definita
* Backend strutturato a livelli
* Database inizializzato (base)
