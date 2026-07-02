import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import "./Home.css";

export default function Home() {
    const { productosBackend } = useApp();

    // Destacados: primeros 4 productos del catálogo (todo viene del backend, sin inventar nada acá)
    const destacados = productosBackend.slice(0, 4).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        categoria: p.categoriaSlug || "joyeria",
        subcategoria: p.subcategoria || "",
        material: p.materiales?.[0] || "—",
        imagenes: p.imagenes?.length ? p.imagenes : (p.imagenUrl ? [p.imagenUrl] : []),
        imagenUrl: p.imagenUrl || null,
        badge: p.badge || null,
        exclusivo: !!p.badge,
        descripcion: p.descripcion || "",
        specs: {
            ...(p.composicionMaterial ? { material: p.composicionMaterial } : {}),
            ...(p.peso ? { peso: p.peso } : {}),
            ...(p.certificacion ? { certificacion: p.certificacion } : {}),
            categoria: p.categoriaNombre || "",
        },
        esencia: p.esencia || "",
        caracteristicas: p.caracteristicas || [],
        esNuevo: false,
    }));

    return (
        <div className="home">
            {/* HERO */}
            <section className="home-hero">
                <div className="home-hero-overlay" />
                <div className="home-hero-content">
                    <h1>Invertí con elegancia<br />Descubrí el valor de<br /><span>AUREA</span></h1>
                    <p>Joyería exclusiva y lingotes certificados de oro y plata para quienes entienden que el lujo es la mejor inversión.</p>
                    <div className="home-hero-btns">
                        <Link to="/joyeria" className="btn-primary">Explorar colección</Link>
                        <Link to="/lingotes" className="btn-ghost">Ver lingotes</Link>
                    </div>
                </div>
            </section>

            {/* CATEGORÍAS */}
            <section className="home-cats">
                <h2>Explorá nuestras categorías</h2>
                <div className="home-cats-grid">
                    <Link to="/joyeria" state={{ subcategoria: "Anillos" }} className="home-cat-card home-cat-large">
                        <img src="src/assets/home/home_joyeria.jpg" alt="Anillos" />
                        <div className="home-cat-overlay">
                            <p className="home-cat-name">Anillos</p>
                            <p className="home-cat-sub">Comprar Colección</p>
                        </div>
                    </Link>
                    <Link to="/lingotes" state={{ subcategoria: "Lingotes de Oro" }} className="home-cat-card">
                        <img src="src/assets/home/home_lingotes.jpg" alt="Lingotes de Oro" />
                        <div className="home-cat-overlay">
                            <p className="home-cat-name">Lingotes de Oro</p>
                            <p className="home-cat-sub">Grado de Inversión</p>
                        </div>
                    </Link>
                    <Link to="/joyeria" state={{ subcategoria: "Collares" }} className="home-cat-card">
                        <img src="src/assets/home/home_collares.jpg" alt="Collares" />
                        <div className="home-cat-overlay">
                            <p className="home-cat-name">Collares</p>
                            <p className="home-cat-sub">Descubrí el Lujo</p>
                        </div>
                    </Link>
                    <Link to="/lingotes" state={{ subcategoria: "Lingotes de Plata" }} className="home-cat-card">
                        <img src="src/assets/home/home_lingotePlata.jpg" alt="Lingotes de Plata" />
                        <div className="home-cat-overlay">
                            <p className="home-cat-name">Lingotes de Plata</p>
                            <p className="home-cat-sub">Preservá tu Riqueza</p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* DESTACADOS */}
            <section className="home-featured">
                <div className="home-featured-header">
                    <div>
                        <p className="home-section-label">NOVEDADES</p>
                        <h2>Piezas destacadas</h2>
                    </div>
                    <Link to="/joyeria" className="home-ver-todo">VER TODO</Link>
                </div>
                <div className="home-products-grid">
                    {destacados.map((p) => <ProductCard key={p.id} producto={p} />)}
                </div>
            </section>

            {/* GARANTÍAS */}
            <section className="home-guarantees">
                <div className="home-guarantee">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4M8 21V8"/>
                    </svg>
                    <p className="home-guarantee-title">Envío</p>
                    <p>Envíos asegurados a todo el país mediante operadores logísticos de confianza.</p>
                </div>
                <div className="home-guarantee">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                    </svg>
                    <p className="home-guarantee-title">Devoluciones</p>
                    <p>Realizá cambios o devoluciones dentro de los 10 días posteriores a la compra.</p>
                </div>
                <div className="home-guarantee">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <p className="home-guarantee-title">Garantía de Autenticidad</p>
                    <p>Todas nuestras piezas incluyen certificación de autenticidad y control de calidad exclusivo AUREA.</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}