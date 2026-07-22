import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/Footer";
import "./DetalleProducto.css";
import Swal from "sweetalert2";
import { agregarAlCarrito } from "../features/carrito/carritoSlice";
import { toggleFavorito } from "../features/favoritos/favoritosSlice";

export default function DetalleProducto() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usuario = useSelector((state) => state.auth.usuario);
    const favoritos = useSelector((state) => state.favoritos.items);
    const productosBackend = useSelector((state) => state.productos.items);
    const [imgActiva, setImgActiva] = useState(0);

    const productoBackend = productosBackend.find((p) => p.id === Number(id));

    const producto = productoBackend ? {
        id: productoBackend.id,
        nombre: productoBackend.nombre,
        precio: productoBackend.precio,
        categoria: productoBackend.categoriaSlug || "joyeria",
        subcategoria: productoBackend.subcategoria || "",
        imagenes: productoBackend.imagenes?.length ? productoBackend.imagenes : (productoBackend.imagenUrl ? [productoBackend.imagenUrl] : []),
        imagenUrl: productoBackend.imagenUrl || null,
        badge: productoBackend.badge || null,
        descripcion: productoBackend.descripcion || "",
        specs: {
            ...(productoBackend.composicionMaterial ? { material: productoBackend.composicionMaterial } : {}),
            ...(productoBackend.peso ? { peso: productoBackend.peso } : {}),
            ...(productoBackend.certificacion ? { certificacion: productoBackend.certificacion } : {}),
            categoria: productoBackend.categoriaNombre || "",
        },
        esencia: productoBackend.esencia || "",
        caracteristicas: productoBackend.caracteristicas || [],
    } : null;

    if (!producto) {
        return (
            <div className="detalle-not-found">
                <p>Producto no encontrado.</p>
                <Link to="/">Volver al inicio</Link>
            </div>
        );
    }

    const stockActual = productoBackend?.stock ?? 0;
    const sinStock = stockActual === 0;

    let textoStock = "● Disponible";
    let claseStock = "detalle-disponible";
    if (sinStock) {
        textoStock = "● No disponible";
        claseStock = "detalle-disponible agotado";
    } else if (stockActual < 5) {
        textoStock = "● Últimas unidades";
        claseStock = "detalle-disponible ultimas";
    }

    const esAdmin = usuario?.rol === "ROLE_ADMIN";
    const fav = favoritos.some((p) => p.id === producto.id);
    const categoriaPath = producto.categoria;
    const categoriaLabel = {
        joyeria: "Joyería",
        relojes: "Relojes",
        lingotes: "Lingotes",
        "edicion-limitada": "Edición Limitada",
    }[categoriaPath] || "Productos";

    const handleFavoritoClick = (e) => {
        e.stopPropagation();
        if (!usuario) {
            Swal.fire({
                title: "Acceso Restringido",
                text: "Necesitas iniciar sesión para guardar tus favoritos.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#D4AF37",
                cancelButtonColor: "#333333",
                confirmButtonText: "Ir a Login",
                cancelButtonText: "Cancelar",
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) navigate("/login");
            });
        } else {
            dispatch(toggleFavorito(producto));
        }
    };

    const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : [];
    const imagenPrincipal = imagenes[imgActiva] || producto.imagenUrl || null;

    return (
        <div className="detalle-page">
            <div className="detalle-inner">
                <div className="detalle-breadcrumb">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <Link to={`/${categoriaPath}`}>{categoriaLabel}</Link>
                    <span> | </span>
                    <span>{producto.nombre}</span>
                </div>

                <div className="detalle-main">
                    <div className="detalle-galeria">
                        <div className={`detalle-img-principal${sinStock ? " detalle-img-agotado" : ""}`}>
                            {imagenPrincipal ? (
                                <img src={imagenPrincipal} alt={producto.nombre} />
                            ) : (
                                <div style={{ width: "100%", height: "100%", background: "#f5f2ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0bbb0" strokeWidth="1.2">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                </div>
                            )}
                            {sinStock && (
                                <div className="detalle-overlay-agotado">
                                    <span>NO DISPONIBLE</span>
                                </div>
                            )}
                            {imagenes.length > 1 && (
                                <>
                                    <button
                                        className="detalle-nav-btn detalle-nav-prev"
                                        onClick={() => setImgActiva((p) => (p === 0 ? imagenes.length - 1 : p - 1))}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                            <polyline points="15 18 9 12 15 6"/>
                                        </svg>
                                    </button>
                                    <button
                                        className="detalle-nav-btn detalle-nav-next"
                                        onClick={() => setImgActiva((p) => (p === imagenes.length - 1 ? 0 : p + 1))}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                            <polyline points="9 18 15 12 9 6"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        {imagenes.length > 1 && (
                            <div className="detalle-thumbs">
                                {imagenes.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`detalle-thumb${imgActiva === i ? " active" : ""}`}
                                        onClick={() => setImgActiva(i)}
                                    >
                                        <img src={img} alt={`Vista ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="detalle-info">
                        {producto.badge && <span className="detalle-badge">{producto.badge}</span>}
                        <div className={claseStock}>{textoStock}</div>

                        <h1>{producto.nombre}</h1>
                        <p className="detalle-subt">{(producto.specs?.categoria || categoriaLabel).toUpperCase()} PREMIUM</p>
                        <p className="detalle-precio">${producto.precio.toLocaleString("es-AR")}</p>

                        <p className="detalle-desc">{producto.descripcion}</p>

                        {producto.specs && Object.keys(producto.specs).length > 0 && (
                            <div className="detalle-specs">
                                {Object.entries(producto.specs).map(([k, v]) => (
                                    <div key={k} className="detalle-spec">
                                        <p className="detalle-spec-label">
                                            {k === "material" ? "MATERIAL" :
                                                k === "peso" ? "PESO" :
                                                    k === "certificacion" ? "CERTIFICACIÓN" :
                                                        k === "categoria" ? "CATEGORÍA" : k.toUpperCase()}
                                        </p>
                                        <p className="detalle-spec-val">{v}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="detalle-btns">
                            {esAdmin ? (
                                <button className="detalle-btn-carrito detalle-btn-nodisponible" disabled>
                                    No disponible para admins
                                </button>
                            ) : sinStock ? (
                                <button className="detalle-btn-carrito detalle-btn-nodisponible" disabled>
                                    NO DISPONIBLE
                                </button>
                            ) : (
                                <button
                                    className="detalle-btn-carrito"
                                    onClick={() => dispatch(agregarAlCarrito(producto))}
                                >
                                    AÑADIR AL CARRITO
                                </button>
                            )}
                            <button
                                className={`detalle-btn-fav${fav ? " active" : ""}`}
                                onClick={handleFavoritoClick}
                                aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="detalle-garantias">
                            <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4M8 21V8"/>
                                </svg>
                                ENVÍO DE CORTESÍA
                            </span>
                            <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                GARANTÍA POR UN AÑO
                            </span>
                        </div>
                    </div>
                </div>

                {(producto.esencia || producto.caracteristicas?.length > 0) && (
                    <div className="detalle-features">
                        <div className="detalle-features-left">
                            <h2>La Esencia de la Elegancia</h2>
                            <p>{producto.esencia}</p>
                        </div>
                        <div className="detalle-features-right">
                            {producto.caracteristicas?.map((c, i) => (
                                <div key={i} className="detalle-feature-item">
                                    <p className="detalle-feature-title" style={{ color: "#8b6914" }}>{c.titulo}</p>
                                    <p>{c.texto}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
