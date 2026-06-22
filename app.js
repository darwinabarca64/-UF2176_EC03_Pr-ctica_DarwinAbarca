const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const profesoresRoutes = require("./routes/profesoresRoutes");
const alumnosRoutes = require("./routes/alumnosRoutes");
const cursosRoutes = require("./routes/cursosRoutes");
const especialidadesRoutes = require("./routes/especialidadesRoutes");
const matriculasRoutes = require("./routes/matriculasRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profesores", profesoresRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/especialidades", especialidadesRoutes);
app.use("/api/matriculas", matriculasRoutes);
app.use('/health', (req, res) => {
    res.status(200).json({ message: 'API is healthy' });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
