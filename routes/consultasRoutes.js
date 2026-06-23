const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultasController');

// Ejercicio 3: Consulta con subconsulta
router.get('/cursos/top-matriculados', consultasController.getTopMatriculados);

// Ejercicio 4: Consulta relacionando 2 tablas (JOIN)
router.get('/matriculas/alumno-curso', consultasController.getMatriculasAlumnoCurso);

// Ejercicio 5: Consulta relacionando 3 tablas (JOIN)
router.get('/profesores/curso-especialidad', consultasController.getProfesoresCursoEspecialidad);

// Ejercicio 6: Consulta con GROUP BY
router.get('/matriculas/total-por-curso', consultasController.getMatriculasTotalPorCurso);

// Ejercicio 7: Consulta con GROUP BY + HAVING
router.get('/matriculas/cursos-con-minimo', consultasController.getCursosConMinimo);

module.exports = router;
