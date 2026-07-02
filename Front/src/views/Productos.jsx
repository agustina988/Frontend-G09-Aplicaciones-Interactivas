import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Productos.css";

// Metadata de filtros por categoría (título; subcategorías quedan deshabilitadas
// hasta que el backend las modele — hoy `Categoria` no tiene ese concepto).
const categorias = {
    joyeria: {
        titulo: "Joyería",
        subcategorias: [],
        materiales: ["Oro 18k", "Oro Blanco", "Platino", "Plata 925"],
    },
    relojes: {
        titulo: "Relojería",
        subcategorias: [],
        materiales: ["Acero", "Oro 18k", "Titanio"],
    },
    lingotes: {
        titulo: "Lingotes",
        subcategorias: [],
        materiales: ["Oro 999.9", "Plata 999"],
    },
    "edicion-limitada": {
        titulo: "Edición Limitada",
        subcategorias: [],
        materiales: ["Oro 18k", "Platino"],
    },
};

export default function Productos({ categoria }) {
    console.log(categoria)
    const location = useLocation();
    const info = categorias[categoria];
    const subcatInicial = location.state?.subcategoria || null;
    const { productosBackend, productosStock } = useApp();
console.log(info)
    console.log(productosBackend, 'mati')
    console.log(productosStock, 'guada')

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
                imagenes: p.imagenUrl ? [p.imagenUrl] : [],
                imagen: p.imagenUrl || null,
                badge: null,
                exclusivo: false,
                descripcion: p.descripcion || "",
                specs: { categoria: p.categoriaNombre || info?.titulo || categoria },
                esencia: "",
                caracteristicas: [],
            };
        });

        console.log('todos', todosLosProdsCat)

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
                    <span>{info.titulo}</span>
                </div>

                <h1 className="productos-title">{info.titulo}</h1>

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