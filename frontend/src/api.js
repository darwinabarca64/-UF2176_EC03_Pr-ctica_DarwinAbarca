const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const msg = data?.mensaje || data?.errores?.[0]?.msg || "Error de servidor";
        throw new Error(msg);
    }

    return data;
}

function authHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Auth ──────────────────────────────────────────
export const login = (usuario, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ usuario, password }) });

export const register = (usuario, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ usuario, password }) });

// ── Especialidades (solo lectura para dropdowns) ──
export const getEspecialidades = (token) =>
    request("/especialidades", { headers: authHeader(token) });

// ── Profesores ────────────────────────────────────
export const getProfesores = (token) =>
    request("/profesores", { headers: authHeader(token) });

export const createProfesor = (token, payload) =>
    request("/profesores", { method: "POST", headers: authHeader(token), body: JSON.stringify(payload) });

export const updateProfesor = (token, id, payload) =>
    request(`/profesores/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(payload) });

export const deleteProfesor = (token, id) =>
    request(`/profesores/${id}`, { method: "DELETE", headers: authHeader(token) });

// ── Alumnos ───────────────────────────────────────
export const getAlumnos = (token) =>
    request("/alumnos", { headers: authHeader(token) });

export const createAlumno = (token, payload) =>
    request("/alumnos", { method: "POST", headers: authHeader(token), body: JSON.stringify(payload) });

export const updateAlumno = (token, id, payload) =>
    request(`/alumnos/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(payload) });

export const deleteAlumno = (token, id) =>
    request(`/alumnos/${id}`, { method: "DELETE", headers: authHeader(token) });

// ── Cursos ────────────────────────────────────────
export const getCursos = (token) =>
    request("/cursos", { headers: authHeader(token) });

export const createCurso = (token, payload) =>
    request("/cursos", { method: "POST", headers: authHeader(token), body: JSON.stringify(payload) });

export const updateCurso = (token, id, payload) =>
    request(`/cursos/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(payload) });

export const deleteCurso = (token, id) =>
    request(`/cursos/${id}`, { method: "DELETE", headers: authHeader(token) });

// ── Matrículas ────────────────────────────────────
export const getMatriculas = (token) =>
    request("/matriculas", { headers: authHeader(token) });

export const createMatricula = (token, payload) =>
    request("/matriculas", { method: "POST", headers: authHeader(token), body: JSON.stringify(payload) });

export const updateMatricula = (token, id, payload) =>
    request(`/matriculas/${id}`, { method: "PUT", headers: authHeader(token), body: JSON.stringify(payload) });

export const deleteMatricula = (token, id) =>
    request(`/matriculas/${id}`, { method: "DELETE", headers: authHeader(token) });
