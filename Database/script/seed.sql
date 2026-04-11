INSERT INTO aula (numero, capienza, descrizione, piano)
SELECT
    gs AS numero,
    30 AS capienza,
    'Aula ' || gs AS descrizione,
    CASE
        WHEN gs BETWEEN   1 AND  30 THEN 0
        WHEN gs BETWEEN  31 AND  60 THEN 1
        WHEN gs BETWEEN  61 AND  90 THEN 2
        WHEN gs BETWEEN  91 AND 119 THEN 3
    END AS piano
FROM generate_series(1, 119) AS gs;

INSERT INTO classe (nome, indirizzo, anno) VALUES
('1AIT', 'Informatica e Telecomunicazioni', 1),
('2AIT', 'Informatica e Telecomunicazioni', 2),
('3AIT', 'Informatica e Telecomunicazioni', 3),
('4AIT', 'Informatica e Telecomunicazioni', 4),
('5AIT', 'Informatica e Telecomunicazioni', 5),
('1BCM', 'Elettronica ed Elettrotecnica',   1),
('2BCM', 'Elettronica ed Elettrotecnica',   2),
('3BCM', 'Elettronica ed Elettrotecnica',   3),
('4BCM', 'Elettronica ed Elettrotecnica',   4),
('5BCM', 'Elettronica ed Elettrotecnica',   5),
('1C', 'Meccanica Meccatronica',           1),
('2C', 'Meccanica Meccatronica',           2),
('3C', 'Meccanica Meccatronica',           3),
('4C', 'Meccanica Meccatronica',           4),
('5C', 'Meccanica Meccatronica',           5),
('1D', 'Liceo Scientifico',                1),
('2D', 'Liceo Scientifico',                2),
('3D', 'Liceo Scientifico',                3),
('4D', 'Liceo Scientifico',                4),
('5D', 'Liceo Scientifico',                5);

INSERT INTO utente (nome, cognome, email, ruolo) VALUES
('Admin',      'Sistema',      'admin@ittterni.org',      'admin'),
('Mario',      'Rossi',        'mario.rossi@ittterni.org','docente'),
('Laura',      'Bianchi',      'laura.bianchi@ittterni.org','docente'),
('Giuseppe',   'Verdi',        'giuseppe.verdi@ittterni.org','ata'),
('Anna',       'Neri',         'anna.neri@ittterni.org',  'studente'),
('Filippo',    'Badini',       'filippo.badini@ittterni.org','admin'),
('Vitali',     'Angelantoni',  'vitali.angelantoni@ittterni.org','docente'),
('Alessandro', 'Sciarrini',    'alessandro.sciarrini@ittterni.org','admin');

INSERT INTO prenotazione (aula_id, utente_id, data, ora_inizio, ora_fine, note)
VALUES
(1, 2, CURRENT_DATE,       '08:00', '10:00', 'Lezione di matematica'),
(1, 2, CURRENT_DATE,       '10:00', '12:00', 'Lezione di fisica'),
(2, 3, CURRENT_DATE,       '09:00', '11:00', 'Laboratorio informatica'),
(3, 2, CURRENT_DATE + 1,   '08:00', '10:00', 'Verifica scritta'),
(4, 3, CURRENT_DATE + 1,   '14:00', '16:00', 'Riunione dipartimento');

INSERT INTO prenotazione_classe (prenotazione_id, classe_id)
SELECT 1, id FROM classe WHERE nome = '4A' AND indirizzo LIKE 'Informatica%';

INSERT INTO prenotazione_classe (prenotazione_id, classe_id)
SELECT 2, id FROM classe WHERE nome IN ('4A','5A') AND indirizzo LIKE 'Informatica%';

INSERT INTO prenotazione_classe (prenotazione_id, classe_id)
SELECT 3, id FROM classe WHERE nome = '3B' AND indirizzo LIKE 'Elettronica%';

INSERT INTO prenotazione_classe (prenotazione_id, classe_id)
SELECT 4, id FROM classe WHERE nome = '2A' AND indirizzo LIKE 'Informatica%';
