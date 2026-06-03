import { useState } from "react";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import "./VenderLingote.css";

const lingotesMercado = [
    {
        id: 101, nombre: "Lingote Oro 1oz — Johnsons Matthey",
        precio: 2350, vendedor: "Roberto M.", calificacion: 4.8, ventas: 12,
        imagen: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&q=80",
        material: "Oro 24k", peso: "31.1g", cert: "LBMA", estado: "Excelente",
    },
    {
        id: 102, nombre: "Lingote Plata 500g — PAMP Suisse",
        precio: 480, vendedor: "Ana G.", calificacion: 5.0, ventas: 3,
        imagen: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80",
        material: "Plata 999", peso: "500g", cert: "AUREA", estado: "Muy bueno",
    },
    {
        id: 103, nombre: "Lingote Oro 5oz — Credit Suisse",
        precio: 11800, vendedor: "Carlos D.", calificacion: 4.6, ventas: 7,
        imagen: "https://images.unsplash.com/photo-1624365169198-38255ba54160?w=600&q=80",
        material: "Oro 24k", peso: "155.5g", cert: "LBMA", estado: "Excelente",
    },
];

export default function VenderLingote() {
    const { usuario, agregarAlCarrito } = useApp();
    const [tab, setTab] = useState("mercado");
    const [form, setForm] = useState({ nombre: "", peso: "", pureza: "", cert: "", precio: "", descripcion: "" });
    const [publicado, setPublicado] = useState(false);
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handlePublicar = (e) => {
        e.preventDefault();
        if (!usuario) { alert("Debés iniciar sesión para vender."); return; }
        setPublicado(true);
    };

    return (
        <div className="vender-page">
            <div className="vender-inner">
                <div className="vender-header">
                    <div>
                        <p className="vender-label">MERCADO DE LINGOTES</p>
                        <h1>Comprá y Vendé Lingotes</h1>
                        <p className="vender-desc">Solo lingotes certificados. Cada publicación es verificada por AUREA antes de aparecer en el mercado.</p>
                    </div>
                </div>

                {/* TABS */}
                <div className="vender-tabs">
                    <button className={`vender-tab${tab === "mercado" ? " active" : ""}`} onClick={() => setTab("mercado")}>
                        🛒 Comprar
                    </button>
                    <button className={`vender-tab${tab === "vender" ? " active" : ""}`} onClick={() => setTab("vender")}>
                        💰 Publicar mi lingote
                    </button>
                </div>

                {/* MERCADO */}
                {tab === "mercado" && (
                    <div className="vender-mercado">
                        <p className="vender-mercado-count">{lingotesMercado.length} lingotes disponibles de vendedores verificados</p>
                        <div className="vender-grid">
                            {lingotesMercado.map((l) => (
                                <div key={l.id} className="vender-card">
                                    <div className="vender-card-img">
                                        <img src={l.imagen} alt={l.nombre} />
                                        <span className="vender-card-cert">{l.cert}</span>
                                    </div>
                                    <div className="vender-card-info">
                                        <p className="vender-card-nombre">{l.nombre}</p>
                                        <div className="vender-card-vendedor">
                                            <div className="vender-avatar">{l.vendedor[0]}</div>
                                            <div>
                                                <p>{l.vendedor}</p>
                                                <p className="vender-rating">{"★".repeat(Math.floor(l.calificacion))} {l.calificacion} · {l.ventas} ventas</p>
                                            </div>
                                        </div>
                                        <div className="vender-card-specs">
                                            <span>{l.material}</span>
                                            <span>{l.peso}</span>
                                            <span>{l.estado}</span>
                                        </div>
                                        <div className="vender-card-footer">
                                            <p className="vender-card-precio">${l.precio.toLocaleString("es-AR")}</p>
                                            <button className="vender-card-btn" onClick={() => agregarAlCarrito({ ...l, categoria: "lingotes", subcategoria: "Lingotes", imagenes: [l.imagen] })}>
                                                Agregar al carrito
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FORMULARIO VENTA */}
                {tab === "vender" && (
                    <div className="vender-form-section">
                        {!usuario && (
                            <div className="vender-login-aviso">
                                <p>Necesitás <a href="/login">iniciar sesión</a> para publicar tu lingote.</p>
                            </div>
                        )}

                        {publicado ? (
                            <div className="vender-exito">
                                <p className="vender-exito-icon">✓</p>
                                <h2>¡Lingote publicado!</h2>
                                <p>Tu lingote está en revisión. AUREA lo verificará y aparecerá en el mercado en 24-48hs.</p>
                                <button className="vender-btn" onClick={() => { setPublicado(false); setForm({ nombre: "", peso: "", pureza: "", cert: "", precio: "", descripcion: "" }); }}>
                                    Publicar otro
                                </button>
                            </div>
                        ) : (
                            <form className="vender-form" onSubmit={handlePublicar}>
                                <h2>Publicar mi lingote</h2>
                                <p className="vender-form-desc">Solo podés vender lingotes certificados. AUREA verificará los datos antes de publicar tu anuncio.</p>

                                <div className="vender-form-row">
                                    <div className="vender-field">
                                        <label>NOMBRE / MARCA DEL LINGOTE</label>
                                        <input placeholder="Ej: Lingote Oro 1oz — PAMP Suisse" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
                                    </div>
                                    <div className="vender-field">
                                        <label>PESO</label>
                                        <input placeholder="Ej: 31.1g / 1oz" value={form.peso} onChange={(e) => set("peso", e.target.value)} required />
                                    </div>
                                </div>

                                <div className="vender-form-row">
                                    <div className="vender-field">
                                        <label>PUREZA</label>
                                        <select value={form.pureza} onChange={(e) => set("pureza", e.target.value)} required>
                                            <option value="">Seleccionar...</option>
                                            <option>Oro 999.9 (24k)</option>
                                            <option>Oro 999 (24k)</option>
                                            <option>Plata 999</option>
                                            <option>Plata 925</option>
                                        </select>
                                    </div>
                                    <div className="vender-field">
                                        <label>CERTIFICACIÓN</label>
                                        <select value={form.cert} onChange={(e) => set("cert", e.target.value)} required>
                                            <option value="">Seleccionar...</option>
                                            <option>LBMA</option>
                                            <option>AUREA</option>
                                            <option>Swiss Assay</option>
                                            <option>Otro</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="vender-field">
                                    <label>PRECIO DE VENTA (ARS)</label>
                                    <input type="number" placeholder="Ej: 2400" value={form.precio} onChange={(e) => set("precio", e.target.value)} required />
                                </div>

                                <div className="vender-field">
                                    <label>DESCRIPCIÓN Y ESTADO</label>
                                    <textarea placeholder="Describí el estado, origen, y cualquier detalle relevante del lingote..." rows={4} value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} required />
                                </div>

                                <div className="vender-aviso">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    <p>AUREA cobra una comisión del 3% sobre ventas completadas. El lingote debe presentarse físicamente para verificación antes del envío.</p>
                                </div>

                                <button type="submit" className="vender-btn">PUBLICAR LINGOTE</button>
                            </form>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
