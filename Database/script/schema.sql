DROP TABLE IF EXISTS prenotazione_classe;
DROP TABLE IF EXISTS prenotazione;
DROP TABLE IF EXISTS classe;
DROP TABLE IF EXISTS aula;
DROP TABLE IF EXISTS utente;

CREATE TABLE utente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    ruolo ENUM('studente', 'docente', 'ata', 'admin') NOT NULL DEFAULT 'studente',
    attivo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE aula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero SMALLINT NOT NULL UNIQUE,
    capienza SMALLINT NOT NULL DEFAULT 30,
    descrizione VARCHAR(200) NULL,
    piano SMALLINT NULL,
    CONSTRAINT chk_aula_numero CHECK (numero BETWEEN 1 AND 119),
    CONSTRAINT chk_aula_capienza CHECK (capienza >= 1)
) ENGINE=InnoDB;

CREATE TABLE classe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(10) NOT NULL UNIQUE,
    indirizzo VARCHAR(100) NULL,
    anno SMALLINT NOT NULL,
    CONSTRAINT chk_classe_anno CHECK (anno BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE prenotazione (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aula_id INT NOT NULL,
    utente_id INT NULL,
    data DATE NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_orario CHECK (ora_fine > ora_inizio),
    CONSTRAINT fk_prenotazione_aula FOREIGN KEY (aula_id) REFERENCES aula(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_prenotazione_utente FOREIGN KEY (utente_id) REFERENCES utente(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE prenotazione_classe (
    prenotazione_id INT NOT NULL,
    classe_id INT NOT NULL,
    PRIMARY KEY (prenotazione_id, classe_id),
    CONSTRAINT fk_pren_classe_pren FOREIGN KEY (prenotazione_id) REFERENCES prenotazione(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pren_classe_classe FOREIGN KEY (classe_id) REFERENCES classe(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_prenotazione_aula_data_orari ON prenotazione (aula_id, data, ora_inizio, ora_fine);
CREATE INDEX idx_prenotazione_data ON prenotazione (data);
CREATE INDEX idx_prenotazione_utente ON prenotazione (utente_id);
CREATE INDEX idx_prenotazione_classe_preno ON prenotazione_classe (prenotazione_id);
CREATE INDEX idx_prenotazione_classe_classe ON prenotazione_classe (classe_id);
CREATE INDEX idx_utente_email ON utente (email);
