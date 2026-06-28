import { useState } from "react";
import { useApp } from "../../context/AppContext";
import AdminNav from "./AdminNav";
import "./AdminCategorias.css";

export default function AdminCategorias() {
    const { categoriasAdmin, agregarCategoria, eliminarCategoria, editarCategoria } = useApp();
    const [modal, setModal] = useState(null); // null | 'nueva' | { cat, tipo: 'editar' | 'eliminar' }
    const [form, setForm] = useState({ nombre: "", slug: "", desc: "", badge: "" });

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleNombre = (v) => {
        set("nombre", v);
        set("slug", v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    };

    const handleCrear = (e) => {
        e.preventDefault();
        if (!form.nombre) return;
        agregarCategoria({ nombre: form.nombre, slug: form.slug, desc: form.desc, badge: form.badge || null, productos: 0, publicado: true });
        setForm({ nombre: "", slug: "", desc: "", badge: "" });
        setModal(null);
    };

    const handleEditar = (e) => {
        e.preventDefault();
        editarCategoria(modal.cat.id, { nombre: form.nombre, desc: form.desc, badge: form.badge || null });
        setModal(null);
    };

    const abrirEditar = (cat) => {
        setForm({ nombre: cat.nombre, slug: cat.slug || "", desc: cat.desc || "", badge: cat.badge || "" });
        setModal({ cat, tipo: "editar" });
    };

    const abrirEliminar = (cat) => setModal({ cat, tipo: "eliminar" });

    return (
        <div className="admin-cats">
            <AdminNav />
            <div className="admin-cats-inner">
                <div className="admin-cats-header">
                    <div>
                        <p className="admin-cats-sup">Gestión de Inventario</p>
                        <h1>Gestión de Categorías</h1>
                        <p className="admin-cats-desc">Organice y refine la arquitectura de sus familias de piezas. Cada categoría representa un legado de excelencia y diseño artesanal.</p>
                    </div>
                    <button className="admin-btn-primary" onClick={() => { setForm({ nombre: "", slug: "", desc: "", badge: "" }); setModal("nueva"); }}>
                        + NUEVA CATEGORÍA
                    </button>
                </div>

                <div className="admin-cats-grid">
                    {categoriasAdmin.map((c, idx) => (
                        <div key={c.id} className={`admin-cat-card${idx === categoriasAdmin.length - 1 && idx % 2 === 0 ? " dark" : ""}`} style={idx === 3 ? { background: "#1e1c18", borderColor: "#3a3530", color: "#faf9f6" } : {}}>
                            {c.badge && <span className="admin-cat-badge">{c.badge}</span>}
                            <div className="admin-cat-actions">
                                <button className="admin-cat-btn-edit" title="Editar" onClick={() => abrirEditar(c)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </button>
                                <button className="admin-cat-btn-del" title="Eliminar" onClick={() => abrirEliminar(c)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                                </button>
                            </div>
                            <h3 style={idx === 3 ? { color: "#faf9f6" } : {}}>{c.nombre}</h3>
                            <p style={idx === 3 ? { color: "rgba(255,255,255,0.55)" } : {}}>{c.desc}</p>
                            <div className="admin-cat-footer">
                                {c.productos !== undefined && <><span className="admin-cat-meta-label">PRODUCTOS</span><span className="admin-cat-meta-val" style={idx === 3 ? { color: "#c9a84c" } : {}}>{c.productos}</span></>}
                                {c.valor && <><span className="admin-cat-meta-label">VALOR TOTAL</span><span className="admin-cat-meta-val">{c.valor}</span></>}
                                {c.stock !== undefined && <><span className="admin-cat-meta-label">STOCK ACTIVO</span><span className="admin-cat-meta-val">{c.stock}</span></>}
                                <span className={`admin-cat-estado${c.publicado ? " pub" : " no-pub"}`}>{c.publicado ? "PUBLICADO" : "BORRADOR"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL NUEVA / EDITAR */}
            {(modal === "nueva" || modal?.tipo === "editar") && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{modal === "nueva" ? "Nueva Categoría" : `Editar: ${modal.cat.nombre}`}</h2>
                            <button onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body">
                            <form onSubmit={modal === "nueva" ? handleCrear : handleEditar}>
                                <div className="admin-cats-field" style={{ marginBottom: "1.2rem" }}>
                                    <label>NOMBRE DE LA CATEGORÍA *</label>
                                    <input placeholder="Ej: Herencia Vintage" value={form.nombre} onChange={(e) => handleNombre(e.target.value)} required />
                                </div>
                                <div className="admin-cats-field" style={{ marginBottom: "1.2rem" }}>
                                    <label>SLUG DE URL</label>
                                    <input placeholder="herencia-vintage" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
                                </div>
                                <div className="admin-cats-field" style={{ marginBottom: "1.2rem" }}>
                                    <label>BADGE (opcional)</label>
                                    <input placeholder="Ej: GIA CERTIFIED" value={form.badge} onChange={(e) => set("badge", e.target.value)} />
                                </div>
                                <div className="admin-cats-field" style={{ marginBottom: "1.5rem" }}>
                                    <label>DESCRIPCIÓN CURATORIAL</label>
                                    <textarea placeholder="Describa la esencia de esta familia de productos..." rows={4} value={form.desc} onChange={(e) => set("desc", e.target.value)} />
                                </div>
                                <button type="submit" className="admin-btn-primary" style={{ width: "100%" }}>
                                    {modal === "nueva" ? "CREAR CATEGORÍA" : "GUARDAR CAMBIOS"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR */}
            {modal?.tipo === "eliminar" && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Eliminar categoría</h2>
                            <button onClick={() => setModal(null)}>✕</button>
                        </div>
                        <div className="admin-modal-body" style={{ textAlign: "center", padding: "2rem" }}>
                            <p style={{ fontSize: "16px", marginBottom: "1.5rem", color: "#5a5550" }}>¿Eliminás <strong>{modal.cat.nombre}</strong>? Esta acción no se puede deshacer.</p>
                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                                <button className="admin-btn-primary" style={{ background: "#c44" }} onClick={() => { eliminarCategoria(modal.cat.id); setModal(null); }}>ELIMINAR</button>
                                <button className="admin-btn-primary" style={{ background: "#888" }} onClick={() => setModal(null)}>CANCELAR</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
