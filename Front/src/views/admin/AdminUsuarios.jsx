import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import AdminNav from "./AdminNav";
import "./AdminUsuarios.css";

export default function AdminUsuarios() {
    const { usuariosAdmin } = useApp();
    const [busqueda, setBusqueda] = useState("");
    const [usuariosBackend, setUsuariosBackend] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [errorConexion, setErrorConexion] = useState(false);
    const [modalUsuario, setModalUsuario] = useState(null);
    const [modalTipo, setModalTipo] = useState(null);

    // Traer usuarios reales del backend
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setCargando(false); return; }

        fetch("http://localhost:4002/usuarios", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setUsuariosBackend(data);
                setErrorConexion(false);
            })
            .catch(() => setErrorConexion(true))
            .finally(() => setCargando(false));
    }, []);

    // Combinar usuarios del backend con los del context (registrados en esta sesión)
    const lista = [
        ...usuariosBackend.map((u) => ({
            nombre: u.email.split("@")[0],
            email: u.email,
            miembro: u.roles?.some(r => r.nombre === "ROLE_ADMIN") ? "ADMINISTRADOR" : "MEMBER",
            acceso: "Registrado",
            pedidos: [],
        })),
        ...usuariosAdmin.filter(u => !usuariosBackend.find(ub => ub.email === u.email)),
    ];

    const filtrados = lista.filter(
        (u) => u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.email?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModal = (u, tipo) => { setModalUsuario(u); setModalTipo(tipo); };
    const cerrarModal = () => { setModalUsuario(null); setModalTipo(null); };

    return (
        <div className="admin-usuarios">
            <AdminNav />
            <div className="admin-usuarios-inner">
                <div className="admin-usuarios-header">
                    <div>
                        <h1>Gestión de Usuarios</h1>
                        <p>Administre el acceso, roles y perfiles de la distinguida clientela y el personal administrativo de AUREA.</p>
                    </div>
                    <div className="admin-pedidos-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input placeholder="Buscar por nombre o rol..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    </div>
                </div>

                {/* Mensaje de error de conexión */}
                {errorConexion && (
                    <div style={{
                        background: "#fde8e8", border: "1px solid #f5c6c6",
                        padding: "1rem 1.5rem", marginBottom: "1.5rem",
                        fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", color: "#c44"
                    }}>
                        ⚠ No se pudo conectar con el servidor. Mostrando datos locales.
                    </div>
                )}

                <div className="admin-usuarios-stats">
                    <div className="admin-usuarios-stat">
                        <p className="admin-usuarios-stat-label">TOTAL MIEMBROS</p>
                        <p className="admin-usuarios-stat-val">{cargando ? "..." : lista.length}</p>
                        <p className="admin-usuarios-stat-sub" style={{ color: "#8b6914" }}>↗ Registrados</p>
                    </div>
                    <div className="admin-usuarios-stat">
                        <p className="admin-usuarios-stat-label">ELITE STATUS</p>
                        <p className="admin-usuarios-stat-val">{lista.filter(u => u.miembro === "ELITE MEMBER").length}</p>
                        <p className="admin-usuarios-stat-sub">ACTIVOS AHORA</p>
                    </div>
                    <div className="admin-usuarios-stat">
                        <p className="admin-usuarios-stat-label">SOLICITUDES PENDIENTES</p>
                        <p className="admin-usuarios-stat-val rojo">{lista.length}</p>
                        <button className="admin-btn-primary" style={{ marginTop: "0.5rem", padding: "6px 16px", fontSize: "12px" }}>REVISAR</button>
                    </div>
                </div>

                {/* Renderizado condicional mientras carga */}
                {cargando ? (
                    <div className="admin-empty">
                        <p>Cargando usuarios...</p>
                    </div>
                ) : filtrados.length === 0 ? (
                    <div className="admin-empty">
                        <p>No hay usuarios registrados todavía.</p>
                    </div>
                ) : (
                    <div className="admin-tabla">
                        <div className="admin-tabla-header" style={{ gridTemplateColumns: "1fr 140px 200px 150px" }}>
                            <span>USUARIO</span><span>ROL</span><span>ÚLTIMO ACCESO</span><span>ACCIONES</span>
                        </div>
                        {filtrados.map((u) => (
                            <div key={u.email} className="admin-tabla-row" style={{ gridTemplateColumns: "1fr 140px 200px 150px" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div className="admin-usuario-avatar">{u.nombre?.charAt(0)}{u.nombre?.split(" ")[1]?.charAt(0) || ""}</div>
                                    <div>
                                        <p style={{ fontWeight: 500, fontSize: "16px" }}>{u.nombre}</p>
                                        <p style={{ fontSize: "13px", color: "#8a8580" }}>{u.email}</p>
                                    </div>
                                </span>
                                <span>
                                    <span className={`admin-rol-badge${u.miembro === "ELITE MEMBER" ? " elite" : ""}`}>
                                        {u.miembro === "ELITE MEMBER" ? "ELITE" : "MEMBER"}
                                    </span>
                                </span>
                                <span style={{ fontSize: "14px", color: "#5a5550" }}>{u.acceso || "Ahora mismo"}</span>
                                <span style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <button className="admin-accion-btn" title="Editar usuario" onClick={() => abrirModal(u, "editar")}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                    </button>
                                    <button className="admin-accion-btn" title="Ver historial de pedidos" onClick={() => abrirModal(u, "historial")}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    </button>
                                    <button className="admin-accion-btn rojo" title="Suspender usuario" onClick={() => abrirModal(u, "suspender")}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                    </button>
                                </span>
                            </div>
                        ))}
                        <div className="admin-tabla-footer">
                            <span>MOSTRANDO {filtrados.length} DE {lista.length} USUARIOS</span>
                            <div className="admin-paginacion">
                                <button className="active">1</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {modalUsuario && (
                <div className="admin-modal-overlay" onClick={cerrarModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>
                                {modalTipo === "editar" && `Editar: ${modalUsuario.nombre}`}
                                {modalTipo === "historial" && `Historial: ${modalUsuario.nombre}`}
                                {modalTipo === "suspender" && `Suspender: ${modalUsuario.nombre}`}
                            </h2>
                            <button onClick={cerrarModal}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            {modalTipo === "editar" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                                    <div><p className="admin-modal-label">NOMBRE</p><p style={{ fontSize: "16px" }}>{modalUsuario.nombre}</p></div>
                                    <div><p className="admin-modal-label">EMAIL</p><p style={{ fontSize: "16px" }}>{modalUsuario.email}</p></div>
                                    <div><p className="admin-modal-label">ROL</p>
                                        <select style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", border: "1px solid #e0dbd0", padding: "6px 12px", background: "#fff" }} defaultValue={modalUsuario.miembro}>
                                            <option>MEMBER</option>
                                            <option>ELITE MEMBER</option>
                                        </select>
                                    </div>
                                    <button className="admin-btn-primary" onClick={cerrarModal}>GUARDAR CAMBIOS</button>
                                </div>
                            )}
                            {modalTipo === "historial" && (
                                <div>
                                    <p style={{ color: "#8a8580", fontSize: "14px", marginBottom: "1rem" }}>Pedidos realizados por este usuario:</p>
                                    {(modalUsuario.pedidos?.length > 0) ? modalUsuario.pedidos.map((p, i) => (
                                        <div key={i} className="admin-modal-prod">
                                            <div>
                                                <p style={{ fontWeight: 500 }}>{p.producto || p.id}</p>
                                                <p style={{ fontSize: "13px", color: "#8a8580" }}>{p.fecha} · ${p.precio?.toLocaleString("es-AR")}</p>
                                            </div>
                                        </div>
                                    )) : <p style={{ color: "#aaa" }}>Sin pedidos registrados.</p>}
                                </div>
                            )}
                            {modalTipo === "suspender" && (
                                <div style={{ textAlign: "center", padding: "1rem 0" }}>
                                    <p style={{ fontSize: "16px", marginBottom: "1.5rem", color: "#5a5550" }}>¿Estás seguro que querés suspender a <strong>{modalUsuario.nombre}</strong>? Esta acción es reversible.</p>
                                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                        <button className="admin-btn-primary" style={{ background: "#c44" }} onClick={cerrarModal}>SUSPENDER</button>
                                        <button className="admin-btn-primary" style={{ background: "#888" }} onClick={cerrarModal}>CANCELAR</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}