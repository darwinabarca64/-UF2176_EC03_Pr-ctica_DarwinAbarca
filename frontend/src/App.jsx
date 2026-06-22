import { useState } from "react";
import { login, register } from "./api";
import ProfesorSection from "./components/ProfesorSection";
import AlumnoSection from "./components/AlumnoSection";
import CursoSection from "./components/CursoSection";
import MatriculaSection from "./components/MatriculaSection";

const TABS = ["Profesores", "Alumnos", "Cursos", "Matrículas"];

export default function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [mode, setMode] = useState("login");
    const [authForm, setAuthForm] = useState({ usuario: "", password: "" });
    const [activeTab, setActiveTab] = useState("Profesores");
    const [flash, setFlash] = useState({ type: "", msg: "" });

    const isAuthed = Boolean(token);

    function showFlash(type, msg) {
        setFlash({ type, msg });
        setTimeout(() => setFlash({ type: "", msg: "" }), 3500);
    }

    async function onAuthSubmit(e) {
        e.preventDefault();
        try {
            const fn = mode === "login" ? login : register;
            const data = await fn(authForm.usuario.trim(), authForm.password);
            if (!data?.token) throw new Error("No se recibió token");
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setAuthForm({ usuario: "", password: "" });
            showFlash("ok", mode === "login" ? "Sesión iniciada" : "Registro exitoso");
        } catch (err) {
            showFlash("error", err.message);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setToken("");
        showFlash("ok", "Sesión cerrada");
    }

    const sectionProps = {
        token,
        onError: (m) => showFlash("error", m),
        onSuccess: (m) => showFlash("ok", m),
    };

    return (
        <div className="page-shell">
            <div className="ambient ambient-one" />
            <div className="ambient ambient-two" />

            <main className="panel">
                <header className="hero">
                    <p className="eyebrow">Sistema Académico</p>
                    <h1>Control Académico</h1>
                    {isAuthed && (
                        <div className="hero-actions">
                            <span className="user-pill">Panel activo</span>
                            <button className="ghost" onClick={logout} type="button">
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </header>

                {!isAuthed ? (
                    <section className="card reveal">
                        <div className="tabs">
                            <button
                                className={mode === "login" ? "tab active" : "tab"}
                                onClick={() => setMode("login")}
                                type="button"
                            >
                                Login
                            </button>
                            <button
                                className={mode === "register" ? "tab active" : "tab"}
                                onClick={() => setMode("register")}
                                type="button"
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={onAuthSubmit} className="grid-form">
                            <label>
                                Usuario
                                <input
                                    value={authForm.usuario}
                                    onChange={(e) => setAuthForm((p) => ({ ...p, usuario: e.target.value }))}
                                    placeholder="ej: admin1"
                                    required
                                />
                            </label>
                            <label>
                                Password
                                <input
                                    type="password"
                                    value={authForm.password}
                                    onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))}
                                    placeholder="Tu contraseña"
                                    required
                                />
                            </label>
                            <button className="primary" type="submit">
                                {mode === "login" ? "Entrar" : "Crear cuenta"}
                            </button>
                        </form>
                    </section>
                ) : (
                    <div className="dashboard-shell">
                        <nav className="entity-tabs">
                            {TABS.map((t) => (
                                <button
                                    key={t}
                                    className={activeTab === t ? "etab active" : "etab"}
                                    onClick={() => setActiveTab(t)}
                                    type="button"
                                >
                                    {t}
                                </button>
                            ))}
                        </nav>

                        <section className="card reveal">
                            {activeTab === "Profesores" && <ProfesorSection {...sectionProps} />}
                            {activeTab === "Alumnos" && <AlumnoSection {...sectionProps} />}
                            {activeTab === "Cursos" && <CursoSection {...sectionProps} />}
                            {activeTab === "Matrículas" && <MatriculaSection {...sectionProps} />}
                        </section>
                    </div>
                )}

                {flash.msg && <p className={`flash ${flash.type}`}>{flash.msg}</p>}
            </main>
        </div>
    );
}
