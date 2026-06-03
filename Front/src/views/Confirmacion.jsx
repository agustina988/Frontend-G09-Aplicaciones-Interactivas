import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import "./Confirmacion.css";

export default function Confirmacion() {
    const { carrito, subtotal, usuario } = useApp();
    const navigate = useNavigate();

    const hoy = new Date();
    const fechaStr = hoy.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
    const entregaMin = new Date(hoy); entregaMin.setDate(hoy.getDate() + 10);
    const entregaMax = new Date(hoy); entregaMax.setDate(hoy.getDate() + 19);
    const entregaStr = `${entregaMin.getDate()} — ${entregaMax.getDate()} de ${entregaMax.toLocaleDateString("es-AR", { month: "long" })}`;

    const pedidoNum = "#" + Math.floor(1000 + Math.random() * 9000);
    const primer = carrito[0];

    return (
        <div className="confirmacion-page">
            <div className="confirmacion-inner">

                {/* CABECERA */}
                <div className="confirmacion-header">
                    <div className="confirmacion-check">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <h1>Adquisición Confirmada</h1>
                    <p>Gracias por elegirnos. Su pedido ha sido procesado exitosamente y ya se encuentra en preparación en nuestro atelier central. Muy pronto estará en camino hacia usted.</p>
                </div>

                {/* META */}
                <div className="confirmacion-meta">
                    <div className="confirmacion-meta-item">
                        <p className="confirmacion-meta-label">NÚMERO DE PEDIDO</p>
                        <p className="confirmacion-meta-val">{pedidoNum}</p>
                    </div>
                    <div className="confirmacion-meta-item">
                        <p className="confirmacion-meta-label">FECHA</p>
                        <p className="confirmacion-meta-val">{fechaStr}</p>
                    </div>
                    <div className="confirmacion-meta-item">
                        <p className="confirmacion-meta-label">ENTREGA ESTIMADA</p>
                        <p className="confirmacion-meta-val confirmacion-entrega">{entregaStr}</p>
                    </div>
                </div>

                {/* DETALLE */}
                <div className="confirmacion-detalle">
                    {/* PRODUCTO */}
                    <div className="confirmacion-producto-card">
                        {primer && (
                            <>
                                <img src={primer.imagenes?.[0] || primer.imagen} alt={primer.nombre} />
                                <div className="confirmacion-prod-info">
                                    {primer.badge && <span className="confirmacion-prod-badge">{primer.badge}</span>}
                                    <h2>{primer.nombre}</h2>
                                    <p>{primer.descripcion}</p>
                                    <div className="confirmacion-prod-footer">
                                        <span className="confirmacion-prod-precio">${primer.precio.toLocaleString("es-AR")}</span>
                                        <span className="confirmacion-prod-qty">CANTIDAD: 0{primer.cantidad || 1}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* GARANTÍA */}
                        <div className="confirmacion-garantia">
                            <p className="confirmacion-garantia-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                GARANTÍA AUREA
                            </p>
                            <h3>Excelencia y Origen Ético</h3>
                            <p>Cada pieza adquirida en AUREA cuenta con un certificado de autenticidad digital inmutable. Nos comprometemos con el abastecimiento ético y la sostenibilidad de los materiales preciosos utilizados por nuestros artesanos.</p>
                            <p className="confirmacion-garantia-footer">✦ GARANTÍA INTERNACIONAL DE 5 AÑOS</p>
                        </div>
                    </div>

                    {/* ENVÍO */}
                    <div className="confirmacion-envio-card">
                        <div className="confirmacion-envio-dir">
                            <p className="confirmacion-envio-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="1.8">
                                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4M8 21V8"/>
                                </svg>
                                DIRECCIÓN DE ENVÍO
                            </p>
                            <p className="confirmacion-envio-nombre">{usuario?.nombre || "Cliente AUREA"}</p>
                            <p className="confirmacion-envio-addr" style={{ whiteSpace: "pre-line" }}>
                                {usuario?.direccion || "Dirección registrada en el pedido"}
                            </p>
                            {usuario?.telefono && <p>{usuario.telefono}</p>}
                        </div>
                        <div className="confirmacion-envio-metodo">
                            <p className="confirmacion-envio-label">MÉTODO DE ENVÍO</p>
                            <p style={{ fontWeight: 600 }}>Entrega Prioritaria AUREA</p>
                            <p>Incluye seguro de transporte premium y embalaje de seguridad.</p>
                        </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="confirmacion-acciones">
                        <button className="confirmacion-btn-seguir" onClick={() => navigate("/joyeria")}>
                            SEGUIR COMPRANDO
                        </button>
                        <p className="confirmacion-asistencia">
                            ¿Necesita asistencia inmediata?{" "}
                            <a href="#">Contacte con su Asesor Personal</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
