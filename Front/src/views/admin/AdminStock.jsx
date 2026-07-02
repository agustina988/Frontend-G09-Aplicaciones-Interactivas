import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { editarStockProductoAPI, eliminarProductoAPI } from "../../services/api";
import AdminNav from "./AdminNav";
import "./AdminStock.css";

const CATEGORIAS_FILTRO = ["Todas las Categorías", "Joyería", "Relojes", "Lingotes", "Edición Limitada"];

export default function AdminStock() {
    const { productosStock, editarStock, eliminarStock } = useApp();
    const [tab, setTab] = useState("stock");
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas las Categorías");
    const [modalEliminar, setModalEliminar] = useState(null);

    const filtrados = productosStock.filter((p) => {
        const coincideBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCat = categoriaFiltro === "Todas las Categorías" || p.categoria === categoriaFiltro;
        return coincideBusq && coincideCat;
    });

    const handleEditarStock = async (id, nuevoStock) => {
        const stockFinal = Math.max(0, nuevoStock);
        editarStock(id, stockFinal);

        if (!localStorage.getItem("token")) return;

        try {
            await editarStockProductoAPI(id, stockFinal);
        } catch (err) {
            console.error("Error actualizando stock:", err);
        }
    };

    const handleEliminarStock = async (id) => {
        eliminarStock(id);
        setModalEliminar(null);
        if (!localStorage.getItem("token")) return;
        try {
            await eliminarProductoAPI(id);
        } catch (err) {
            console.error("Error eliminando producto en backend:", err);
        }
    };

    return (
        <div className="admin-stock">
            <AdminNav />
            <div className="admin-stock-inner">
                <div className="admin-stock-header">
                    <h1>Gestión de Stock</h1>
                    <p>Control de inventario y organización de colecciones exclusivas.</p>
                </div>

                <div className="admin-stock-tabs">
                    <button className={`admin-stock-tab${tab === "stock" ? " active" : ""}`} onClick={() => setTab("stock")}>
                        STOCK DE PRODUCTOS
                    </button>
                    <button className={`admin-stock-tab${tab === "cats" ? " active" : ""}`} onClick={() => setTab("cats")}>
                        GESTIÓN DE CATEGORÍAS
                    </button>
                </div>

                {tab === "stock" && (
                    <>
                        <div className="admin-stock-filtros">
                            <div className="admin-stock-search">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                </svg>
                                <input
                                    placeholder="Buscar producto o SKU..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <select
                                className="admin-stock-select"
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                            >
                                {CATEGORIAS_FILTRO.map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <button className="admin-btn-primary">EXPORTAR PDF</button>
                        </div>

                        <div className="admin-stock-tabla">
                            <div className="admin-stock-tabla-header">
                                <span>PRODUCTO</span>
                                <span>CATEGORÍA</span>
                                <span>PRECIO</span>
                                <span>STOCK</span>
                                <span>ACCIONES</span>
                            </div>

                            {filtrados.length === 0 ? (
                                <div className="admin-stock-empty">
                                    No se encontraron productos con esos filtros.
                                </div>
                            ) : filtrados.map((p) => (
                                <div key={p.id} className={`admin-stock-row${p.stock === 0 ? " sin-stock" : ""}`}>
                                    <span className="admin-stock-prod">
                                        <img src={p.imagen} alt={p.nombre} style={{ filter: p.stock === 0 ? "grayscale(1)" : "none" }} />
                                        <span>
                                            {p.nombre}
                                            {p.stock === 0 && <span className="admin-stock-badge-agotado">SIN STOCK</span>}
                                        </span>
                                    </span>
                                    <span className="admin-stock-cat">{p.categoria}</span>
                                    <span className="admin-stock-precio">${p.precio?.toLocaleString("es-AR")}</span>
                                    <span className="admin-stock-qty">
                                        <button onClick={() => handleEditarStock(p.id, p.stock - 1)}>-</button>
                                        <span style={{ color: p.stock === 0 ? "#c44" : p.stock < 3 ? "#e67e22" : "inherit", fontWeight: p.stock === 0 ? 700 : 400 }}>{p.stock}</span>
                                        <button onClick={() => handleEditarStock(p.id, p.stock + 1)}>+</button>
                                    </span>
                                    <span className="admin-stock-acciones">
                                        <button className="admin-accion-btn" title="Editar producto">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                            </svg>
                                        </button>
                                        <button className="admin-accion-btn rojo" title="Eliminar producto" onClick={() => setModalEliminar(p)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {tab === "cats" && (
                    <div className="admin-stock-cats-redirect">
                        <p>Para gestionar categorías, accedé al módulo dedicado.</p>
                        <a href="/admin/categorias" className="admin-btn-primary" style={{ display: "inline-block", padding: "12px 24px", textDecoration: "none", marginTop: "1rem" }}>
                            IR A GESTIÓN DE CATEGORÍAS
                        </a>
                    </div>
                )}
            </div>

            {modalEliminar && (
                <div className="admin-modal-overlay" onClick={() => setModalEliminar(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Eliminar producto</h2>
                            <button onClick={() => setModalEliminar(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body" style={{ textAlign: "center", padding: "2rem" }}>
                            <p style={{ fontSize: "16px", marginBottom: "1.5rem", color: "#5a5550", fontFamily: "'Cormorant Garamond', serif" }}>
                                ¿Eliminás <strong>{modalEliminar.nombre}</strong> del inventario?
                            </p>
                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                <button className="admin-btn-primary" style={{ background: "#c44" }}
                                        onClick={() => handleEliminarStock(modalEliminar.id)}>
                                    ELIMINAR
                                </button>
                                <button className="admin-btn-primary" style={{ background: "#888" }} onClick={() => setModalEliminar(null)}>
                                    CANCELAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}