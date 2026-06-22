const router = require("express").Router();
const { body } = require("express-validator");

const { login, register } = require("../controllers/authController");
const handleValidation = require("../controllers/middlewares/handleValidation");

const loginValidator = [
    body("usuario").notEmpty().withMessage("El usuario es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

const registerValidator = [
    body("usuario")
        .notEmpty().withMessage("El usuario es obligatorio")
        .isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres")
        .trim(),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

router.post("/login", loginValidator, handleValidation, login);
router.post("/register", registerValidator, handleValidation, register);

module.exports = router;
