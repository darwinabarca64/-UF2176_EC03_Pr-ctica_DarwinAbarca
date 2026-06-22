const pool = require("../config/db");

const Matricula = {
    findAll: () =>
        pool.query(`
            SELECT
                m.matricula_id,
                m.alumno_id,
                m.curso_id,
                a.nombre AS alumno,
                c.nombre AS curso,
                m.fecha_matricula
            FROM matriculas m
            INNER JOIN alumnos a ON a.alumno_id = m.alumno_id
            INNER JOIN curso c ON c.curso_id = m.curso_id
            ORDER BY m.matricula_id
        `),

    create: (alumno_id, curso_id, fecha_matricula) =>
        pool.query(
            `INSERT INTO matriculas (alumno_id, curso_id, fecha_matricula) VALUES ($1, $2, $3) RETURNING *`,
            [alumno_id, curso_id, fecha_matricula]
        ),

    update: (id, alumno_id, curso_id, fecha_matricula) =>
        pool.query(
            `UPDATE matriculas SET alumno_id = $1, curso_id = $2, fecha_matricula = $3 WHERE matricula_id = $4 RETURNING *`,
            [alumno_id, curso_id, fecha_matricula, id]
        ),

    remove: (id) =>
        pool.query("DELETE FROM matriculas WHERE matricula_id = $1", [id]),
};

module.exports = Matricula;
