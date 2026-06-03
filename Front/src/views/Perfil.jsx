import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import "./Perfil.css";

export default function Perfil() {
    const { usuario, logout } = useApp();
    const navigate = useNavigate();

    if (!usuario) {
        navigate("/login");
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="perfil-page">
            <div className="perfil-inner">
                {/* HEADER */}
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        {usuario.avatar
                            ? <img src={usuario.avatar} alt={usuario.nombre} />
                            : <span>{usuario.nombre.charAt(0)}</span>
                        }
                        <button className="perfil-avatar-edit" aria-label="Editar foto">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="perfil-header-info">
                        <p className="perfil-label">MI PERFIL</p>
                        <h1>{usuario.nombre}</h1>
                        <div className="perfil-badges">
                            <span className="perfil-badge-member">{usuario.miembro}</span>
                            <span className="perfil-badge-since">• DESDE {usuario.desde}</span>
                        </div>
                    </div>
                </div>

                {/* BODY */}
                <div className="perfil-body">
                    {/* DATOS PERSONALES */}
                    <div className="perfil-col">
                        <h2>Detalles Personales</h2>
                        <div className="perfil-data-list">
                            <div className="perfil-data-item">
                                <p className="perfil-data-label">EMAIL</p>
                                <p className="perfil-data-val">{usuario.email}</p>
                            </div>
                            {usuario.telefono && (
                                <div className="perfil-data-item">
                                    <p className="perfil-data-label">TELÉFONO</p>
                                    <p className="perfil-data-val">{usuario.telefono}</p>
                                </div>
                            )}
                            {usuario.direccion && (
                                <div className="perfil-data-item">
                                    <p className="perfil-data-label">DIRECCIÓN PRINCIPAL</p>
                                    <p className="perfil-data-val" style={{ whiteSpace: "pre-line" }}>{usuario.direccion}</p>
                                </div>
                            )}
                        </div>
                        <button className="perfil-logout-btn" onClick={handleLogout}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            CERRAR SESIÓN
                        </button>
                    </div>

                    {/* PEDIDOS */}
                    <div className="perfil-col">
                        <div className="perfil-pedidos-header">
                            <h2>Historial de Pedidos</h2>
                            <button className="perfil-ver-todo">VER TODO</button>
                        </div>

                        {usuario.pedidos && usuario.pedidos.length > 0 ? (
                            <div className="perfil-pedidos-list">
                                {usuario.pedidos.map((p) => (
                                    <div key={p.id} className="perfil-pedido">
                                        <div className="perfil-pedido-img">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.5">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                            </svg>
                                        </div>
                                        <div className="perfil-pedido-info">
                                            <div className="perfil-pedido-top">
                                                <span className="perfil-pedido-id">{p.id}</span>
                                                <div className="perfil-pedido-fecha-estado">
                                                    <span className="perfil-pedido-fecha">{p.fecha}</span>
                                                    <span className={`perfil-pedido-estado ${p.estado === "EN CAMINO" ? "en-camino" : ""}`}>
                            • {p.estado}
                          </span>
                                                </div>
                                            </div>
                                            <p className="perfil-pedido-nombre">{p.producto}</p>
                                            <div className="perfil-pedido-bottom">
                        <span className="perfil-pedido-precio">
                          ${p.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </span>
                                                <button className="perfil-pedido-detalle">Detalles del pedido</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="perfil-no-pedidos">
                                <p>Todavía no realizaste ningún pedido.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
