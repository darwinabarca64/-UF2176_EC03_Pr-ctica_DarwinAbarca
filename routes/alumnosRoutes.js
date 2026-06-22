const router = require("express").Router();

const { getAlumnos, createAlumno, updateAlumno, deleteAlumno } = require("../controllers/alumnosController");
const authMiddleware = require("../controllers/middlewares/authMiddleware");
const alumnoValidator = require("../controllers/middlewares/validators/alumnoValidator");
const handleValidation = require("../controllers/middlewares/handleValidation");

router.get("/", getAlumnos);
router.post("/", alumnoValidator, handleValidation, createAlumno);
router.put("/:id", authMiddleware, alumnoValidator, handleValidation, updateAlumno);
router.delete("/:id", authMiddleware, deleteAlumno);

module.exports = router;