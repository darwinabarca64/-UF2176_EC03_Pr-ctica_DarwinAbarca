import { useState, useEffect } from "react";
import { getCursos, createCurso, updateCurso, deleteCurso, getProfesores } from "../api";

const EMPTY = { nombre: "", horas: "", profesor_id: "" };

export default function CursoSection({ token, onError, onSuccess }) {
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
        loadProfesores();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const data = await getCursos(token);
            setCursos(Array.isArray(data) ? data : []);
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadProfesores() {
        try {
            const data = await getProfesores(token);
            setProfesores(Array.isArray(data) ? data : []);
        } catch {}
    }

    function startEdit(c) {
        setForm({ nombre: c.nombre, horas: String(c.horas), profesor_id: String(c.profesor_id) });
        setEditingId(c.curso_id);
    }

    function cancel() {
        setForm(EMPTY);
        setEditingId(null);
    }

    const change = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    async function onSubmit(e) {
        e.preventDefault();
        const payload = {
            nombre: form.nombre,
            horas: Number(form.horas),
            profesor_id: Number(form.profesor_id),
        };
        try {
            if (editingId) {
                await updateCurso(token, editingId, payload);
                onSuccess("Curso actualizado");
            } else {
                await createCurso(token, payload);
                onSuccess("Curso creado");
            }
            cancel();
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    async function remove(id) {
        if (!window.confirm("¿Eliminar este curso?")) return;
        try {
            await deleteCurso(token, id);
            onSuccess("Curso eliminado");
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    return (
        <div className="section-content">
            <form onSubmit={onSubmit} className="entity-form">
                <div className="section-head">
                    <h3>{editingId ? "Editar Curso" : "Nuevo Curso"}</h3>
                    {editingId && (
                        <button className="ghost sm" type="button" onClick={cancel}>Cancelar</button>
                    )}
                </div>
                <div className="form-row">
                    <label>
                        Nombre
                        <input value={form.nombre} onChange={change("nombre")} placeholder="Ej: Matemáticas I" required />
                    </label>
                    <label>
                        Horas
                        <input type="number" min="1" value={form.horas} onChange={change("horas")} placeholder="40" required />
                    </label>
                    <label>
                        Profesor
                        <select value={form.profesor_id} onChange={change("profesor_id")} required>
                            <option value="">Seleccionar...</option>
                            {profesores.map((p) => (
                                <option key={p.profesor_id} value={p.profesor_id}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
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
                            <th>Nombre</th>
                            <th>Horas</th>
                            <th>Profesor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="state">Cargando...</td></tr>
                        ) : cursos.length === 0 ? (
                            <tr><td colSpan="5" className="state">Sin cursos</td></tr>
                        ) : (
                            cursos.map((c) => (
                                <tr key={c.curso_id}>
                                    <td>{c.curso_id}</td>
                                    <td>{c.nombre}</td>
                                    <td>{c.horas}</td>
                                    <td>{c.profesor || `ID ${c.profesor_id}`}</td>
                                    <td className="actions">
                                        <button className="btn-edit" type="button" onClick={() => startEdit(c)}>Editar</button>
                                        <button className="btn-del" type="button" onClick={() => remove(c.curso_id)}>Eliminar</button>
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
