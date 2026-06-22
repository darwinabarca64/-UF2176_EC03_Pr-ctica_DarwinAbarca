const pool = require("../config/db");

const Especialidad = {
    findAll: () =>
        pool.query(`
            SELECT e.*, p.nombre AS profesor
            FROM especialidad e
            LEFT JOIN profesores p ON e.profesor_id = p.profesor_id
        `),
};

module.exports = Especialidad;
