const pool = require("../config/db");

const Curso = {
    findAll: () =>
        pool.query(`
            SELECT c.*, p.nombre AS profesor
            FROM curso c
            INNER JOIN profesores p ON c.profesor_id = p.profesor_id
        `),

    create: (nombre, horas, profesor_id) =>
        pool.query(
            `INSERT INTO curso (nombre, horas, profesor_id) VALUES ($1, $2, $3) RETURNING *`,
            [nombre, horas, profesor_id]
        ),

    update: (id, nombre, horas, profesor_id) =>
        pool.query(
            `UPDATE curso SET nombre = $1, horas = $2, profesor_id = $3 WHERE curso_id = $4 RETURNING *`,
            [nombre, horas, profesor_id, id]
        ),

    remove: (id) =>
        pool.query("DELETE FROM curso WHERE curso_id = $1", [id]),
};

module.exports = Curso;
