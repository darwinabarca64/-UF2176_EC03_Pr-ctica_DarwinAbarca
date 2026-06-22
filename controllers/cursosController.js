const Curso = require("../models/Curso");

const getCursos = async (req, res) => {
    try {
        const resultado = await Curso.findAll();
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const createCurso = async (req, res) => {
    try {
        const { nombre, horas, profesor_id } = req.body;
        const resultado = await Curso.create(nombre, horas, profesor_id);
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const updateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, horas, profesor_id } = req.body;
        const resultado = await Curso.update(id, nombre, horas, profesor_id);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;
        await Curso.remove(id);
        res.json({ mensaje: "Curso eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    getCursos,
    createCurso,
    updateCurso,
    deleteCurso,
};