import { useState } from "react";
import { useApp } from "../../context/AppContext";
import AdminNav from "./AdminNav";
import "./AdminPedidos.css";

const estadoColor = { PENDIENTE: "pendiente", ENVIADO: "enviado", ENTREGADO: "entregado" };
const estadosSig = { PENDIENTE: "ENVIADO", ENVIADO: "ENTREGADO", ENTREGADO: "ENTREGADO" };

export default function AdminPedidos() {
    const { pedidosAdmin, setPedidosAdmin } = useApp();
    const [busqueda, setBusqueda] = useState("");
    const [pedidoDetalle, setPedidoDetalle] = useState(null);

    const cambiarEstado = (id) => {
        setPedidosAdmin((prev) => prev.map((p) => p.id === id ? { ...p, estado: estadosSig[p.estado] } : p));
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
                    <button className="admin-btn-outline">≡ FILTRAR</button>
                </div>

                <div className="admin-pedidos-stats">
                    {[
                        { label: "Pedidos Hoy", valor: filtrados.filter(p => p.estado === "PENDIENTE").length || 0 },
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

                {filtrados.length === 0 ? (
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
                                <span className="admin-tabla-id">{p.id}</span>
                                <span>
                  <p style={{ fontWeight: 500 }}>{p.cliente}</p>
                  <p style={{ fontSize: "12px", color: "#8a8580" }}>{p.email}</p>
                </span>
                                <span>{p.fecha}</span>
                                <span style={{ fontWeight: 600 }}>${p.total?.toLocaleString("es-AR")}</span>
                                <span>
                  <span className={`admin-estado ${estadoColor[p.estado] || "pendiente"}`}>● {p.estado}</span>
                </span>
                                <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button className="admin-tabla-detalle" onClick={() => setPedidoDetalle(p)}>DETALLES ›</button>
                  <button className="admin-tabla-detalle" style={{ color: "#2a7a3a" }} onClick={() => cambiarEstado(p.id)}>
                    {estadosSig[p.estado] !== p.estado ? `→ ${estadosSig[p.estado]}` : "✓"}
                  </button>
                </span>
                            </div>
                        ))}
                        <div className="admin-tabla-footer">
                            <span>MOSTRANDO {filtrados.length} PEDIDOS</span>
                            <div className="admin-paginacion">
                                <button className="active">1</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DETALLE */}
            {pedidoDetalle && (
                <div className="admin-modal-overlay" onClick={() => setPedidoDetalle(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Detalle del Pedido {pedidoDetalle.id}</h2>
                            <button onClick={() => setPedidoDetalle(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-modal-row">
                                <div>
                                    <p className="admin-modal-label">CLIENTE</p>
                                    <p>{pedidoDetalle.cliente}</p>
                                    <p style={{ color: "#8a8580", fontSize: "13px" }}>{pedidoDetalle.email}</p>
                                </div>
                                <div>
                                    <p className="admin-modal-label">FECHA</p>
                                    <p>{pedidoDetalle.fecha}</p>
                                </div>
                                <div>
                                    <p className="admin-modal-label">ESTADO</p>
                                    <span className={`admin-estado ${estadoColor[pedidoDetalle.estado]}`}>● {pedidoDetalle.estado}</span>
                                </div>
                            </div>
                            <div style={{ marginTop: "1.5rem" }}>
                                <p className="admin-modal-label">PRODUCTOS</p>
                                {pedidoDetalle.productos?.map((prod, i) => (
                                    <div key={i} className="admin-modal-prod">
                                        <img src={prod.imagenes?.[0] || prod.imagen} alt={prod.nombre} />
                                        <div>
                                            <p style={{ fontWeight: 500 }}>{prod.nombre}</p>
                                            <p style={{ color: "#8a8580", fontSize: "13px" }}>Cantidad: {prod.cantidad} · ${prod.precio?.toLocaleString("es-AR")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {pedidoDetalle.direccion && (
                                <div style={{ marginTop: "1.5rem" }}>
                                    <p className="admin-modal-label">DIRECCIÓN</p>
                                    <p>{pedidoDetalle.direccion}</p>
                                    {pedidoDetalle.ciudad && <p>{pedidoDetalle.ciudad}</p>}
                                </div>
                            )}
                            <div className="admin-modal-total">
                                <span>TOTAL</span>
                                <span>${pedidoDetalle.total?.toLocaleString("es-AR")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
