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

---

### Verificación y Pruebas Realizadas

#### Prueba 1: Petición Exitosa (Ejecutada)
* **Petición:** `GET /api/profesores/consultas/por-edad?edad=40`
* **Respuesta (HTTP 200 OK):**
  ```json
  {
    "sql": "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad = $1",
    "request_example": "GET /api/profesores/consultas/por-edad?edad=40",
    "response": [
      {
        "profesor_id": 8,
        "nombre": "Javier Moreno",
        "edad": 40,
        "especialidad_id": 8
      }
    ]
  }
  ```
* **Verificación:** El endpoint extrae correctamente `edad = 40`, ejecuta la consulta preparada con un único `WHERE` y recupera al profesor Javier Moreno (edad 40) de la base de datos de manera exitosa.

#### Prueba 2: Parámetros Inválidos (Caso de Borde)
* **Petición:** `GET /api/profesores/consultas/por-edad?edad=texto`
* **Respuesta (HTTP 400 Bad Request):**
  ```json
  {
    "error": "El parámetro 'edad' es obligatorio y debe ser un número válido."
  }
  ```
* **Verificación:** El sistema rechaza correctamente las entradas no numéricas previniendo consultas erróneas a la base de datos.

---

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

---

### Verificación y Pruebas Realizadas

#### Prueba 1: Petición Exitosa (Ejecutada)
* **Petición:** `GET /api/profesores/consultas/rango?min=30&max=40`
* **Respuesta (HTTP 200 OK):**
  ```json
  {
    "sql": "SELECT profesor_id, nombre, edad, especialidad_id FROM profesores WHERE edad >= $1 AND edad <= $2",
    "request_example": "GET /api/profesores/consultas/rango?min=30&max=40",
    "response": [
      { "profesor_id": 1, "nombre": "Ana García", "edad": 35, "especialidad_id": 1 },
      { "profesor_id": 5, "nombre": "Marta López", "edad": 38, "especialidad_id": 5 },
      { "profesor_id": 7, "nombre": "Elena Torres", "edad": 33, "especialidad_id": 7 },
      { "profesor_id": 8, "nombre": "Javier Moreno", "edad": 40, "especialidad_id": 8 },
      { "profesor_id": 9, "nombre": "Patricia Romero", "edad": 31, "especialidad_id": 9 }
    ]
  }
  ```
* **Verificación:** El endpoint extrae correctamente `min = 30` y `max = 40`, ejecuta la consulta preparada con dos condiciones en el `WHERE` unidas por `AND`, y recupera exactamente a los profesores cuyas edades están en el rango especificado.

#### Prueba 2: Parámetros Inválidos (Caso de Borde)
* **Petición:** `GET /api/profesores/consultas/rango?min=30`
* **Respuesta (HTTP 400 Bad Request):**
  ```json
  {
    "error": "Los parámetros 'min' y 'max' son obligatorios y deben ser numéricos."
  }
  ```
* **Verificación:** El sistema rechaza la solicitud si falta uno de los dos parámetros del rango o si no son de tipo numérico.

