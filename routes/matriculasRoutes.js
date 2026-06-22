const router = require("express").Router();

const { getMatriculas, createMatricula, updateMatricula, deleteMatricula } = require("../controllers/matriculasController");
const authMiddleware = require("../controllers/middlewares/authMiddleware");
const matriculaValidator = require("../controllers/middlewares/validators/matriculaValidator");
const handleValidation = require("../controllers/middlewares/handleValidation");

router.get("/", getMatriculas);
router.post("/", matriculaValidator, handleValidation, createMatricula);
router.put("/:id", authMiddleware, matriculaValidator, handleValidation, updateMatricula);
router.delete("/:id", authMiddleware, deleteMatricula);

module.exports = router;