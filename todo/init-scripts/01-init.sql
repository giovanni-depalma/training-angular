-- Creazione delle tabelle
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category_id INTEGER REFERENCES category(id)
);

-- Inserimento dati di esempio nelle tabelle
INSERT INTO category (name) VALUES
    ('Lavoro'),
    ('Casa'),
    ('Personale'),
    ('Shopping');

INSERT INTO todo (title, completed, category_id) VALUES
    ('Completare il progetto Angular', false, 1),
    ('Preparare la presentazione', false, 1),
    ('Fare la spesa', false, 4),
    ('Pagare le bollette', false, 2),
    ('Andare in palestra', false, 3),
    ('Pulire casa', true, 2),
    ('Studiare Docker', false, 1),
    ('Comprare regalo compleanno', false, 4);
