-- DDL

create table profesores(
--	profesor_id serial primary key,
    profesor_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--	nombre varchar(50) not null,
	nombre text not null,
--	edad varchar(3),
	edad smallint check (edad >=0 and edad <150),
--	especialidad varchar(100),
	especialidad_id int 
	
);

create table curso (
	curso_id serial primary  key,
	nombre text,
	horas integer,
	profesor_id integer,
	constraint fk_profesor foreign key (profesor_id)
	references profesores(profesor_id)
);

create table especialidad (
 especialidad_id serial primary key,
 nombre text,
 profesor_id integer
);

alter table especialidad add constraint fk_profesor_especialidad 
foreign key (profesor_id) references profesores(profesor_id);

create table alumnos(
   alumno_id serial primary key,
   nombre text,
   email varchar(50) unique
);

CREATE TABLE matriculas (
    matricula_id SERIAL PRIMARY KEY,
    alumno_id INTEGER NOT NULL,
    curso_id INTEGER NOT NULL,
    fecha_matricula DATE NOT NULL,
    CONSTRAINT fk_curso2
        FOREIGN KEY (curso_id)
        REFERENCES curso(curso_id),
    CONSTRAINT fk_alumno2
        FOREIGN KEY (alumno_id)
        REFERENCES alumnos(alumno_id)
);

INSERT INTO profesores (nombre, edad, especialidad_id) VALUES
('Ana García', 35, NULL),
('Juan Pérez', 42, NULL),
('Laura Martínez', 29, NULL),
('Carlos Sánchez', 50, NULL),
('Marta López', 38, NULL),
('David Ruiz', 45, NULL),
('Elena Torres', 33, NULL),
('Javier Moreno', 40, NULL),
('Patricia Romero', 31, NULL),
('Sergio Navarro', 48, NULL);

INSERT INTO especialidad (nombre, profesor_id) VALUES
('Desarrollo Web', 1),
('Bases de Datos', 2),
('Python', 3),
('Java', 4),
('JavaScript', 5),
('DevOps', 6),
('Ciberseguridad', 7),
('Inteligencia Artificial', 8),
('UX/UI', 9),
('Cloud Computing', 10);


UPDATE profesores SET especialidad_id = 1 WHERE profesor_id = 1;
UPDATE profesores SET especialidad_id = 2 WHERE profesor_id = 2;
UPDATE profesores SET especialidad_id = 3 WHERE profesor_id = 3;
UPDATE profesores SET especialidad_id = 4 WHERE profesor_id = 4;
UPDATE profesores SET especialidad_id = 5 WHERE profesor_id = 5;
UPDATE profesores SET especialidad_id = 6 WHERE profesor_id = 6;
UPDATE profesores SET especialidad_id = 7 WHERE profesor_id = 7;
UPDATE profesores SET especialidad_id = 8 WHERE profesor_id = 8;
UPDATE profesores SET especialidad_id = 9 WHERE profesor_id = 9;
UPDATE profesores SET especialidad_id = 10 WHERE profesor_id = 10;


INSERT INTO curso (nombre, horas, profesor_id) VALUES
('HTML y CSS', 120, 1),
('PostgreSQL', 150, 2),
('Python Básico', 180, 3),
('Java Orientado a Objetos', 200, 4),
('JavaScript Moderno', 160, 5),
('Docker y Kubernetes', 140, 6),
('Hacking Ético', 170, 7),
('Machine Learning', 220, 8),
('Diseño UX', 100, 9),
('AWS Fundamentals', 130, 10);

INSERT INTO alumnos (nombre, email) VALUES
('Oscar Burgos', 'oscar@gmail.com'),
('Lucía Fernández', 'lucia@gmail.com'),
('Pedro Gómez', 'pedro@gmail.com'),
('Sara Martín', 'sara@gmail.com'),
('Miguel Díaz', 'miguel@gmail.com'),
('Claudia Ramos', 'claudia@gmail.com'),
('Andrés Vega', 'andres@gmail.com'),
('Natalia Cruz', 'natalia@gmail.com'),
('Iván Herrera', 'ivan@gmail.com'),
('Beatriz León', 'beatriz@gmail.com');

INSERT INTO matriculas (alumno_id, curso_id, fecha_matricula) VALUES
(1, 1, '2025-09-01'),
(2, 2, '2025-09-02'),
(3, 3, '2025-09-03'),
(4, 4, '2025-09-04'),
(5, 5, '2025-09-05'),
(6, 6, '2025-09-06'),
(7, 7, '2025-09-07'),
(8, 8, '2025-09-08'),
(9, 9, '2025-09-09'),
(10, 10, '2025-09-10');