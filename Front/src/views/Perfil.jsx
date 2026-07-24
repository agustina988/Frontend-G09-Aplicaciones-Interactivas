import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchPerfil } from "../features/auth/authSlice";
import { fetchMisPedidos } from "../features/pedidos/pedidosSlice";
import Footer from "../components/Footer";
import "./Perfil.css";

export default function Perfil() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const usuario = useSelector((state) => state.auth.usuario);
    const token = useSelector((state) => state.auth.token);
    const pedidosRaw = useSelector((state) => state.pedidos.misPedidos);
    const cargandoPedidos = useSelector((state) => state.pedidos.loading);
    const errorPedidos = useSelector((state) => state.pedidos.error);
    const cargadoMisPedidos = useSelector((state) => state.pedidos.cargadoMisPedidos);
    const perfilCargado = useSelector((state) => state.auth.perfilCargado);

    const pedidos = pedidosRaw.map((p) => ({
        id: `#${p.id}`,
        fecha: p.fechaPedido,
        estado: p.estado,
        precio: p.total,
        productos: p.detalles?.map((d) => ({ nombre: d.nombreProducto, cantidad: d.cantidad, precio: d.precioUnitario })) || [],
    }));

    useEffect(() => {
        if (!token) return;
        if (!cargadoMisPedidos) dispatch(fetchMisPedidos());
    }, [token, cargadoMisPedidos, dispatch]);

    // El perfil (nombre/teléfono/dirección) se trae una sola vez al loguearse;
    // si se edita, se actualiza local + PUT (ver actualizarPerfil), sin volver
    // a gettear cada vez que se entra a esta pantalla.
    useEffect(() => {
        if (token && !perfilCargado) dispatch(fetchPerfil());
    }, [token, perfilCargado, dispatch]);

    if (!usuario) { navigate("/login"); return null; }

    const handleLogout = () => { dispatch(logout()); navigate("/login"); };

    return (
        <div className="perfil-page">
            <div className="perfil-inner">
                <div className="perfil-header">
                    <div className="perfil-avatar-circle">
                        {usuario.avatar
                            ? <img src={usuario.avatar} alt={usuario.nombre} />
                            : <span>{usuario.nombre?.charAt(0)?.toUpperCase()}</span>
                        }
                    </div>
                    <div className="perfil-header-info">
                        <p className="perfil-label">MI PERFIL</p>
                        <h1>{usuario.nombre}</h1>
                        <div className="perfil-badges">
                            <span className="perfil-badge-member">{usuario.miembro || "MEMBER"}</span>
                            <span className="perfil-badge-since">• DESDE {usuario.desde}</span>
                        </div>
                    </div>
                </div>

                <div className="perfil-body">
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

                    <div className="perfil-col">
                        <div className="perfil-pedidos-header">
                            <h2>Historial de Pedidos</h2>
                        </div>

                        {errorPedidos && (
                            <p style={{ color: "#c44", fontSize: "14px", marginBottom: "1rem" }}>
                                ⚠ No se pudieron cargar los pedidos. Verificá la conexión.
                            </p>
                        )}

                        {cargandoPedidos ? (
                            <p style={{ color: "#8a8580", fontSize: "15px" }}>Cargando pedidos...</p>
                        ) : pedidos.length > 0 ? (
                            <div className="perfil-pedidos-list">
                                {pedidos.map((p, i) => (
                                    <div key={i} className="perfil-pedido">
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
                                                    <span className={`perfil-pedido-estado${p.estado === "ENVIADO" ? " en-camino" : ""}`}>• {p.estado}</span>
                                                </div>
                                            </div>
                                            {p.productos.map((prod, j) => (
                                                <p key={j} className="perfil-pedido-nombre" style={{ fontSize: "15px", marginBottom: "2px" }}>
                                                    {prod.nombre} <span style={{ color: "#8a8580", fontSize: "13px" }}>×{prod.cantidad}</span>
                                                </p>
                                            ))}
                                            <div className="perfil-pedido-bottom">
                                                <span className="perfil-pedido-precio">${p.precio?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</span>
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
