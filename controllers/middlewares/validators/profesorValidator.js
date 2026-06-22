const { body } = require("express-validator");

const profesorValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser texto")
        .isLength({ min: 3 }).withMessage("Debe tener al menos 3 caracteres")
        .trim(),
    body("edad")
        .notEmpty().withMessage("La edad es obligatoria")
        .isInt({ min: 18, max: 100 }).withMessage("La edad debe ser un número entero entre 18 y 100"),
    body("especialidad_id")
        .notEmpty().withMessage("La especialidad es obligatoria")
        .isInt({ min: 1 }).withMessage("El especialidad_id debe ser un número entero positivo"),
];

module.exports = profesorValidator;
