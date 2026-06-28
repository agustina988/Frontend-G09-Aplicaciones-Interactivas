import { useState } from "react";
import { useApp } from "../../context/AppContext";
import AdminNav from "./AdminNav";
import "./AdminProductos.css";

const CATEGORIAS = ["Joyería", "Relojes", "Lingotes", "Edición Limitada"];

const TIPO_MAP = {
    "Joyería": "joyeria",
    "Relojes": "relojes",
    "Lingotes": "lingotes",
    "Edición Limitada": "edicion-limitada",
};

const FORM_VACIO = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "Joyería",
    tipo: "joyeria",
    imagenUrl: "",
};

export default function AdminProductos() {
    const { productosStock, setProductosStock, setProductosBackend } = useApp();
    const [form, setForm] = useState(FORM_VACIO);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [cargando, setCargando] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "imagenUrl") setImgError(false);
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
        setExito("");
    };

    const handleCategoriaChange = (e) => {
        const cat = e.target.value;
        setForm((prev) => ({ ...prev, categoria: cat, tipo: TIPO_MAP[cat] || "joyeria" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setExito("");

        if (!form.nombre || !form.descripcion || !form.precio || !form.stock) {
            setError("Completá todos los campos obligatorios.");
            return;
        }
        if (isNaN(form.precio) || Number(form.precio) <= 0) {
            setError("El precio debe ser un número mayor a 0.");
            return;
        }
        if (isNaN(form.stock) || Number(form.stock) < 0) {
            setError("El stock debe ser un número válido.");
            return;
        }

        setCargando(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:4002/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: form.nombre,
                    descripcion: form.descripcion,
                    precio: Number(form.precio),
                    stock: Number(form.stock),
                    tipo: form.tipo,
                    idCategoria: null,
                    idVendedor: null,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                setError(msg || `Error ${res.status} al crear el producto.`);
                return;
            }

            const productoCreado = await res.json();

            setProductosStock((prev) => [...prev, {
                id: productoCreado.id,
                nombre: productoCreado.nombre,
                categoria: form.categoria,
                precio: productoCreado.precio,
                stock: productoCreado.stock,
                imagen: form.imagenUrl || "/src/assets/placeholder.jpg",
            }]);

            // Agregar a productosBackend con la imagenUrl para que aparezca en Home y Productos
            setProductosBackend((prev) => [...prev, {
                id: productoCreado.id,
                nombre: productoCreado.nombre,
                descripcion: productoCreado.descripcion || form.descripcion,
                precio: productoCreado.precio,
                stock: productoCreado.stock,
                tipo: form.tipo,
                imagenUrl: form.imagenUrl || null,
            }]);

            setExito(`"${productoCreado.nombre}" creado correctamente en la base de datos.`);
            setForm(FORM_VACIO);
            setImgError(false);

        } catch (err) {
            setError("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
        } finally {
            setCargando(false);
        }
    };

    const imagenPreview = form.imagenUrl && !imgError ? form.imagenUrl : null;

    return (
        <div className="admin-productos">
            <AdminNav />
            <div className="admin-productos-inner">
                <div className="admin-stock-header">
                    <h1>Nuevo Producto</h1>
                    <p>Agregá un producto nuevo al catálogo de AUREA.</p>
                </div>

                <div className="admin-productos-grid">
                    {/* FORMULARIO */}
                    <div className="admin-productos-form-wrap">
                        <form onSubmit={handleSubmit} className="admin-productos-form">

                            <div className="admin-form-group">
                                <label>NOMBRE DEL PRODUCTO *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Collar Lumière"
                                    maxLength={100}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>DESCRIPCIÓN *</label>
                                <textarea
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción detallada del producto..."
                                    rows={4}
                                />
                            </div>

                            <div className="admin-form-row">
                                <div className="admin-form-group">
                                    <label>PRECIO (ARS) *</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={form.precio}
                                        onChange={handleChange}
                                        placeholder="Ej: 120000"
                                        min="0"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>STOCK INICIAL *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="Ej: 5"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>CATEGORÍA *</label>
                                <select
                                    name="categoria"
                                    value={form.categoria}
                                    onChange={handleCategoriaChange}
                                    className="admin-stock-select"
                                    style={{ width: "100%", padding: "10px 14px" }}
                                >
                                    {CATEGORIAS.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>URL DE IMAGEN (opcional)</label>
                                <div className="admin-form-url-wrap">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="1.8">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                    <input
                                        type="url"
                                        name="imagenUrl"
                                        value={form.imagenUrl}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>
                                {form.imagenUrl && imgError && (
                                    <span style={{ fontSize: "12px", color: "#c44" }}>
                                        La URL no es una imagen válida
                                    </span>
                                )}
                                {form.imagenUrl && !imgError && (
                                    <span style={{ fontSize: "12px", color: "#5a8a5a" }}>
                                        ✓ Imagen cargada en la vista previa
                                    </span>
                                )}
                            </div>

                            {error && (
                                <div className="admin-form-error">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {exito && (
                                <div className="admin-form-exito">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    {exito}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="admin-btn-primary"
                                style={{ width: "100%", padding: "14px", fontSize: "13px", marginTop: "0.5rem", opacity: cargando ? 0.7 : 1 }}
                                disabled={cargando}
                            >
                                {cargando ? "CREANDO PRODUCTO..." : "CREAR PRODUCTO"}
                            </button>
                        </form>
                    </div>

                    {/* PREVIEW */}
                    <div className="admin-productos-preview">
                        <p className="admin-preview-titulo">VISTA PREVIA</p>
                        <div className="admin-preview-card">
                            <div className="admin-preview-img">
                                {imagenPreview ? (
                                    <img
                                        src={imagenPreview}
                                        alt="preview"
                                        onError={() => setImgError(true)}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <span>Sin imagen</span>
                                )}
                            </div>
                            <div className="admin-preview-info">
                                <p className="admin-preview-nombre">{form.nombre || "Nombre del producto"}</p>
                                <p className="admin-preview-cat">{form.categoria}</p>
                                <p className="admin-preview-precio">
                                    {form.precio ? `$${Number(form.precio).toLocaleString("es-AR")}` : "$0"}
                                </p>
                                <p className="admin-preview-stock" style={{ color: !form.stock || form.stock === "0" ? "#c44" : "#5a8a5a" }}>
                                    {form.stock ? `Stock: ${form.stock}` : "Stock: —"}
                                </p>
                                <p className="admin-preview-desc">{form.descripcion || "Descripción del producto..."}</p>
                            </div>
                        </div>

                        <div className="admin-preview-recientes">
                            <p className="admin-preview-titulo" style={{ marginTop: "2rem" }}>ÚLTIMOS PRODUCTOS</p>
                            {productosStock.slice(-3).reverse().map((p) => (
                                <div key={p.id} className="admin-preview-reciente-row">
                                    <img src={p.imagen} alt={p.nombre} onError={(e) => { e.target.style.display = "none"; }} />
                                    <div>
                                        <p>{p.nombre}</p>
                                        <p style={{ color: "#8b6914", fontSize: "13px" }}>${p.precio?.toLocaleString("es-AR")}</p>
                                    </div>
                                    <span style={{ marginLeft: "auto", fontSize: "12px", color: p.stock === 0 ? "#c44" : "#5a8a5a" }}>
                                        Stock: {p.stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}