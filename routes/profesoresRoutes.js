const express = require("express");
const router = express.Router();
const profesoresController = require("../controllers/profesoresController");

// Endpoints base del CRUD
router.get("/", profesoresController.getProfesores);
router.post("/", profesoresController.createProfesor);
router.get("/:id", profesoresController.getProfesor);
router.put("/:id", profesoresController.updateProfesor);
router.delete("/:id", profesoresController.deleteProfesor);

// 🚀 Endpoints de Consultas del Examen
router.get("/consultas/por-edad", profesoresController.getProfesoresPorEdad);
router.get("/consultas/rango", profesoresController.getProfesoresPorRangoEdad);

module.exports = router;
