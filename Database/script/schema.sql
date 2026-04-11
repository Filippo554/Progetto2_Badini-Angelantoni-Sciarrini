
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


DROP TABLE IF EXISTS prenotazione_classe CASCADE;
DROP TABLE IF EXISTS prenotazione CASCADE;
DROP TABLE IF EXISTS classe CASCADE;
DROP TABLE IF EXISTS aula CASCADE;
DROP TABLE IF EXISTS utente CASCADE;
DROP TYPE  IF EXISTS ruolo_utente;


CREATE TYPE ruolo_utente AS ENUM ('studente', 'docente', 'ata', 'admin');


CREATE TABLE utente (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    cognome    VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    ruolo      ruolo_utente NOT NULL DEFAULT 'studente',
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);


CREATE TABLE aula (
    id          SERIAL PRIMARY KEY,
    numero      SMALLINT     NOT NULL UNIQUE
                             CHECK (numero BETWEEN 1 AND 119),
    capienza    SMALLINT     DEFAULT 30,
    descrizione VARCHAR(200),
    piano       SMALLINT
);


CREATE TABLE classe (
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(10)  NOT NULL,          -- es. "4A"
    indirizzo  VARCHAR(100),                   -- es. "Informatica e Telecomunicazioni"
    anno       SMALLINT     CHECK (anno BETWEEN 1 AND 5)
);

CREATE TABLE prenotazione (
    id          SERIAL PRIMARY KEY,
    aula_id     INTEGER      NOT NULL REFERENCES aula(id)    ON DELETE RESTRICT,
    utente_id   INTEGER               REFERENCES utente(id)  ON DELETE SET NULL,
    data        DATE         NOT NULL,
    ora_inizio  TIME         NOT NULL,
    ora_fine    TIME         NOT NULL,
    note        TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),

    
    CONSTRAINT chk_orario CHECK (ora_fine > ora_inizio)
);


CREATE TABLE prenotazione_classe (
    prenotazione_id INTEGER NOT NULL REFERENCES prenotazione(id) ON DELETE CASCADE,
    classe_id       INTEGER NOT NULL REFERENCES classe(id)       ON DELETE CASCADE,
    PRIMARY KEY (prenotazione_id, classe_id)
);

CREATE INDEX idx_prenotazione_aula_data
    ON prenotazione (aula_id, data);


CREATE INDEX idx_prenotazione_data
    ON prenotazione (data);

-- Ricerca prenotazioni per utente
CREATE INDEX idx_prenotazione_utente
    ON prenotazione (utente_id);

CREATE INDEX idx_prenotazione_classe_preno
    ON prenotazione_classe (prenotazione_id);

CREATE INDEX idx_prenotazione_classe_classe
    ON prenotazione_classe (classe_id);


CREATE INDEX idx_utente_email
    ON utente (email);
