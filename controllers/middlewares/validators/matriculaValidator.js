const { body } = require("express-validator");

const matriculaValidator = [
    body("alumno_id")
        .notEmpty().withMessage("El alumno_id es obligatorio")
        .isInt({ min: 1 }).withMessage("El alumno_id debe ser un número entero positivo"),
    body("curso_id")
        .notEmpty().withMessage("El curso_id es obligatorio")
        .isInt({ min: 1 }).withMessage("El curso_id debe ser un número entero positivo"),
    body("fecha_matricula")
        .notEmpty().withMessage("La fecha de matrícula es obligatoria")
        .isISO8601().withMessage("La fecha debe tener formato YYYY-MM-DD")
        .toDate(),
];

module.exports = matriculaValidator;
