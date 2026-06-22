import { useState, useEffect } from "react";
import { getMatriculas, createMatricula, updateMatricula, deleteMatricula, getAlumnos, getCursos } from "../api";

const EMPTY = { alumno_id: "", curso_id: "", fecha_matricula: "" };

function toInputDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
}

export default function MatriculaSection({ token, onError, onSuccess }) {
    const [matriculas, setMatriculas] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
        loadAlumnos();
        loadCursos();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const data = await getMatriculas(token);
            setMatriculas(Array.isArray(data) ? data : []);
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadAlumnos() {
        try {
            const data = await getAlumnos(token);
            setAlumnos(Array.isArray(data) ? data : []);
        } catch {}
    }

    async function loadCursos() {
        try {
            const data = await getCursos(token);
            setCursos(Array.isArray(data) ? data : []);
        } catch {}
    }

    function startEdit(m) {
        setForm({
            alumno_id: String(m.alumno_id),
            curso_id: String(m.curso_id),
            fecha_matricula: toInputDate(m.fecha_matricula),
        });
        setEditingId(m.matricula_id);
    }

    function cancel() {
        setForm(EMPTY);
        setEditingId(null);
    }

    const change = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    async function onSubmit(e) {
        e.preventDefault();
        const payload = {
            alumno_id: Number(form.alumno_id),
            curso_id: Number(form.curso_id),
            fecha_matricula: form.fecha_matricula,
        };
        try {
            if (editingId) {
                await updateMatricula(token, editingId, payload);
                onSuccess("Matrícula actualizada");
            } else {
                await createMatricula(token, payload);
                onSuccess("Matrícula creada");
            }
            cancel();
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    async function remove(id) {
        if (!window.confirm("¿Eliminar esta matrícula?")) return;
        try {
            await deleteMatricula(token, id);
            onSuccess("Matrícula eliminada");
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    return (
        <div className="section-content">
            <form onSubmit={onSubmit} className="entity-form">
                <div className="section-head">
                    <h3>{editingId ? "Editar Matrícula" : "Nueva Matrícula"}</h3>
                    {editingId && (
                        <button className="ghost sm" type="button" onClick={cancel}>Cancelar</button>
                    )}
                </div>
                <div className="form-row">
                    <label>
                        Alumno
                        <select value={form.alumno_id} onChange={change("alumno_id")} required>
                            <option value="">Seleccionar...</option>
                            {alumnos.map((a) => (
                                <option key={a.alumno_id} value={a.alumno_id}>
                                    {a.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Curso
                        <select value={form.curso_id} onChange={change("curso_id")} required>
                            <option value="">Seleccionar...</option>
                            {cursos.map((c) => (
                                <option key={c.curso_id} value={c.curso_id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Fecha de matrícula
                        <input type="date" value={form.fecha_matricula} onChange={change("fecha_matricula")} required />
                    </label>
                    <div className="form-actions">
                        <button className="primary" type="submit">{editingId ? "Actualizar" : "Guardar"}</button>
                    </div>
                </div>
            </form>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Alumno</th>
                            <th>Curso</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="state">Cargando...</td></tr>
                        ) : matriculas.length === 0 ? (
                            <tr><td colSpan="5" className="state">Sin matrículas</td></tr>
                        ) : (
                            matriculas.map((m) => (
                                <tr key={m.matricula_id}>
                                    <td>{m.matricula_id}</td>
                                    <td>{m.alumno}</td>
                                    <td>{m.curso}</td>
                                    <td>{toInputDate(m.fecha_matricula)}</td>
                                    <td className="actions">
                                        <button className="btn-edit" type="button" onClick={() => startEdit(m)}>Editar</button>
                                        <button className="btn-del" type="button" onClick={() => remove(m.matricula_id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
