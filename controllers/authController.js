const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

/**
 * POST /api/auth/login
 * Body: { usuario, password }
 * Credentials are stored as env vars: ADMIN_USER and ADMIN_PASSWORD_HASH.
 * Generate a hash once with: node -e "const b=require('bcryptjs');b.hash('tu_password',10).then(console.log)"
 */
const login = async (req, res) => {
    const { usuario, password } = req.body;

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ mensaje: "JWT_SECRET no está configurado" });
    }

    const usuarioDbResultado = await Usuario.findByUsuario(usuario);
    const usuarioDb = usuarioDbResultado.rows[0];

    if (usuarioDb) {
        const passwordValidaDb = await bcrypt.compare(password, usuarioDb.password_hash);
        if (!passwordValidaDb) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        const tokenDb = jwt.sign(
            { usuario_id: usuarioDb.usuario_id, usuario: usuarioDb.usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        );

        return res.json({ token: tokenDb });
    }

    const adminUser = process.env.ADMIN_USER;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUser || !adminHash) {
        return res.status(500).json({ mensaje: "Credenciales de administrador no configuradas en el servidor" });
    }

    if (usuario !== adminUser) {
        return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const passwordValida = await bcrypt.compare(password, adminHash);
    if (!passwordValida) {
        return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
        { usuario },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    return res.json({ token });
};

const register = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ mensaje: "JWT_SECRET no está configurado" });
        }

        const usuarioExistenteResultado = await Usuario.findByUsuario(usuario);
        if (usuarioExistenteResultado.rows.length > 0) {
            return res.status(409).json({ mensaje: "El usuario ya existe" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const creado = await Usuario.create(usuario, passwordHash);
        const nuevoUsuario = creado.rows[0];

        const token = jwt.sign(
            { usuario_id: nuevoUsuario.usuario_id, usuario: nuevoUsuario.usuario },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
        );

        return res.status(201).json({
            mensaje: "Usuario registrado",
            usuario: nuevoUsuario,
            token,
        });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { login, register };
