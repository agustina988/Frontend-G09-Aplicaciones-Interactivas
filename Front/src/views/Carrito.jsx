import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import "./Carrito.css";

export default function Carrito() {
    const { carrito, quitarDelCarrito, cambiarCantidad, subtotal } = useApp();
    const navigate = useNavigate();

    return (
        <div className="carrito-page">
            <div className="carrito-inner">
                <h1 className="carrito-title">Tu Selección</h1>

                {carrito.length === 0 ? (
                    <div className="carrito-empty">
                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        <p>Tu carrito está vacío.</p>
                        <Link to="/joyeria" className="carrito-cta">Explorar colección</Link>
                    </div>
                ) : (
                    <div className="carrito-layout">
                        {/* ITEMS */}
                        <div className="carrito-items">
                            {carrito.map((p) => (
                                <div key={p.id} className="carrito-item">
                                    <img src={p.imagenes?.[0] || p.imagen} alt={p.nombre} className="carrito-item-img" />
                                    <div className="carrito-item-info">
                                        <p className="carrito-item-cat">{p.subcategoria?.toUpperCase()}</p>
                                        <p className="carrito-item-nombre">{p.nombre}</p>
                                        <div className="carrito-item-qty">
                                            <button onClick={() => cambiarCantidad(p.id, p.cantidad - 1)}>-</button>
                                            <span>{p.cantidad}</span>
                                            <button onClick={() => cambiarCantidad(p.id, p.cantidad + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="carrito-item-right">
                                        <p className="carrito-item-label">PRECIO UNITARIO</p>
                                        <p className="carrito-item-precio">$ {p.precio.toLocaleString("es-AR")}</p>
                                        <button className="carrito-item-del" onClick={() => quitarDelCarrito(p.id)} aria-label="Eliminar">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* COMPROMISO */}
                            <div className="carrito-compromiso">
                                <p className="carrito-compromiso-title">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    EL COMPROMISO AUREA
                                </p>
                                <p>Cada pieza de su selección cuenta con certificación manual de procedencia ética y excelencia mecánica. Nuestro maestro gremial inspecciona cada artículo antes de ser preparado en nuestro embalaje exclusivo con relieves dorados para su viaje hacia usted.</p>
                            </div>
                        </div>

                        {/* RESUMEN */}
                        <div className="carrito-resumen">
                            <p className="carrito-resumen-title">RESUMEN DEL PEDIDO</p>
                            <div className="carrito-resumen-row">
                                <span>Subtotal</span>
                                <span>$ {subtotal.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="carrito-resumen-row">
                                <span>Envío Estándar</span>
                                <span className="carrito-cortesia">CORTESÍA</span>
                            </div>
                            <div className="carrito-resumen-row">
                                <span>Impuestos</span>
                                <span>$ 0</span>
                            </div>
                            <div className="carrito-resumen-total">
                                <span>TOTAL</span>
                                <span>$ {subtotal.toLocaleString("es-AR")}</span>
                            </div>
                            <button className="carrito-btn-comprar" onClick={() => navigate("/checkout")}>
                                FINALIZAR COMPRA
                            </button>
                            <button className="carrito-btn-seguir" onClick={() => navigate("/joyeria")}>
                                CONTINUAR COMPRANDO
                            </button>
                            <div className="carrito-sellos">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  PAGO SEGURO GARANTIZADO
                </span>
                                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4"/>
                  </svg>
                  ENVÍO ASEGURADO A TODO EL PAÍS
                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
