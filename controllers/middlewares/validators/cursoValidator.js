const { body } = require("express-validator");

const cursoValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser texto")
        .trim(),
    body("horas")
        .notEmpty().withMessage("Las horas son obligatorias")
        .isInt({ min: 1 }).withMessage("Las horas deben ser un número entero positivo"),
    body("profesor_id")
        .notEmpty().withMessage("El profesor es obligatorio")
        .isInt({ min: 1 }).withMessage("El profesor_id debe ser un número entero positivo"),
];

module.exports = cursoValidator;
