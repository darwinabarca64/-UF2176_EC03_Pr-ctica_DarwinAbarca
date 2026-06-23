# Entrega de Ejercicios - Desarrollo API Academia

## Ejercicio 1: Consulta Básica con WHERE (Profesores por edad exacta)

### Descripción
Implementación de un endpoint para listar los profesores cuya edad sea igual al valor numérico recibido a través de la query string (`edad`), utilizando una consulta preparada con una sola condición `WHERE`.

* **Endpoint:** `GET /api/profesores/consultas/por-edad?edad=40`
* **Condición mínima cumplida:** Una sola condición `WHERE edad = $1` en PostgreSQL.

---

### Código Implementado

#### 1. Modelo: [models/Profesor.js](file:///c:/Users/Dar/Desktop/nodejs/academiaejercicio/academia-main/models/Profesor.js)
Se definió el método `findByEdad(edad)` para realizar la consulta preparada con un único parámetro:
```javascript
findByEdad: (edad) => {
    const sql = "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad = $1";
    return pool.query(sql, [edad]).then(result => ({
        rows: result.rows,
        sqlUsed: sql
    }));
}
```

#### 2. Controlador: [controllers/profesoresController.js](file:///c:/Users/Dar/Desktop/nodejs/academiaejercicio/academia-main/controllers/profesoresController.js)
Se implementó `getProfesoresPorEdad` encargado de extraer el parámetro de la query, validar que sea obligatorio y numérico (devolviendo `HTTP 400` en caso de error), llamar al modelo y estructurar la respuesta JSON:
```javascript
const getProfesoresPorEdad = async (req, res) => {
    try {
        const { edad } = req.query;

        if (!edad || isNaN(edad)) {
            return res.status(400).json({ 
                error: "El parámetro 'edad' es obligatorio y debe ser un número válido." 
            });
        }

        const resultado = await Profesor.findByEdad(parseInt(edad));

        res.json({
            sql: resultado.sqlUsed,
            request_example: `GET /api/profesores/consultas/por-edad?edad=${edad}`,
            response: resultado.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

#### 3. Rutas: [routes/profesoresRoutes.js](file:///c:/Users/Dar/Desktop/nodejs/academiaejercicio/academia-main/routes/profesoresRoutes.js)
Se registró el endpoint mapeándolo a su respectiva función del controlador:
```javascript
router.get("/consultas/por-edad", profesoresController.getProfesoresPorEdad);
```

## Ejercicio 2: Consulta con WHERE Doble Condicional (Profesores por rango de edad)

### Descripción
Implementación de un endpoint para listar los profesores que se encuentren en un rango de edad definido por dos parámetros de la query string (`min` y `max`), utilizando una consulta preparada con dos condiciones en el `WHERE` unidas mediante el operador lógico `AND`.

* **Endpoint:** `GET /api/profesores/consultas/rango?min=18&max=25`
* **Condición mínima cumplida:** Cláusula `WHERE edad >= $1 AND edad <= $2` en PostgreSQL.

---

### Código Implementado

#### 1. Modelo: [models/Profesor.js](file:///c:/Users/Dar/Desktop/nodejs/academiaejercicio/academia-main/models/Profesor.js)
Se definió el método `findByRangoEdad(min, max)` para realizar la consulta preparada de rango:
```javascript
findByRangoEdad: (min, max) => {
    const sql = "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad >= $1 AND edad <= $2";
    return pool.query(sql, [min, max]).then(result => ({
        rows: result.rows,
        sqlUsed: sql
    }));
}
```

#### 2. Controlador: [controllers/profesoresController.js](file:///c:/Users/Dar/Desktop/nodejs/academiaejercicio/academia-main/controllers/profesoresController.js)
Se implementó `getProfesoresPorRangoEdad` encargado de extraer y validar los parámetros `min` y `max`, validando que sean obligatorios y numéricos, y estructurar la respuesta JSON final:
```javascript
const getProfesoresPorRangoEdad = async (req, res) => {
    try {
        const { min, max } = req.query;

        if (!min || !max || isNaN(min) || isNaN(max)) {
            return res.status(400).json({ 
                error: "Los parámetros 'min' y 'max' son obligatorios y deben ser numéricos." 
            });
        }

        const { rows, sqlUsed } = await Profesor.findByRangoEdad(parseInt(min), parseInt(max));

        res.json({
            sql: sqlUsed,
            request_example: `GET /api/profesores/consultas/rango?min=${min}&max=${max}`,
            response: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

#### 3. Rutas: [routes/profesoresRoutes.js](file:///c:/Users/Dar/Desktop/nodejs/academiaejercicio/academia-main/routes/profesoresRoutes.js)
Se registró el endpoint de rango de edad:
```javascript
router.get("/consultas/rango", profesoresController.getProfesoresPorRangoEdad);
```
## Ejercicio 3: Consulta con Subconsulta (Cursos con el máximo total de matrículas)

### Descripción
Implementación de un endpoint para obtener el curso o los cursos cuya cantidad de matrículas sea igual al máximo total histórico, cumpliendo con el requisito de calcular dicho valor a través de una subconsulta interna.

* **Endpoint:** `GET /api/consultas/cursos/top-matriculados`
* **Condición mínima cumplida:** Uso de una subconsulta con la función de agregación `MAX(total)` dentro de la cláusula `HAVING`.

---

### Código Implementado

#### 1. Controlador: `controllers/consultasController.js`
```javascript
exports.getTopMatriculados = async (req, res) => {
    const sql = `
        SELECT c.nombre AS curso_nombre, COUNT(*) AS total_matriculas
        FROM curso c
        INNER JOIN matriculas m ON c.curso_id = m.curso_id
        GROUP BY c.nombre
        HAVING COUNT(*) = (
            SELECT MAX(total)
            FROM (
                SELECT COUNT(*) AS total
                FROM matriculas
                GROUP BY curso_id
            ) AS sub_tabla
        );
    `;
    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/cursos/top-matriculados",
            response_example: result.rows
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
```

#### 2. Rutas: `routes/consultasRoutes.js`
```javascript
router.get('/cursos/top-matriculados', consultasController.getTopMatriculados);
```

---

## Ejercicio 4: Consulta relacionando 2 tablas con JOIN (Listado detallado de Matrículas)

### Descripción
Implementación de un endpoint diseñado para listar de forma cruzada los registros de matrículas, mostrando de forma explícita propiedades representativas de ambas entidades vinculadas.

* **Endpoint:** `GET /api/consultas/matriculas/alumno-curso`
* **Condición mínima cumplida:** Uso de `INNER JOIN` entre la tabla relacional y las entidades maestras (`alumnos` y `curso`).

---

### Código Implementado

#### 1. Controlador: `controllers/consultasController.js`
```javascript
exports.getMatriculasAlumnoCurso = async (req, res) => {
    const sql = `
        SELECT a.nombre AS alumno_nombre, c.nombre AS curso_nombre, m.fecha_matricula
        FROM matriculas m
        INNER JOIN alumnos a ON m.alumno_id = a.alumno_id
        INNER JOIN curso c ON m.curso_id = c.curso_id;
    `;
    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/matriculas/alumno-curso",
            response_example: result.rows
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
```

#### 2. Rutas: `routes/consultasRoutes.js`
```javascript
router.get('/matriculas/alumno-curso', consultasController.getMatriculasAlumnoCurso);
```

---

## Ejercicio 5: Consulta relacionando 3 tablas con JOIN (Profesores, Cursos y Especialidades)

### Descripción
Implementación de un endpoint para generar una relación jerárquica compleja, mostrando en una misma fila al profesor, su especialidad académica y los cursos correspondientes asociados a dicha especialización.

* **Endpoint:** `GET /api/consultas/profesores/curso-especialidad`
* **Condición mínima cumplida:** Interconexión encadenada mediante `INNER JOIN` utilizando 3 tablas independientes de la base de datos.

---

### Código Implementado

#### 1. Controlador: `controllers/consultasController.js`
```javascript
exports.getProfesoresCursoEspecialidad = async (req, res) => {
    const sql = `
        SELECT p.nombre AS profesor_nombre, e.nombre AS especialidad_nombre, c.nombre AS curso_nombre
        FROM profesores p
        INNER JOIN especialidad e ON p.especialidad_id = e.especialidad_id
        INNER JOIN curso c ON c.especialidad_id = e.especialidad_id;
    `;
    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/profesores/curso-especialidad",
            response_example: result.rows
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
```

#### 2. Rutas: `routes/consultasRoutes.js`
```javascript
router.get('/profesores/curso-especialidad', consultasController.getProfesoresCursoEspecialidad);
```

---

## Ejercicio 6: Consulta con GROUP BY (Total de Alumnos Matriculados por Curso)

### Descripción
Implementación de un endpoint analítico para cuantificar el volumen de estudiantes pertenecientes a cada curso, garantizando que se muestren incluso aquellos cursos con cero inscritos.

* **Endpoint:** `GET /api/consultas/matriculas/total-por-curso`
* **Condición mínima cumplida:** Agrupamiento explícito mediante `GROUP BY` combinado con la función de conteo `COUNT()`.

---

### Código Implementado

#### 1. Controlador: `controllers/consultasController.js`
```javascript
exports.getMatriculasTotalPorCurso = async (req, res) => {
    const sql = `
        SELECT c.nombre AS curso_nombre, COUNT(m.curso_id) AS total_alumnos
        FROM curso c
        LEFT JOIN matriculas m ON c.curso_id = m.curso_id
        GROUP BY c.nombre;
    `;
    try {
        const result = await db.query(sql);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: "GET /api/consultas/matriculas/total-por-curso",
            response_example: result.rows
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
```

#### 2. Rutas: `routes/consultasRoutes.js`
```javascript
router.get('/matriculas/total-por-curso', consultasController.getMatriculasTotalPorCurso);
```

---

## Ejercicio 7: Consulta con GROUP BY + HAVING (Cursos con un mínimo de matrícula)

### Descripción
Implementación de un endpoint parametrizado dinámicamente mediante query strings (`?min=X`) que calcula el total de matriculados por curso, aplicando restricciones controladas tras el proceso de agregación y validando los datos de entrada para evitar fallos de servidor.

* **Endpoint:** `GET /api/consultas/matriculas/cursos-con-minimo?min=2`
* **Condición mínima cumplida:** Uso de un filtro condicional `HAVING COUNT(*) >= $1` parametrizado con marcadores posicionales nativos de PostgreSQL.

---

### Código Implementado

#### 1. Controlador: `controllers/consultasController.js`
```javascript
exports.getCursosConMinimo = async (req, res) => {
    const min = parseInt(req.query.min, 10) || 2;

    if (isNaN(min) || min < 0) {
        return res.status(400).json({ error: "El parámetro 'min' debe ser un número entero válido." });
    }

    const sql = `
        SELECT c.nombre AS curso_nombre, COUNT(*) AS total_alumnos
        FROM curso c
        INNER JOIN matriculas m ON c.id = m.curso_id
        GROUP BY c.nombre
        HAVING COUNT(*) >= $1;
    `;
    try {
        const result = await db.query(sql, [min]);
        return res.status(200).json({
            sql_used: sql.trim().replace(/\s+/g, ' '),
            request_example: `GET /api/consultas/matriculas/cursos-con-minimo?min=${min}`,
            response_example: result.rows
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
```

#### 2. Rutas: `routes/consultasRoutes.js`
```javascript
router.get('/matriculas/cursos-con-minimo', consultasController.getCursosConMinimo);
```
