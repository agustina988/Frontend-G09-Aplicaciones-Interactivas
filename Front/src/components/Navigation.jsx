import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navigation.css";

export default function Navigation() {
    const { usuario, logout, totalCarrito, favoritos, esAdmin, productosStock } = useApp();
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState([]);
    const [buscadorAbierto, setBuscadorAbierto] = useState(false);
    const inputRef = useRef(null);
    const dropRef = useRef(null);

    const handleBusqueda = (val) => {
        setBusqueda(val);
        if (val.trim().length < 2) { setResultados([]); return; }
        const found = productosStock.filter((p) =>
            p.nombre.toLowerCase().includes(val.toLowerCase()) ||
            p.categoria?.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 6);
        setResultados(found);
    };

    const irAProducto = (id) => {
        setBusqueda("");
        setResultados([]);
        setBuscadorAbierto(false);
        navigate(`/producto/${id}`);
    };

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setResultados([]);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="nav-header">
            {/* Barra de admin cuando está viendo la tienda */}
            {esAdmin && (
                <div className="nav-admin-bar">
                    <span>Estás viendo la tienda como administrador</span>
                    <Link to="/admin" className="nav-admin-bar-btn">
                        ← Volver al panel
                    </Link>
                </div>
            )}

            <nav className="nav-inner">
                <div className="nav-links">
                    <Link to="/joyeria">Joyería</Link>
                    <Link to="/relojes">Relojes</Link>
                    <Link to="/lingotes">Lingotes</Link>
                    <Link to="/edicion-limitada" className="nav-link-destacado">Edición limitada</Link>
                </div>

                <Link to="/" className="nav-logo">AUREA</Link>

                <div className="nav-actions">
                    <div className="nav-search-wrap" ref={dropRef}>
                        <div className="nav-search">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Buscar un producto..."
                                value={busqueda}
                                onChange={(e) => handleBusqueda(e.target.value)}
                                onFocus={() => setBuscadorAbierto(true)}
                            />
                            <button aria-label="Buscar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                </svg>
                            </button>
                        </div>
                        {resultados.length > 0 && (
                            <div className="nav-search-dropdown">
                                {resultados.map((p) => (
                                    <button key={p.id} className="nav-search-item" onClick={() => irAProducto(p.id)}>
                                        <img src={p.imagen} alt={p.nombre} />
                                        <div>
                                            <p className="nav-search-nombre">{p.nombre}</p>
                                            <p className="nav-search-cat">{p.categoria}</p>
                                        </div>
                                        <p className="nav-search-precio">${p.precio.toLocaleString("es-AR")}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                        {busqueda.trim().length >= 2 && resultados.length === 0 && (
                            <div className="nav-search-dropdown nav-search-empty">
                                No se encontraron productos para "{busqueda}"
                            </div>
                        )}
                    </div>

                    <Link to="/favoritos" className="nav-icon-btn" aria-label="Favoritos">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {favoritos.length > 0 && <span className="nav-badge">{favoritos.length}</span>}
                    </Link>

                    <Link to="/carrito" className="nav-icon-btn" aria-label="Carrito">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        {totalCarrito > 0 && <span className="nav-badge">{totalCarrito}</span>}
                    </Link>

                    {usuario ? (
                        <Link to="/perfil" className="nav-icon-btn nav-icon-logueado" aria-label="Mi perfil" title={`Hola, ${usuario.nombre}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </Link>
                    ) : (
                        <Link to="/login" className="nav-icon-btn" aria-label="Iniciar sesión">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}