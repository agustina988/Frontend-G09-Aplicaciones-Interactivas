import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./LoginAdmin.css";

export default function LoginAdmin() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError("Completá todos los campos."); return; }
        setCargando(true);
        setError("");

        try {
            const res = await fetch("http://localhost:4002/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) { setError("Credenciales incorrectas."); return; }

            const data = await res.json();

            if (data.rol !== "ROLE_ADMIN") {
                setError("Acceso restringido. Esta cuenta no tiene permisos de administrador.");
                return;
            }

            localStorage.setItem("token", data.token);

            login({
                id: data.id,
                nombre: data.nombre || "Admin AUREA",
                email: data.email,
                telefono: data.telefono || "",
                direccion: data.direccion || "",
                rol: data.rol,
                miembro: "ADMINISTRADOR",
                desde: "2024",
                avatar: null,
                pedidos: [],
            });

            navigate("/admin");

        } catch (err) {
            setError("Error de conexión con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-admin-page">
            <header className="login-admin-header">
                <div className="login-admin-brand">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>AUREA</span>
                </div>
                <span className="login-admin-sistema">SISTEMA CENTRAL</span>
            </header>

            <main className="login-admin-main">
                <div className="login-admin-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        <circle cx="12" cy="16" r="1" fill="#8b6914"/>
                    </svg>
                </div>

                <h1>Portal de Gestión</h1>
                <p className="login-admin-sub">AUTENTICACIÓN DE ALTO NIVEL</p>

                <div className="login-admin-card">
                    <form onSubmit={handleSubmit}>
                        <div className="login-admin-field">
                            <label>ID DE EMPLEADO / EMAIL</label>
                            <input type="email" placeholder="Ingresar credencial..." value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="login-admin-field">
                            <label>CÓDIGO DE SEGURIDAD</label>
                            <div className="login-admin-pass">
                                <input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button type="button" onClick={() => setShowPass(!showPass)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
                                        {showPass
                                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {error && <p className="login-admin-error">{error}</p>}
                        <button type="submit" className="login-admin-btn" disabled={cargando}>
                            {cargando ? "VERIFICANDO..." : "VERIFICAR CREDENCIALES"}
                        </button>
                    </form>
                </div>

                <div className="login-admin-quote">
                    <span>• • •</span>
                    <p>"Acceso restringido a personal autorizado."</p>
                    <span className="login-admin-proto">PROTOCOLO DE SEGURIDAD AES-256 ACTIVO</span>
                </div>
            </main>

            <footer className="login-admin-footer">
                <span>AUREA HERITAGE SYSTEMS © 2024</span>
                <span>GLOBAL ADMIN PORTAL <span className="login-admin-secure">● SECURE LINK</span></span>
            </footer>

            <div className="login-admin-watermark">INTERNAL USE ONLY</div>
        </div>
    );
}