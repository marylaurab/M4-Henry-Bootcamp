1. Crear la base de datos:
CREATE DATABASE homework_M4;
2. Crear 3 tablas:
-Tabla#1 Movies
(SERIAL yo usaria en posgresSQL para id,
y varchar(X) para names,etc);
CREATE TABLE movie(
    id INTEGER PRIMARY KEY,
    name TEXT DEFAULT NULL,
    year INTEGER DEFAULT NULL,
    rank REAL DEFAULT NULL,
);
-Tabla#2 Actors
CREATE TABLE actor(
    id INTEGER PRIMARY KEY,
    first_name TEXT DEFAULT NULL,
    last_name TEXT DEFAULT NULL,
    gender TEXT DEFAULT NULL
);
-Tabla #3 Roles (tabla intermedia-relacion N->M)
CREATE TABLE role(
    actor_id INTEGER,
    movie_id INTEGER,
    role_name TEXT DEFAULT NULL
);
3. Insertar informacion a las tablas:
INSERT INTO (movie name,year,rank) VALUES
('TITANIC',1997,4),
('TOY STORY', 1996, 5),
('DREAD', 2012, 5);


INSERT INTO actor (id, first_name,last_name,gender)
VALUES(Kate, Winslet, female),
(Leonardo, DiCaprio, male),
(Tom, Hanks, male),
(Tim, Allen, male),
(Lena, Headey, female),
(Karl,Urban,male);
---->DUDA: En la insercion de informacion a la tabla
--role, es asi de manual/poco escalable hacer la asociacion de 
--de ids? 
INSERT INTO role(actor_id,movie_id,role_name)
VALUES();
4.Birthyear:
SELECT * FROM movie WHERE year=1997;
5. 1982:
SELECT COUNT(*) AS TOTAL FROM movie WHERE year=1982;
6. Stacktors:
SELECT * FROM actor WHERE last_name ILIKE '%stack%';
7. Fame name Game:
--Lo que no entendi es,cada actor no deberia de 
--agregarse una sola vez? O se esta suponiendo
--que entre actores coinciden los nombres y apellidos
--pero son personas diferentes?
SELECT first_name, last_name, COUNT(*) AS TOTAL
FROM actor
GROUP BY first_name, last_name
LIMIT 10--esta linea se cambia con la 60 de lugar
--sin problema? Probar!
ORDER BY TOTAL DESC;
8. Prolific: --tabla2 y tabla3 debido a que con tabla2
--puedo "imprimir" nombre + apellido y con tabla3
--es donde hago el conteo.
SELECT a.first_name,a.last_name, COUNT(*) AS TOTAL
FROM actor AS a JOIN role AS r ON a.id=r.actor_id
GROUP BY a.id
ORDER BY TOTAL DESC
LIMIR 100;
9. Bottom of the Barrel:--Buscando en la tabla
--movies_genres que daban en la hw
SELECT genre, COUNT(*) AS TOTAL FROM movies_genres
GROUP BY genre
ORDER BY TOTAL;--No hace falta:ASC porque es el default;
10. Braveheart:
SELECT a.first_name,a.last_name as CAST FROM actor AS a
JOIN role AS r ON a.id=r.actor_id
JOIN movie AS m ON r.movie_id=m.id
WHERE m.name = 'Braveheart' AND m.year=1995
ORDER BY CAST;
10.Leap Noir:
--Tablas a utilizar:
-- movies_genres (accedo al genero de la peli)
--movies (consigo el a*o de la peli y su nombre)
--movies_directors (tabla intermedia entre movies y directors)
--directors (consigo name y lastname)

SELECT d.first_name,d.last_name,m.name,m.year
FROM directors AS d
JOIN movies_directors AS md ON d.id=md.director_id
JOIN movies AS m ON md.movie_id=m.id
JOIN movies_genres AS mg ON m.movie_id=mg.movie_id
WHERE mg.genre='Film-Noir' AND m.year%4=0
ORDER BY m.name;
11.Bacon:
--Tablas a utilizar:
--actors (Listado de actores (nombres y apellidos))
--roles (aca me vincula entre actores)
--movies (aca tengo el titulo de la pelicula)
--movies_genres (aca tengo el genero de la pelicula)
SELECT a.first_name, a.last_name, m.name FROM actor AS a
JOIN role AS r ON a.id=r.actor_id --en el CR esto esta al reves(la expresion)
JOIN movie AS m ON r.movie_id=m.id
JOIN movies_genres AS mg ON m.id=mg.movie_id
WHERE mg.genre='Drama' AND m.id IN
(--Todas los IDS de peliculas en las que actuo KB:
SELECT role.movie_id FROM role
JOIN actor ON role.actor_id=actor.id WHERE
actor.first_name='Kevin' AND actor.last_name:'Bacon')
AND (a.first_name|| ' '|| a.last_name) <> 'Kevin Bacon';--!=(distinto)
12. Immortal Actors:
SELECT * FROM actor
WHERE actor.id IN( --Ncecesariamente era con IN?
    SELECT actor_id FROM role
    JOIN movie ON role.movie_id=movie.id
    WHERE movie.year<1990 OR movie.year>2000
    );
13. Busy Filming:
--actor (nombre del actor)
--movie (titulo de la pelicula)
--role (tabla intermedia)
--DENTRO DEL DISTINTIC PODRIA SER?: role.role???
SELECT actor.first_name,actor.last_name,movie.name,COUNT(DISTINTIC(role)) AS TOTAL FROM
actor
JOIN role ON role.actor_id=actor.id
JOIN movie ON role.movie_id=movie.id
WHERE movie.year>1990
GROUP BY role.movie_id,role.actor_id
HAVING TOTAL>=5;--Estudiar mejor having vs where
14.Female:
--movie (para trabajar con el a*o)
--actors (para saber el genero)
--role (tabla intermedia para laburar)
SELECT movie.year, COUNT(DISTINTIC(id)) AS TOTAL FROM 
movie WHERE movie.id IN(
    SELECT role.movie_id FROM role
    JOIN actor ON role.actor_id=actor.id
    WHERE actor.gender='female'
)GROUP BY movie.year;















