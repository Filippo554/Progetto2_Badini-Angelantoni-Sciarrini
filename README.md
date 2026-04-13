# 📚 Progetto2 - Badini, Angelantoni, Sciarrini

## 📌 Descrizione

Applicazione web full-stack sviluppata a scopo didattico per la gestione delle **prenotazioni delle aule scolastiche**.

Il sistema permette di:

* visualizzare le aule disponibili
* creare e gestire prenotazioni
* associare classi alle prenotazioni
* gestire utenti con ruoli differenti (studente, docente, ATA, admin)
* applicare controlli di sicurezza e autorizzazione

Il progetto è composto da:

* **Frontend** (Angular)
* **Backend** (Node.js + Express + TypeScript)
* **Database** (MySQL)

---

## 🧱 Struttura del progetto

### 📁 Frontend

Cartella: `Frontend/`

* Applicazione Angular (SPA)
* Rendering lato client (CSR)
* Comunicazione con backend tramite API REST

---

### 📁 Backend

Cartella: `Backend/`

Struttura principale:

* `src/`

  * `index.ts` → avvio server Express
  * `db/` → configurazione database (Sequelize)
  * `models/` → modelli ORM
  * `routes/` → endpoint API
  * `middleware/` → autenticazione e sicurezza
  * `types/` → estensioni TypeScript

Architettura adottata:

```id="arch1"
Routes → Middleware → Models → Database
```

---

### 📁 Database

Cartella: `Database/script/`

Contiene gli script SQL:

* `schema.sql` → creazione tabelle (DDL)
* `seed.sql` → dati iniziali
* `reset.sql` → reset completo database

---

## ⚙️ Tecnologie utilizzate

### Frontend

* Angular
* TypeScript
* HTML / CSS

### Backend

* Node.js
* Express
* TypeScript
* Sequelize (ORM)

### Database

* MySQL
* MySQL Workbench / phpMyAdmin

---

## 🔐 Sicurezza

Il backend implementa:

* Autenticazione tramite **JWT**
* Middleware:

  * `authMiddleware` → verifica token
  * `roleMiddleware` → controllo ruoli
  * `checkOwner` → verifica proprietà delle risorse
* Gestione centralizzata degli errori

---

## 🚀 Avvio del progetto

### ▶️ 1. Database (MySQL)

1. Avviare MySQL
2. Aprire MySQL Workbench (o phpMyAdmin)
3. Creare un database:

```sql id="db1"
CREATE DATABASE prenotazione_aule;
```

4. Selezionare il database ed eseguire:

```sql id="db2"
USE prenotazione_aule;
```

5. Eseguire gli script nell’ordine:

```sql id="db3"
reset.sql
schema.sql
seed.sql
```

---

### ▶️ 2. Backend

```bash id="be1"
cd Backend
npm install
npm run dev
```

Server disponibile su:

```id="be2"
http://localhost:3000
```

Health check:

```id="be3"
http://localhost:3000/
```

---

### ▶️ 3. Frontend

```bash id="fe1"
cd Frontend
npm install
ng serve
```

Applicazione disponibile su:

```id="fe2"
http://localhost:4200
```

---

## 🔗 Configurazione ambiente

File `.env` (Backend):

```env id="env1"
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=prenotazione_aule
DB_USER=root
DB_PASSWORD=password

JWT_SECRET=INSERIRE_UN_SECRET_SICURO

FRONTEND_URL=http://localhost:4200
```

---

## 📊 Funzionalità principali

* CRUD Aule
* CRUD Classi
* CRUD Prenotazioni
* Relazione N:M Prenotazioni ↔ Classi
* Controllo sovrapposizione prenotazioni
* Gestione utenti e ruoli
* Protezione API con JWT

---

## 📌 Stato del progetto

✔ Backend completo e strutturato
✔ Database progettato e funzionante
✔ API REST protette
✔ Frontend configurato

🚧 Miglioramenti possibili:

* login completo (JWT / OAuth)
* documentazione API
* test automatici

---

## 👥 Autori

* Badini
* Angelantoni
* Sciarrini

---

## 🏆 Note finali

Il progetto è stato sviluppato seguendo buone pratiche di progettazione:

* separazione delle responsabilità
* validazione dei dati
* sicurezza delle API

Struttura modulare e facilmente estendibile.
