import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./AdminNav.css";

export default function AdminNav() {
    const { logout } = useApp();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const links = [
        { to: "/admin", label: "PANEL" },
        { to: "/admin/pedidos", label: "PEDIDOS" },
        { to: "/admin/usuarios", label: "USUARIOS" },
        { to: "/admin/categorias", label: "CATEGORÍAS" },
        { to: "/admin/stock", label: "STOCK" },
        { to: "/admin/productos", label: "NUEVO PRODUCTO" },
    ];

    return (
        <header className="admin-nav">
            <Link to="/admin" className="admin-nav-logo">AUREA</Link>
            <nav className="admin-nav-links">
                {links.map((l) => (
                    <Link key={l.to} to={l.to} className={`admin-nav-link${pathname === l.to ? " active" : ""}`}>
                        {l.label}
                    </Link>
                ))}
            </nav>
            <div className="admin-nav-right">
                <Link to="/" className="admin-nav-tienda">← Ver tienda</Link>
                <button className="admin-nav-logout" onClick={() => { logout(); navigate("/login"); }}>
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}