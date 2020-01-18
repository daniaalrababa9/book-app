DROP TABLE IF EXISTS result;
CREATE TABLE IF NOT EXISTS result(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    authors VARCHAR(255),
    isbn VARCHAR(255),
    description TEXT,
    imgURL VARCHAR(255)

);
 INSERT INTO result (title,authors,isbn,description,imgURL) 
 VALUES ('food','dania','99','food is good for health','image link');