const { body } = require("express-validator");

const alumnoValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser texto")
        .trim(),
    body("email")
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El email no tiene un formato válido")
        .normalizeEmail(),
];

module.exports = alumnoValidator;
