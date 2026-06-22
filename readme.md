## Endpoints disponibles
# Profesores
GET    /api/profesores
GET    /api/profesores/1
POST   /api/profesores
PUT    /api/profesores/1
DELETE /api/profesores/1
# Alumnos
GET    /api/alumnos
POST   /api/alumnos
# Cursos
GET    /api/cursos
POST   /api/cursos
# Especialidades
GET /api/especialidades
# Matrículas
GET  /api/matriculas
POST /api/matriculas
# Ejemplo POST Profesor
{
  "nombre": "Pedro García",
  "edad": 40,
  "especialidad_id": 3
}
# Ejemplo POST Alumno
{
  "nombre": "María Pérez",
  "email": "maria@gmail.com"
}
# Ejemplo POST Matrícula
{
  "alumno_id": 1,
  "curso_id": 3,
  "fecha_matricula": "2025-12-10"
}