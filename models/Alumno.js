const pool = require("../config/db");

const Alumno = {
    findAll: () =>
        pool.query("SELECT * FROM alumnos ORDER BY alumno_id"),

    create: (nombre, email) =>
        pool.query(
            `INSERT INTO alumnos (nombre, email) VALUES ($1, $2) RETURNING *`,
            [nombre, email]
        ),

    update: (id, nombre, email) =>
        pool.query(
            `UPDATE alumnos SET nombre = $1, email = $2 WHERE alumno_id = $3 RETURNING *`,
            [nombre, email, id]
        ),

    remove: (id) =>
        pool.query("DELETE FROM alumnos WHERE alumno_id = $1", [id]),

    // 🚀 NUEVO MÉTODO PARA EL EJERCICIO 1
    findByEdad: (edad) => {
        const sql = "SELECT alumno_id, nombre, email, edad FROM alumnos WHERE edad = $1";
        return pool.query(sql, [edad]).then(result => ({
            rows: result.rows,
            sqlUsed: sql
        }));
    }
};

module.exports = Alumno;
