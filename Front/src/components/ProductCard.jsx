import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { agregarAlCarrito } from "../features/carrito/carritoSlice";
import { toggleFavorito } from "../features/favoritos/favoritosSlice";
import "./ProductCard.css";

export default function ProductCard({ producto }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usuario = useSelector((state) => state.auth.usuario);
    const favoritos = useSelector((state) => state.favoritos.items);
    const productos = useSelector((state) => state.productos.items);
    const esAdmin = usuario?.rol === "ROLE_ADMIN";
    const fav = favoritos.some((p) => p.id === producto.id);

    const imagen = producto.imagenes?.[0] || producto.imagenUrl || producto.imagen || null;

    const productoEnCatalogo = productos.find((p) => p.id === producto.id);
    const stockActual = productoEnCatalogo ? productoEnCatalogo.stock : (producto.stock ?? 1);
    const sinStock = stockActual === 0;

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

    return (
        <div className={`product-card${sinStock ? " product-card--agotado" : ""}`}>
            <div
                className="product-card-img-wrap"
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{ cursor: "pointer" }}
            >
                {imagen ? (
                    <img src={imagen} alt={producto.nombre} loading="lazy" />
                ) : (
                    <div className="product-card-sin-imagen">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c0bbb0" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                    </div>
                )}
                {producto.badge && <span className="product-badge">{producto.badge}</span>}
                {sinStock && (
                    <div className="product-card-overlay-agotado">
                        <span>NO DISPONIBLE</span>
                    </div>
                )}
                <button
                    className={`product-fav-btn${fav ? " active" : ""}`}
                    onClick={handleFavoritoClick}
                    aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
            <div className="product-card-info">
                <p className="product-card-name">{producto.nombre}</p>
                <p className="product-card-price">$ {producto.precio.toLocaleString("es-AR")}</p>
                {esAdmin ? (
                    <button className="product-card-btn product-card-btn--nodisponible" disabled>
                        No disponible para admins
                    </button>
                ) : sinStock ? (
                    <button className="product-card-btn product-card-btn--nodisponible" disabled>
                        NO DISPONIBLE
                    </button>
                ) : (
                    <button className="product-card-btn" onClick={() => dispatch(agregarAlCarrito(producto))}>
                        Agregar al carrito
                    </button>
                )}
            </div>
        </div>
    );
}
