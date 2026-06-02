import { useApp } from "../context/AppContext";
import "./ProductCard.css";

export default function ProductCard({ producto }) {
    const { agregarAlCarrito, toggleFavorito, esFavorito } = useApp();
    const fav = esFavorito(producto.id);

    return (
        <div className="product-card">
            <div className="product-card-img-wrap">
                <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                {producto.badge && <span className="product-badge">{producto.badge}</span>}
                <button
                    className={`product-fav-btn${fav ? " active" : ""}`}
                    onClick={() => toggleFavorito(producto)}
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
                <button className="product-card-btn" onClick={() => agregarAlCarrito(producto)}>
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
}
