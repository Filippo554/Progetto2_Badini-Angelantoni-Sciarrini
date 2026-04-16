# Database Status – Backend Prenotazione Aule

## Stato attuale del database

Il progetto prevede l’utilizzo di un database relazionale per la gestione persistente delle informazioni relative a utenti, aule, classi e prenotazioni.

Nella versione attuale dell’applicazione, il database non è ancora completamente integrato. La definizione finale dello schema logico e degli script di inizializzazione è in fase di sviluppo da parte del gruppo incaricato della progettazione del database.

---

## Configurazione del backend (Sequelize)

Nel backend è già stata predisposta la configurazione di Sequelize come ORM (Object Relational Mapper), al fine di gestire in modo strutturato l’interazione con il database.

In particolare, sono già presenti:

* configurazione della connessione tramite variabili d’ambiente (`.env`);
* inizializzazione asincrona della connessione al database;
* struttura di base per la definizione dei modelli (models);
* organizzazione modulare delle entità principali (utenti, aule, classi, prenotazioni).

Questa configurazione consente un’integrazione rapida e senza modifiche strutturali al codice applicativo una volta disponibile lo schema definitivo del database.

---

## Stato attuale dell’applicazione

In assenza del database persistente, il sistema utilizza strutture dati temporanee in memoria per simulare il comportamento del sistema reale.

In particolare:

* utilizzo di array JavaScript/TypeScript come storage temporaneo;
* impiego di dati mock per la gestione delle aule e delle prenotazioni;
* API REST completamente funzionanti e testabili tramite richieste HTTP.

Questo approccio consente di sviluppare e validare la logica applicativa indipendentemente dal livello di persistenza dei dati.

---

## Architettura e compatibilità futura

Il backend è stato progettato seguendo un’architettura modulare che separa chiaramente:

* logica di business;
* gestione delle richieste HTTP (route e controller);
* livello di accesso ai dati (ORM/database).

Grazie a questa separazione, la logica applicativa risulta indipendente dal database utilizzato.

Di conseguenza, l’integrazione con il database relazionale definitivo potrà avvenire in modo “plug-in”, senza necessità di riscrivere:

* le route;
* i controller;
* la logica di gestione delle prenotazioni.

---

## Obiettivi della fase attuale

Gli obiettivi principali della fase corrente di sviluppo sono:

* completare l’implementazione delle API REST principali;
* definire e validare la logica di business, con particolare attenzione alla gestione delle prenotazioni e dei conflitti orari;
* predisporre il sistema per l’integrazione con il database relazionale.

---

## Considerazioni finali

L’approccio adottato consente uno sviluppo parallelo tra backend e database, evitando blocchi operativi e permettendo una validazione progressiva delle funzionalità.

La struttura attuale garantisce una transizione fluida verso il database definitivo, mantenendo coerenza, scalabilità e manutenibilità del sistema.
