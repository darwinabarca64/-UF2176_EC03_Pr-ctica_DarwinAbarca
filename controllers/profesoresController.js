const Profesor = require("../models/Profesor");

const getProfesores = async (req, res) => {
    try {
        const resultado = await Profesor.findAll();
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const getProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await Profesor.findById(id);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const createProfesor = async (req, res) => {
    try {
        const { nombre, edad, especialidad_id } = req.body;
        const resultado = await Profesor.create(nombre, edad, especialidad_id);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const updateProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, especialidad_id } = req.body;
        const resultado = await Profesor.update(id, nombre, edad, especialidad_id);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const deleteProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        await Profesor.remove(id);
        res.json({ mensaje: "Profesor eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// 🚀 EJERCICIO 1: Profesores por edad exacta
const getProfesoresPorEdad = async (req, res) => {
    try {
        const { edad } = req.query;

        if (!edad || isNaN(edad)) {
            return res.status(400).json({ 
                error: "El parámetro 'edad' es obligatorio y debe ser un número válido." 
            });
        }

        // Llamamos al método del modelo
        const resultado = await Profesor.findByEdad(parseInt(edad));

        // Enviamos la respuesta asegurando que "response" lea las filas devueltas por pg
        res.json({
            sql: resultado.sqlUsed,
            request_example: `GET /api/profesores/consultas/por-edad?edad=${edad}`,
            response: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 🚀 EJERCICIO 2: Profesores por rango de edad (Modificado de alumnos a profesores)
const getProfesoresPorRangoEdad = async (req, res) => {
    try {
        const { min, max } = req.query;

        if (!min || !max || isNaN(min) || isNaN(max)) {
            return res.status(400).json({ 
                error: "Los parámetros 'min' y 'max' son obligatorios y deben ser numéricos." 
            });
        }

        const { rows, sqlUsed } = await Profesor.findByRangoEdad(parseInt(min), parseInt(max));

        res.json({
            sql: sqlUsed,
            request_example: `GET /api/profesores/consultas/rango?min=${min}&max=${max}`,
            response: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfesores,
    getProfesor,
    createProfesor,
    updateProfesor,
    deleteProfesor,
    getProfesoresPorEdad,      // <--- Añadido
    getProfesoresPorRangoEdad  // <--- Añadido
};
