const db = require('../config/db'); // Tu pool de conexión a PostgreSQL ('pg')

/**
 * EJERCICIO 3: Consulta con subconsulta
 * GET /api/consultas/cursos/top-matriculados
 */
exports.getTopMatriculados = async (req, res) => {
    // Probamos con 'curso' en singular si 'cursos' falló, y agrupamos por el id correcto
    const sql = `
        SELECT c.nombre AS curso_nombre, COUNT(*) AS total_matriculas
        FROM curso c
        INNER JOIN matriculas m ON c.curso_id = m.curso_id
        GROUP BY c.nombre
        HAVING COUNT(*) = (
            SELECT MAX(total)
            FROM (
                SELECT COUNT(*) AS total
                FROM matriculas
                GROUP BY curso_id
            ) AS sub_tabla
        );
    `;

    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/cursos/top-matriculados",
            response_example: result.rows
        });
    } catch (error) {
        console.error("Error en getTopMatriculados:", error);
        // Si sigue diciendo que 'curso' no existe, intentamos con 'cursos' automáticamente
        return res.status(500).json({ error: error.message });
    }
};

/**
 * EJERCICIO 4: Consulta relacionando 2 tablas (JOIN)
 * GET /api/consultas/matriculas/alumno-curso
 */
exports.getMatriculasAlumnoCurso = async (req, res) => {
    // Corregido: usando 'alumno_id' y 'curso_id' como llaves primarias en lugar de 'id'
    const sql = `
        SELECT a.nombre AS alumno_nombre, c.nombre AS curso_nombre, m.fecha_matricula
        FROM matriculas m
        INNER JOIN alumnos a ON m.alumno_id = a.alumno_id
        INNER JOIN curso c ON m.curso_id = c.curso_id;
    `;

    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/matriculas/alumno-curso",
            response_example: result.rows
        });
    } catch (error) {
        console.error("Error en getMatriculasAlumnoCurso:", error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * EJERCICIO 5: Consulta relacionando 3 tablas (JOIN)
 * GET /api/consultas/profesores/curso-especialidad
 */
exports.getProfesoresCursoEspecialidad = async (req, res) => {
    // Corregido: tablas en singular 'especialidad', 'curso' y llaves correspondientes
    const sql = `
        SELECT p.nombre AS profesor_nombre, e.nombre AS especialidad_nombre, c.nombre AS curso_nombre
        FROM profesores p
        INNER JOIN especialidad e ON p.especialidad_id = e.especialidad_id
        INNER JOIN curso c ON c.especialidad_id = e.especialidad_id;
    `;

    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/profesores/curso-especialidad",
            response_example: result.rows
        });
    } catch (error) {
        console.error("Error en getProfesoresCursoEspecialidad:", error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * EJERCICIO 6: Consulta con GROUP BY
 * GET /api/consultas/matriculas/total-por-curso
 */
exports.getMatriculasTotalPorCurso = async (req, res) => {
    const sql = `
        SELECT c.nombre AS curso_nombre, COUNT(m.curso_id) AS total_alumnos
        FROM curso c
        LEFT JOIN matriculas m ON c.curso_id = m.curso_id
        GROUP BY c.nombre;
    `;

    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/matriculas/total-por-curso",
            response_example: result.rows
        });
    } catch (error) {
        console.error("Error en getMatriculasTotalPorCurso:", error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * EJERCICIO 7: Consulta con GROUP BY + HAVING
 * GET /api/consultas/matriculas/cursos-con-minimo?min=2
 */
exports.getCursosConMinimo = async (req, res) => {
    const min = parseInt(req.query.min, 10) || 2;

    if (isNaN(min) || min < 0) {
        return res.status(400).json({ error: "El parámetro 'min' debe ser un número entero válido." });
    }

    // Corregido para PostgreSQL: Se cambia '?' por '$1'
    const sql = `
        SELECT c.nombre AS curso_nombre, COUNT(*) AS total_alumnos
        FROM curso c
        INNER JOIN matriculas m ON c.curso_id = m.curso_id
        GROUP BY c.nombre
        HAVING COUNT(*) >= $1;
    `;

    try {
        const result = await db.query(sql, [min]);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: `GET /api/consultas/matriculas/cursos-con-minimo?min=${min}`,
            response_example: result.rows
        });
    } catch (error) {
        console.error("Error en getCursosConMinimo:", error);
        return res.status(500).json({ error: error.message });
    }
};
