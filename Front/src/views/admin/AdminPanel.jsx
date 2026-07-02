import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import "./AdminPanel.css";

const stats = [
    { label: "VENTAS TOTALES (MES)", valor: "$ 1.200.000", sub: "+12.5% del mes anterior" },
    { label: "USUARIOS ACTIVOS", valor: "4.800", sub: "+3.2% crecimiento" },
    { label: "PEDIDOS PENDIENTES", valor: "24", sub: "PRIORIDAD ALTA", alerta: true },
];

const gestion = [
    { titulo: "Gestión de Productos", desc: "Administre el catálogo de alta joyería, cargue imágenes de alta resolución y especificaciones de gemas preciosas.", link: "/admin/stock", cta: "ACCEDER AL INVENTARIO", icon: "💎" },
    { titulo: "Gestión de Pedidos", desc: "Supervise el estado de las transacciones y la logística de entrega de piezas exclusivas.", link: "/admin/pedidos", cta: "VER PEDIDOS →", icon: "✦" },
    { titulo: "Gestión de Usuarios", desc: "Administre perfiles de clientes VIP y el historial de adquisiciones.", link: "/admin/usuarios", cta: "VER CLIENTES", icon: "👤" },
    { titulo: "Gestión de Stock", desc: "Control riguroso de metales preciosos y disponibilidad de colecciones limitadas.", link: "/admin/stock", cta: "● Actualizado hace 15 min", icon: "📦" },
    { titulo: "Categorías", desc: "Organice el universo AUREA en familias: Anillos, Relojes, Lingotes y Edición limitada.", link: "/admin/categorias", cta: "GESTIONAR", icon: "⚙" },
    { titulo: "Gestión de Cupones", desc: "Cree y administre promociones exclusivas para clientes.", link: "/admin/cupones", cta: "GESTIONAR CUPONES", icon: "🏷" },
];

export default function AdminPanel() {
    const navigate = useNavigate();
    return (
        <div className="admin-panel">
            <AdminNav />
            <div className="admin-panel-inner">
                <div className="admin-panel-header">
                    <div>
                        <h1>Panel de Administración</h1>
                        <p>Bienvenido a la consola central de AUREA. Supervise el rendimiento de la tienda, gestione el inventario de piezas únicas y coordine las solicitudes de alta joyería.</p>
                    </div>
                </div>

                <div className="admin-stats-grid">
                    {stats.map((s) => (
                        <div key={s.label} className="admin-stat-card">
                            <p className="admin-stat-label">{s.label}</p>
                            <p className="admin-stat-valor">{s.valor}</p>
                            {s.alerta ? <span className="admin-stat-alerta">{s.sub}</span> : <p className="admin-stat-sub">{s.sub}</p>}
                        </div>
                    ))}
                </div>

                <h2 className="admin-section-title">Gestión de la tienda</h2>
                <div className="admin-gestion-grid">
                    {gestion.map((g) => (
                        <div key={g.titulo} className="admin-gestion-card" onClick={() => navigate(g.link)}>
                            <div className="admin-gestion-top"><span className="admin-gestion-icon">{g.icon}</span></div>
                            <h3>{g.titulo}</h3>
                            <p>{g.desc}</p>
                            {g.cta && <span className="admin-gestion-cta">{g.cta}</span>}
                        </div>
                    ))}
                </div>

                <div className="admin-banner">
                    <div>
                        <h3>Excelencia en cada detalle.</h3>
                        <p>Nuestra plataforma administrativa refleja el compromiso de AUREA con la precisión y el lujo discreto.</p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=80" alt="Reloj" />
                </div>
            </div>
        </div>
    );
}
