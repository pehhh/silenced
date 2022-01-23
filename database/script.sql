CREATE DATABASE proyectodaw charset utf8;

USE proyectodaw;

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(60) UNIQUE,
    nombre VARCHAR(100),
    apellidos VARCHAR(150),
    email VARCHAR(150),
    pais VARCHAR(60),
    ciudad VARCHAR(60),
    password VARCHAR(300),
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE opiniones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150),
    opinion VARCHAR(1000),
    plataforma VARCHAR(150),
    FOREIGN KEY(id) REFERENCES usuarios(id),
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

alter table usuarios drip index usuario;