const pool = require("../config/db");

const ensureTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            usuario_id SERIAL PRIMARY KEY,
            usuario VARCHAR(80) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

const findByUsuario = async (usuario) => {
    await ensureTable();
    return pool.query(
        "SELECT usuario_id, usuario, password_hash FROM usuarios WHERE usuario = $1",
        [usuario]
    );
};

const create = async (usuario, passwordHash) => {
    await ensureTable();
    return pool.query(
        `INSERT INTO usuarios (usuario, password_hash)
         VALUES ($1, $2)
         RETURNING usuario_id, usuario, creado_en`,
        [usuario, passwordHash]
    );
};

module.exports = {
    findByUsuario,
    create,
};
