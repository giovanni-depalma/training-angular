-- Schema per mini-blog con post e commenti (1:N)

CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES post(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dati di esempio
INSERT INTO post (title, body) VALUES
  ('Benvenuti nel mini‑blog', 'Questo è il primo post del nostro mini‑blog. Qui mostriamo come creare post e aggiungere commenti.'),
  ('Novità', 'In questo post condividiamo alcune novità interessanti sul progetto. Restate sintonizzati!');

-- Commenti di esempio legati ai post
INSERT INTO comment (post_id, author, content)
SELECT p.id, 'Alice', 'Complimenti per il progetto!'
FROM post p WHERE p.title = 'Benvenuti nel mini‑blog';

INSERT INTO comment (post_id, author, content)
SELECT p.id, 'Bob', 'Molto utile, grazie.'
FROM post p WHERE p.title = 'Benvenuti nel mini‑blog';

INSERT INTO comment (post_id, author, content)
SELECT p.id, 'Carla', 'Aspetto di leggere altre novità.'
FROM post p WHERE p.title = 'Novità';
