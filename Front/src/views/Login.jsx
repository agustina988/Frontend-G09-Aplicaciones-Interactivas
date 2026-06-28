import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Login.css";

export default function Login() {
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

            if (!res.ok) {
                const msg = await res.text();
                setError(msg || "Email o contraseña incorrectos.");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            // Usar datos reales del backend
            login({
                id: data.id,
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono || "",
                direccion: data.direccion || "",
                rol: data.rol,
                miembro: data.rol === "ROLE_ADMIN" ? "ADMINISTRADOR" : "MEMBER",
                desde: new Date().getFullYear().toString(),
                avatar: null,
                pedidos: [],
            });

            navigate(data.rol === "ROLE_ADMIN" ? "/admin" : "/perfil");

        } catch (err) {
            setError("Error de conexión con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-image-panel">
                <img src="/src/assets/inicio_sesion_usuario.jpg" alt="Reloj AUREA" />
                <div className="login-image-caption">
                    <p className="login-caption-label">ELEGANCIA Y PRECISIÓN</p>
                    <h2>El arte de lo eterno.</h2>
                </div>
            </div>

            <div className="login-form-panel">
                <div className="login-form-inner">
                    <p className="login-brand">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        AUREA
                    </p>

                    <h1>Bienvenido de nuevo</h1>
                    <p className="login-subtitle">Acceda a su catálogo exclusivo y gestione sus piezas de alta joyería.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label>EMAIL</label>
                            <input type="email" placeholder="nombre@ejemplo.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
                        </div>
                        <div className="login-field">
                            <label>CONTRASEÑA</label>
                            <div className="login-pass-wrap">
                                <input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
                                <button type="button" className="login-pass-toggle" onClick={() => setShowPass(!showPass)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        {showPass
                                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {error && <p className="login-error">{error}</p>}
                        <button type="button" className="login-forgot">Olvidé mi contraseña</button>
                        <button type="submit" className="login-submit" disabled={cargando}>
                            {cargando ? "ACCEDIENDO..." : "ACCEDER AL ATELIER"}
                        </button>
                    </form>

                    <p className="login-register-link">
                        ¿Es su primera visita? <Link to="/registro">Crear cuenta</Link>
                    </p>
                    <div className="login-footer-bar">
                        <span>EST. 1980</span>
                        <span>BUENOS AIRES • ARGENTINA</span>
                    </div>
                </div>
            </div>
        </div>
    );
}