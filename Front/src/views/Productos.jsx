import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Productos.css";

// Nada hardcodeado acá: el nombre de la categoría se toma del propio backend
// (cada producto ya trae categoriaNombre). El slug de la URL solo se usa como
// fallback de texto mientras todavía no cargó ningún producto de esa categoría.

export default function Productos({ categoria }) {
    const location = useLocation();
    const subcatInicial = location.state?.subcategoria || null;
    const { productosBackend, productosStock, cargandoProductos } = useApp();

    const [subcat, setSubcat] = useState(subcatInicial);
    const [materiales, setMateriales] = useState([]);
    const [orden, setOrden] = useState("relevancia");

    // Productos de esta categoría, filtrando por el slug real que devuelve el backend
    const todosLosProdsCat = productosBackend
        .filter((p) => p.categoriaSlug === categoria)
        .map((p) => {
            const enStock = productosStock.find((s) => s.id === p.id);
            return {
                id: p.id,
                nombre: p.nombre,
                precio: enStock?.precio ?? p.precio,
                categoria,
                subcategoria: p.subcategoria || "",
                material: p.materiales?.[0] || "—",
                imagenes: p.imagenes?.length ? p.imagenes : (p.imagenUrl ? [p.imagenUrl] : []),
                imagen: p.imagenUrl || null,
                badge: p.badge || null,
                exclusivo: !!p.badge,
                descripcion: p.descripcion || "",
                specs: {
                    ...(p.composicionMaterial ? { material: p.composicionMaterial } : {}),
                    ...(p.peso ? { peso: p.peso } : {}),
                    ...(p.certificacion ? { certificacion: p.certificacion } : {}),
                    categoria: p.categoriaNombre || categoria,
                },
                esencia: p.esencia || "",
                caracteristicas: p.caracteristicas || [],
            };
        });

    // Título de la categoría: tomado del propio backend (categoriaNombre de
    // cualquier producto de esta categoría), no hardcodeado en el front.
    const titulo = todosLosProdsCat[0]?.specs?.categoria || categoria;

    // Subcategorías y materiales reales, derivados de los productos de esta categoría
    const subcategoriasDisponibles = [...new Set(
        todosLosProdsCat.map((p) => p.subcategoria).filter(Boolean)
    )];
    const materialesDisponibles = [...new Set(
        todosLosProdsCat.flatMap((p) => p.material !== "—" ? [p.material] : [])
    )];

    const maxPrecioReal = todosLosProdsCat.length > 0
        ? Math.max(...todosLosProdsCat.map((p) => p.precio))
        : 0;

    const [precioMax, setPrecioMax] = useState(maxPrecioReal);

    useEffect(() => {
        setSubcat(subcatInicial);
        setMateriales([]);
        setOrden("relevancia");
        setPrecioMax(maxPrecioReal);
    }, [categoria, maxPrecioReal, subcatInicial]);

    const filtrados = useMemo(() => {
        let lista = todosLosProdsCat;
        if (subcat) lista = lista.filter((p) => p.subcategoria === subcat);
        if (materiales.length) lista = lista.filter((p) => materiales.includes(p.material));
        lista = lista.filter((p) => p.precio <= precioMax);
        if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
        if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
        return lista;
    }, [subcat, materiales, precioMax, orden, categoria, todosLosProdsCat.length]);

    const toggleMaterial = (mat) => {
        setMateriales((prev) =>
            prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
        );
    };

    return (
        <div className="productos-page">
            <div className="productos-inner">
                <div className="productos-breadcrumb">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <span>{titulo}</span>
                </div>

                <h1 className="productos-title">{titulo}</h1>

                <div className="productos-layout">
                    <aside className="productos-sidebar">
                        <div className="sidebar-section">
                            <p className="sidebar-label">CATEGORÍAS</p>
                            <button
                                className={`sidebar-cat-btn${!subcat ? " active" : ""}`}
                                onClick={() => setSubcat(null)}
                            >
                                Todas
                            </button>
                            {subcategoriasDisponibles.map((s) => (
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
                            {materialesDisponibles.map((m) => (
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
                                max={maxPrecioReal || 1}
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

                        {cargandoProductos ? (
                            <div className="productos-empty">
                                <p>Cargando productos...</p>
                            </div>
                        ) : filtrados.length === 0 ? (
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