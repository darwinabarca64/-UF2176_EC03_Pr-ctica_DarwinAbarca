import { useState, useEffect } from "react";
import { getAlumnos, createAlumno, updateAlumno, deleteAlumno } from "../api";

const EMPTY = { nombre: "", email: "" };

export default function AlumnoSection({ token, onError, onSuccess }) {
    const [alumnos, setAlumnos] = useState([]);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        try {
            setLoading(true);
            const data = await getAlumnos(token);
            setAlumnos(Array.isArray(data) ? data : []);
        } catch (err) {
            onError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function startEdit(a) {
        setForm({ nombre: a.nombre, email: a.email });
        setEditingId(a.alumno_id);
    }

    function cancel() {
        setForm(EMPTY);
        setEditingId(null);
    }

    const change = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

    async function onSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await updateAlumno(token, editingId, form);
                onSuccess("Alumno actualizado");
            } else {
                await createAlumno(token, form);
                onSuccess("Alumno creado");
            }
            cancel();
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    async function remove(id) {
        if (!window.confirm("¿Eliminar este alumno?")) return;
        try {
            await deleteAlumno(token, id);
            onSuccess("Alumno eliminado");
            await load();
        } catch (err) {
            onError(err.message);
        }
    }

    return (
        <div className="section-content">
            <form onSubmit={onSubmit} className="entity-form">
                <div className="section-head">
                    <h3>{editingId ? "Editar Alumno" : "Nuevo Alumno"}</h3>
                    {editingId && (
                        <button className="ghost sm" type="button" onClick={cancel}>Cancelar</button>
                    )}
                </div>
                <div className="form-row">
                    <label>
                        Nombre
                        <input value={form.nombre} onChange={change("nombre")} placeholder="Nombre completo" required />
                    </label>
                    <label>
                        Email
                        <input type="email" value={form.email} onChange={change("email")} placeholder="correo@ejemplo.com" required />
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
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="state">Cargando...</td></tr>
                        ) : alumnos.length === 0 ? (
                            <tr><td colSpan="4" className="state">Sin alumnos</td></tr>
                        ) : (
                            alumnos.map((a) => (
                                <tr key={a.alumno_id}>
                                    <td>{a.alumno_id}</td>
                                    <td>{a.nombre}</td>
                                    <td>{a.email}</td>
                                    <td className="actions">
                                        <button className="btn-edit" type="button" onClick={() => startEdit(a)}>Editar</button>
                                        <button className="btn-del" type="button" onClick={() => remove(a.alumno_id)}>Eliminar</button>
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
