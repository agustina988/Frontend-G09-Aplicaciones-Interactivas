import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Favoritos.css";

export default function Favoritos() {
    const { favoritos } = useApp();

    return (
        <div className="favoritos-page">
            <div className="favoritos-inner">
                <div className="favoritos-breadcrumb">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <span>Favoritos</span>
                </div>

                <h1 className="favoritos-title">Mis Favoritos</h1>

                {favoritos.length === 0 ? (
                    <div className="favoritos-empty">
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <p>Todavía no guardaste ninguna pieza.</p>
                        <Link to="/joyeria" className="favoritos-cta">Explorar colección</Link>
                    </div>
                ) : (
                    <>
                        <p className="favoritos-count">{favoritos.length} pieza{favoritos.length !== 1 ? "s" : ""} guardada{favoritos.length !== 1 ? "s" : ""}</p>
                        <div className="favoritos-grid">
                            {favoritos.map((p) => (
                                <ProductCard key={p.id} producto={p} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
