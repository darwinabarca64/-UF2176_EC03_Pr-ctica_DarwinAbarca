import { useState, useEffect } from "react";
import { getProfesores, createProfesor, updateProfesor, deleteProfesor, getEspecialidades } from "../api";

const EMPTY = { nombre: "", edad: "", especialidad_id: "" };

export default function ProfesorSection({ token, onError, onSuccess }) {
    const [profesores, setProfesores] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load();
        loadEspecialidades();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const data = await getProfesores(token);
            setProfesores(Array.isArray(data) ? data : []);
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function loadEspecialidades() {
        try {
            const data = await getEspecialidades(token);
            setEspecialidades(Array.isArray(data) ? data : []);
        } catch {}
    }

    function startEdit(p) {
        setForm({ nombre: p.nombre, edad: String(p.edad), especialidad_id: String(p.especialidad_id) });
        setEditingId(p.profesor_id);
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
            edad: Number(form.edad),
            especialidad_id: Number(form.especialidad_id),
        };
        try {
            if (editingId) {
                await updateProfesor(token, editingId, payload);
                onSuccess("Profesor actualizado");
            } else {
                await createProfesor(token, payload);
                onSuccess("Profesor creado");
            }
            cancel();
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    async function remove(id) {
        if (!window.confirm("¿Eliminar este profesor?")) return;
        try {
            await deleteProfesor(token, id);
            onSuccess("Profesor eliminado");
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    return (
        <div className="section-content">
            <form onSubmit={onSubmit} className="entity-form">
                <div className="section-head">
                    <h3>{editingId ? "Editar Profesor" : "Nuevo Profesor"}</h3>
                    {editingId && (
                        <button className="ghost sm" type="button" onClick={cancel}>
                            Cancelar
                        </button>
                    )}
                </div>
                <div className="form-row">
                    <label>
                        Nombre
                        <input value={form.nombre} onChange={change("nombre")} placeholder="Nombre completo" required />
                    </label>
                    <label>
                        Edad
                        <input type="number" min="18" max="100" value={form.edad} onChange={change("edad")} placeholder="35" required />
                    </label>
                    <label>
                        Especialidad
                        <select value={form.especialidad_id} onChange={change("especialidad_id")} required>
                            <option value="">Seleccionar...</option>
                            {especialidades.map((e) => (
                                <option key={e.especialidad_id} value={e.especialidad_id}>
                                    {e.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="form-actions">
                        <button className="primary" type="submit">
                            {editingId ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </div>
            </form>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Especialidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="state">Cargando...</td>
                            </tr>
                        ) : profesores.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="state">Sin profesores</td>
                            </tr>
                        ) : (
                            profesores.map((p) => (
                                <tr key={p.profesor_id}>
                                    <td>{p.profesor_id}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.edad}</td>
                                    <td>{p.especialidad || `ID ${p.especialidad_id}`}</td>
                                    <td className="actions">
                                        <button className="btn-edit" type="button" onClick={() => startEdit(p)}>Editar</button>
                                        <button className="btn-del" type="button" onClick={() => remove(p.profesor_id)}>Eliminar</button>
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
