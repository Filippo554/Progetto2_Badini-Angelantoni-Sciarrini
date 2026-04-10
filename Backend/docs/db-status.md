# Database Status - Backend Prenotazione Aule

## Stato attuale del database

Il progetto prevede l’utilizzo di un database relazionale PostgreSQL per la gestione persistente dei dati relativi a utenti, aule, classi e prenotazioni.

Al momento della stesura di questo documento, il database **non è ancora stato completamente integrato**, in quanto la definizione finale dello schema e degli script di inizializzazione è in fase di sviluppo da parte del gruppo dedicato alla progettazione del database.

## Configurazione backend (Sequelize)

Nel backend è già stata predisposta la configurazione iniziale di Sequelize come ORM per la gestione del database.

Sono presenti:
- configurazione della connessione tramite variabili d’ambiente (`.env`)
- struttura del file di inizializzazione del database
- preparazione alla definizione dei modelli (models)
- predisposizione della connessione asincrona al DB

Questa configurazione permette una futura integrazione immediata con PostgreSQL senza modifiche strutturali al codice del backend.

## Stato attuale dell’applicazione

In attesa dell’integrazione con il database, il sistema utilizza:
- strutture dati temporanee in memoria (array JavaScript/TypeScript)
- dati mock per la gestione delle aule
- API REST già funzionanti e testabili tramite HTTP

Questo approccio consente lo sviluppo parallelo del backend e del database senza blocchi operativi.

## Compatibilità futura

Il backend è progettato per essere completamente compatibile con il database relazionale finale.

In particolare:
- le entità sono già separate in moduli logici (aule, prenotazioni, utenti)
- le API seguono una struttura REST coerente con le future query SQL
- la logica di business è indipendente dal livello di persistenza

## Obiettivo della fase attuale

L’obiettivo di questa fase è:
- completare l’implementazione delle API REST principali
- definire la logica di business (in particolare gestione prenotazioni e conflitti orari)
- preparare l’integrazione con PostgreSQL non appena disponibile lo schema definitivo

## Nota tecnica

L’attuale architettura permette una transizione “plug-in” verso il database reale senza necessità di riscrivere le route o la logica del controller.