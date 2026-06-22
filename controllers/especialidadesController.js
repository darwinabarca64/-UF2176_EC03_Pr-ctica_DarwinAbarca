const Especialidad = require("../models/Especialidad");

const getEspecialidades = async (req, res) => {
    try {
        const resultado = await Especialidad.findAll();
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    getEspecialidades,
};