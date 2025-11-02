-- Schema per gestione contatti con gruppi (M:N)

CREATE TABLE contact (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50)
);

-- "group" è parola riservata: usiamo le virgolette per il nome tabella
CREATE TABLE "group" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabella ponte molti-a-molti tra contact e group
CREATE TABLE contact_group (
    contact_id INTEGER NOT NULL REFERENCES contact(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES "group"(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, group_id)
);

-- Dati di esempio
INSERT INTO "group" (name) VALUES
    ('Famiglia'),
    ('Amici'),
    ('Lavoro'),
    ('Palestra');

INSERT INTO contact (first_name, last_name, email, phone) VALUES
    ('Mario', 'Rossi', 'mario.rossi@example.com', '+39 333 1111111'),
    ('Luisa', 'Bianchi', 'luisa.bianchi@example.com', '+39 333 2222222'),
    ('Giulia', 'Verdi', 'giulia.verdi@example.com', '+39 333 3333333');

-- Associazioni esempio
-- Mario: Famiglia + Lavoro
INSERT INTO contact_group (contact_id, group_id)
SELECT c.id, g.id FROM contact c, "group" g WHERE c.email='mario.rossi@example.com' AND g.name IN ('Famiglia','Lavoro');
-- Luisa: Amici
INSERT INTO contact_group (contact_id, group_id)
SELECT c.id, g.id FROM contact c, "group" g WHERE c.email='luisa.bianchi@example.com' AND g.name IN ('Amici');
-- Giulia: Palestra
INSERT INTO contact_group (contact_id, group_id)
SELECT c.id, g.id FROM contact c, "group" g WHERE c.email='giulia.verdi@example.com' AND g.name IN ('Palestra');
