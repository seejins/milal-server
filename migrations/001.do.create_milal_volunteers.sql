CREATE TABLE milal_volunteers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    absents INT DEFAULT 0 NOT NULL,
    tardies INT DEFAULT 0 NOT NULL,
    total_hours INT DEFAULT 0 NOT NULL,

);