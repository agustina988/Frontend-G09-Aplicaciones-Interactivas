import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsuarios } from "../../features/usuarios/usuariosSlice";
import AdminNav from "./AdminNav";
import "./AdminUsuarios.css";

export default function AdminUsuarios() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const usuariosBackend = useSelector((state) => state.usuarios.items);
    const cargando = useSelector((state) => state.usuarios.loading);
    const cargadoUsuarios = useSelector((state) => state.usuarios.cargado);
    const errorConexion = useSelector((state) => state.usuarios.error);
    // Los pedidos ya los pide App.jsx una sola vez al loguearse como admin;
    // acá solo se leen del store, no se vuelven a gettear.
    const pedidosBackend = useSelector((state) => state.pedidos.adminList);
    const [busqueda, setBusqueda] = useState("");
    const [modalUsuario, setModalUsuario] = useState(null);
    const [modalTipo, setModalTipo] = useState(null);

    useEffect(() => {
        // Se pide una única vez: si ya está cargado, entrar y salir de esta
        // pestaña no vuelve a llamar al backend.
        if (token && !cargadoUsuarios) {
            dispatch(fetchUsuarios());
        }
    }, [token, cargadoUsuarios, dispatch]);

    const lista = usuariosBackend.map((u) => ({
        nombre: u.email.split("@")[0],
        email: u.email,
        miembro: u.roles?.some(r => r.nombre === "ROLE_ADMIN") ? "ADMINISTRADOR" : "MEMBER",
        acceso: "Registrado",
        pedidos: pedidosBackend
            .filter((p) => p.emailUsuario === u.email)
            .map((p) => ({
                id: `#${p.id}`,
                producto: `Pedido #${p.id} · ${p.estado}`,
                fecha: p.fechaPedido,
                precio: p.total,
            })),
    }));

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

                {errorConexion && (
                    <div style={{
                        background: "#fde8e8", border: "1px solid #f5c6c6",
                        padding: "1rem 1.5rem", marginBottom: "1.5rem",
                        fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", color: "#c44"
                    }}>
                        ⚠ No se pudo conectar con el servidor.
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
                </div>

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
                                    <button className="admin-accion-btn" title="Ver historial de pedidos" onClick={() => abrirModal(u, "historial")}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
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

            {modalUsuario && (
                <div className="admin-modal-overlay" onClick={cerrarModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>
                                {modalTipo === "historial" && `Historial: ${modalUsuario.nombre}`}
                            </h2>
                            <button onClick={cerrarModal}>✕</button>
                        </div>
                        <div className="admin-modal-body">
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}