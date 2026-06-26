import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductos } from "../redux/productoSlice";
import { categorias } from "../data/productos"; 
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Productos.css";

export default function Productos({ categoria }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const { items: todosProd, loading, error } = useSelector((state) => state.productos); //extraccion del catalogo desde redux
    const info = categorias[categoria];
    const subcatInicial = location.state?.subcategoria || null;
    const [subcat, setSubcat] = useState(subcatInicial);
    const [materiales, setMateriales] = useState([]);
    const [orden, setOrden] = useState("relevancia");

    useEffect(() => { //peticion al back para traer los productos
        dispatch(fetchProductos());
    }, [dispatch]);

    const prodsCat = todosProd.filter((p) => p.categoria === categoria); //filtro de productos por categoria en redux
    const maxPrecioReal = prodsCat.length > 0 ? Math.max(...prodsCat.map((p) => p.precio)) : 0;
    const [precioMax, setPrecioMax] = useState(maxPrecioReal);

    useEffect(() => {
        setSubcat(subcatInicial); 
        setMateriales([]);          
        setOrden("relevancia");     
        setPrecioMax(maxPrecioReal); 
    }, [categoria, maxPrecioReal, subcatInicial]);

    const filtrados = useMemo(() => {
        let lista = prodsCat;
        if (subcat) lista = lista.filter((p) => p.subcategoria === subcat);
        if (materiales.length) lista = lista.filter((p) => materiales.includes(p.material));
        lista = lista.filter((p) => p.precio <= precioMax);
        if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
        if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
        return lista;
    }, [subcat, materiales, precioMax, orden, prodsCat]); 

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
                                disabled={loading}
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
                            <p>Productos encontrados: <strong>{loading ? "..." : filtrados.length}</strong></p>
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="productos-orden"
                                disabled={loading}
                            >
                                <option value="relevancia">ORDENAR POR: RELEVANCIA</option>
                                <option value="precio-asc">PRECIO: MENOR A MAYOR</option>
                                <option value="precio-desc">PRECIO: MAYOR A MENOR</option>
                            </select>
                        </div>

                        {loading && (       // manejo de estados de redux
                            <div className="productos-empty">
                                <p>Cargando catálogo desde el servidor...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="productos-empty">
                                <p style={{ color: "red" }}>Error de conexión: {error}</p>
                            </div>
                        )}

                        {!loading && !error && filtrados.length === 0 ? (
                            <div className="productos-empty">
                                <p>No hay productos con esos filtros.</p>
                            </div>
                        ) : (
                            !loading && !error && (
                                <div className="productos-grid">
                                    {filtrados.map((p) => (
                                        <ProductCard key={p.id} producto={p} />
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}