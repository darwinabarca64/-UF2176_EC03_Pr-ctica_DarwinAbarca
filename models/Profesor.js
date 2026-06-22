const pool = require("../config/db");

const Profesor = {
    findAll: () =>
        pool.query("SELECT * FROM profesores ORDER BY profesor_id"),

    findById: (id) =>
        pool.query("SELECT * FROM profesores WHERE profesor_id = $1", [id]),

    create: (nombre, edad, especialidad_id) =>
        pool.query(
            `INSERT INTO profesores (nombre, edad, especialidad_id) VALUES ($1, $2, $3) RETURNING *`,
            [nombre, edad, especialidad_id]
        ),

    update: (id, nombre, edad, especialidad_id) =>
        pool.query(
            `UPDATE profesores SET nombre = $1, edad = $2, especialidad_id = $3 WHERE profesor_id = $4 RETURNING *`,
            [nombre, edad, especialidad_id, id]
        ),

    remove: (id) =>
        pool.query("DELETE FROM profesores WHERE profesor_id = $1", [id]),

    // 🚀 EJERCICIO 1: Consulta básica con WHERE por edad exacta
    findByEdad: (edad) => {
        const sql = "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad = $1";
        return pool.query(sql, [edad]).then(result => ({
            rows: result.rows,
            sqlUsed: sql
        }));
    },

    // 🚀 EJERCICIO 2: Consulta con WHERE doble condicional por rango de edades
    findByRangoEdad: (min, max) => {
        const sql = "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad >= $1 AND edad <= $2";
        return pool.query(sql, [min, max]).then(result => ({
            rows: result.rows,
            sqlUsed: sql
        }));
    }
};

module.exports = Profesor;
