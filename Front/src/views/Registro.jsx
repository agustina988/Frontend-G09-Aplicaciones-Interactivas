import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { registroAPI } from "../services/api";
import "./Registro.css";

export default function Registro() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "", telefono: "", newsletter: false });
    const [errors, setErrors] = useState({});
    const [cargando, setCargando] = useState(false);

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.nombre) e.nombre = "Requerido";
        if (!form.email.includes("@")) e.email = "Email inválido";
        if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
        if (form.password !== form.confirmar) e.confirmar = "Las contraseñas no coinciden";
        if (form.telefono) {
            const tel = form.telefono.replace(/\s|-/g, "");
            if (!/^(\+54|0054|54)?9?[1-9]\d{9}$/.test(tel)) e.telefono = "Formato inválido. Ej: +54 9 11 0000-0000";
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) { setErrors(e2); return; }

        setCargando(true);
        try {
            const data = await registroAPI({ email: form.email, password: form.password, nombre: form.nombre, telefono: form.telefono });
            localStorage.setItem("token", data.token);

            login({
                id: data.id,
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono || form.telefono,
                direccion: data.direccion || "",
                rol: data.rol || "ROLE_USER",
                miembro: "MEMBER",
                desde: new Date().getFullYear().toString(),
                avatar: null,
                pedidos: [],
            });

            navigate("/perfil");

        } catch (err) {
            setErrors({ email: err.message || "Error de conexión con el servidor." });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="registro-page">
            <div className="registro-image-panel">
                <img src="/src/assets/crear_cuenta_usuario.jpg" alt="Joyería artesanal" />
                <div className="registro-image-caption">
                    <p className="registro-est">EST. 1980</p>
                    <h2>La Maestría del<br />Tiempo.</h2>
                    <p>Cada pieza en nuestra colección es un testimonio de décadas de tradición y perfección técnica.</p>
                </div>
            </div>

            <div className="registro-form-panel">
                <div className="registro-form-inner">
                    <div className="registro-brand">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        AUREA
                    </div>

                    <h1>Únase a AUREA</h1>
                    <p className="registro-subtitle">Forme parte de nuestra exclusiva comunidad de coleccionistas y acceda a piezas de edición limitada.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="registro-field">
                            <label>Nombre Completo</label>
                            <input type="text" placeholder="Julian Alexander de la Tour" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
                            {errors.nombre && <p className="registro-err">{errors.nombre}</p>}
                        </div>
                        <div className="registro-field">
                            <label>Email</label>
                            <input type="email" placeholder="j.alexander@lifestyle.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                            {errors.email && <p className="registro-err">{errors.email}</p>}
                        </div>
                        <div className="registro-row">
                            <div className="registro-field">
                                <label>Contraseña</label>
                                <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} />
                                {errors.password && <p className="registro-err">{errors.password}</p>}
                            </div>
                            <div className="registro-field">
                                <label>Confirmar Contraseña</label>
                                <input type="password" placeholder="••••••••" value={form.confirmar} onChange={(e) => set("confirmar", e.target.value)} />
                                {errors.confirmar && <p className="registro-err">{errors.confirmar}</p>}
                            </div>
                        </div>
                        <div className="registro-field">
                            <label>Teléfono (opcional)</label>
                            <input type="tel" placeholder="+54 9 11 0000-0000" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />
                            {errors.telefono && <p className="registro-err">{errors.telefono}</p>}
                        </div>
                        <label className="registro-check">
                            <input type="checkbox" checked={form.newsletter} onChange={(e) => set("newsletter", e.target.checked)} />
                            Deseo recibir invitaciones exclusivas y noticias de colecciones especiales.
                        </label>
                        <button type="submit" className="registro-submit" disabled={cargando}>
                            {cargando ? "CREANDO CUENTA..." : "CREAR CUENTA"}
                        </button>
                    </form>

                    <p className="registro-login-link">
                        ¿Ya tiene una cuenta? <Link to="/login">Iniciar Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}