import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { productos as todosProd, categorias } from "../data/productos";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Productos.css";

export default function Productos({ categoria }) {
    const info = categorias[categoria];
    const [subcat, setSubcat] = useState(null);
    const [materiales, setMateriales] = useState([]);
    const [precioMax, setPrecioMax] = useState(10000);
    const [orden, setOrden] = useState("relevancia");

    const prodsCat = todosProd.filter((p) => p.categoria === categoria);
    const maxPrecioReal = Math.max(...prodsCat.map((p) => p.precio));

    const filtrados = useMemo(() => {
        let lista = prodsCat;
        if (subcat) lista = lista.filter((p) => p.subcategoria === subcat);
        if (materiales.length) lista = lista.filter((p) => materiales.includes(p.material));
        lista = lista.filter((p) => p.precio <= precioMax);
        if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
        if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
        return lista;
    }, [subcat, materiales, precioMax, orden, categoria]);

    const toggleMaterial = (mat) => {
        setMateriales((prev) =>
            prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
        );
    };

    return (
        <div className="productos-page">
            <div className="productos-inner">
                {/* BREADCRUMB */}
                <div className="productos-breadcrumb">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <span>{info.titulo}</span>
                </div>

                <h1 className="productos-title">{info.titulo}</h1>

                <div className="productos-layout">
                    {/* SIDEBAR */}
                    <aside className="productos-sidebar">
                        <div className="sidebar-section">
                            <p className="sidebar-label">CATEGORÍAS</p>
                            <button
                                className={`sidebar-cat-btn${!subcat ? " active" : ""}`}
                                onClick={() => setSubcat(null)}
                            >
                                Todas
                            </button>
                            {info.subcategorias.map((s) => (
                                <button
                                    key={s}
                                    className={`sidebar-cat-btn${subcat === s ? " active" : ""}`}
                                    onClick={() => setSubcat(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="sidebar-section">
                            <p className="sidebar-label">MATERIAL</p>
                            {info.materiales.map((m) => (
                                <label key={m} className="sidebar-check">
                                    <input
                                        type="checkbox"
                                        checked={materiales.includes(m)}
                                        onChange={() => toggleMaterial(m)}
                                    />
                                    {m}
                                </label>
                            ))}
                        </div>

                        <div className="sidebar-section">
                            <p className="sidebar-label">RANGO DE PRECIO</p>
                            <input
                                type="range"
                                min={0}
                                max={maxPrecioReal}
                                value={precioMax}
                                onChange={(e) => setPrecioMax(Number(e.target.value))}
                                className="sidebar-range"
                            />
                            <div className="sidebar-range-labels">
                                <span>$0</span>
                                <span>${precioMax.toLocaleString("es-AR")}</span>
                            </div>
                        </div>

                        <div className="sidebar-garantia">
                            <p className="sidebar-garantia-title">GARANTÍA</p>
                            <p>Todos los lingotes y joyas van acompañados de certificaciones de autenticidad del GIA o AUREA.</p>
                        </div>
                    </aside>

                    {/* GRID */}
                    <div className="productos-main">
                        <div className="productos-top-bar">
                            <p>Productos encontrados: <strong>{filtrados.length}</strong></p>
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="productos-orden"
                            >
                                <option value="relevancia">ORDENAR POR: RELEVANCIA</option>
                                <option value="precio-asc">PRECIO: MENOR A MAYOR</option>
                                <option value="precio-desc">PRECIO: MAYOR A MENOR</option>
                            </select>
                        </div>

                        {filtrados.length === 0 ? (
                            <div className="productos-empty">
                                <p>No hay productos con esos filtros.</p>
                            </div>
                        ) : (
                            <div className="productos-grid">
                                {filtrados.map((p) => (
                                    <ProductCard key={p.id} producto={p} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
