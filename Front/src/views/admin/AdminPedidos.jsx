import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getPedidosAPI, cambiarEstadoPedidoAPI } from "../../services/api";
import AdminNav from "./AdminNav";
import "./AdminPedidos.css";

const estadosSig = { PENDIENTE: "ENVIADO", ENVIADO: "ENTREGADO", ENTREGADO: "ENTREGADO" };

export default function AdminPedidos() {
    const { pedidosAdmin, setPedidosAdmin } = useApp();
    const [busqueda, setBusqueda] = useState("");
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [errorConexion, setErrorConexion] = useState(false);

    // Cargar pedidos del backend
    useEffect(() => {
        if (!localStorage.getItem("token")) { setCargando(false); return; }

        getPedidosAPI()
            .then((data) => {
                setErrorConexion(false);
                setPedidosAdmin(data.map((p) => ({
                    id: `#${p.id}`,
                    idReal: p.id,
                    cliente: p.emailUsuario,
                    email: p.emailUsuario,
                    fecha: p.fechaPedido,
                    total: p.total,
                    estado: p.estado,
                    direccion: p.direccionEnvio,
                    productos: p.detalles?.map((d) => ({ id: d.idProducto, nombre: d.nombreProducto, precio: d.precioUnitario, cantidad: d.cantidad })) || [],
                })));
            })
            .catch(() => setErrorConexion(true))
            .finally(() => setCargando(false));
    }, []);

    const cambiarEstado = async (idReal, estadoActual) => {
        const nuevoEstado = estadosSig[estadoActual];
        if (nuevoEstado === estadoActual) return;

        try {
            await cambiarEstadoPedidoAPI(idReal, nuevoEstado);
            setPedidosAdmin((prev) => prev.map((p) => p.idReal === idReal ? { ...p, estado: nuevoEstado } : p));
        } catch (err) {
            console.error("Error actualizando estado:", err);
        }
    };

    const filtrados = pedidosAdmin.filter(
        (p) => p.cliente?.toLowerCase().includes(busqueda.toLowerCase()) || p.id?.includes(busqueda)
    );

    return (
        <div className="admin-pedidos">
            <AdminNav />
            <div className="admin-pedidos-inner">
                <div className="admin-pedidos-header">
                    <div>
                        <p className="admin-label">PANEL DE ADMINISTRACIÓN</p>
                        <h1>Gestión de Pedidos</h1>
                    </div>
                    <div className="admin-pedidos-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input placeholder="Buscar pedidos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                    </div>
                </div>

                {errorConexion && (
                    <div style={{ background: "#fde8e8", border: "1px solid #f5c6c6", padding: "1rem 1.5rem", marginBottom: "1.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", color: "#c44" }}>
                        ⚠ No se pudo conectar con el servidor. Verificá que el backend esté corriendo.
                    </div>
                )}

                <div className="admin-pedidos-stats">
                    {[
                        { label: "Total Pedidos", valor: filtrados.length },
                        { label: "Pendientes", valor: filtrados.filter(p => p.estado === "PENDIENTE").length, rojo: true },
                        { label: "En Camino", valor: filtrados.filter(p => p.estado === "ENVIADO").length },
                        { label: "Entregados", valor: filtrados.filter(p => p.estado === "ENTREGADO").length },
                    ].map((s) => (
                        <div key={s.label} className="admin-pedidos-stat">
                            <p>{s.label}</p>
                            <p className={`admin-pedidos-stat-val${s.rojo ? " rojo" : ""}`}>{s.valor}</p>
                        </div>
                    ))}
                </div>

                {cargando ? (
                    <div className="admin-empty"><p>Cargando pedidos del servidor...</p></div>
                ) : filtrados.length === 0 ? (
                    <div className="admin-empty">
                        <p>No hay pedidos todavía. Aparecerán aquí cuando los usuarios completen una compra.</p>
                    </div>
                ) : (
                    <div className="admin-tabla">
                        <div className="admin-tabla-header">
                            <span>ID PEDIDO</span><span>CLIENTE</span><span>FECHA</span><span>TOTAL</span><span>ESTADO</span><span>ACCIONES</span>
                        </div>
                        {filtrados.map((p) => (
                            <div key={p.id} className="admin-tabla-row">
                                <span style={{ fontWeight: 600, color: "#8b6914" }}>{p.id}</span>
                                <span style={{ fontSize: "14px" }}>{p.cliente}</span>
                                <span style={{ fontSize: "13px", color: "#8a8580" }}>{p.fecha}</span>
                                <span style={{ color: "#8b6914", fontWeight: 600 }}>${p.total?.toLocaleString("es-AR")}</span>
                                <span>
                                    <span className={`admin-estado-badge ${p.estado?.toLowerCase()}`}>{p.estado}</span>
                                </span>
                                <span style={{ display: "flex", gap: "8px" }}>
                                    <button className="admin-accion-btn" title="Ver detalle" onClick={() => setPedidoDetalle(p)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    </button>
                                    {p.estado !== "ENTREGADO" && (
                                        <button className="admin-accion-btn" title="Avanzar estado" onClick={() => cambiarEstado(p.idReal, p.estado)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                                        </button>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pedidoDetalle && (
                <div className="admin-modal-overlay" onClick={() => setPedidoDetalle(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Pedido {pedidoDetalle.id}</h2>
                            <button onClick={() => setPedidoDetalle(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <p style={{ fontSize: "13px", color: "#8a8580", marginBottom: "0.5rem" }}>Cliente: {pedidoDetalle.cliente}</p>
                            <p style={{ fontSize: "13px", color: "#8a8580", marginBottom: "0.5rem" }}>Fecha: {pedidoDetalle.fecha}</p>
                            <p style={{ fontSize: "13px", color: "#8a8580", marginBottom: "1rem" }}>Dirección: {pedidoDetalle.direccion || "—"}</p>
                            {pedidoDetalle.productos?.map((prod, i) => (
                                <div key={i} className="admin-modal-prod">
                                    <div>
                                        <p style={{ fontWeight: 500 }}>{prod.nombre}</p>
                                        <p style={{ fontSize: "13px", color: "#8a8580" }}>x{prod.cantidad} · ${prod.precio?.toLocaleString("es-AR")}</p>
                                    </div>
                                </div>
                            ))}
                            <p style={{ fontWeight: 600, color: "#8b6914", marginTop: "1rem", fontSize: "16px" }}>
                                Total: ${pedidoDetalle.total?.toLocaleString("es-AR")}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}