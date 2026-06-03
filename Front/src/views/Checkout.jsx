import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import "./Checkout.css";

export default function Checkout() {
    const { carrito, subtotal, usuario } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: usuario?.nombre || "",
        email: usuario?.email || "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        tarjeta: "",
        vencimiento: "",
        cvv: "",
    });

    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = () => {
        navigate("/confirmacion");
    };

    if (carrito.length === 0) {
        navigate("/carrito");
        return null;
    }

    const primer = carrito[0];

    return (
        <div className="checkout-page">
            <div className="checkout-inner">
                <h1 className="checkout-title">Finalizar Compra</h1>
                <p className="checkout-secure">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    TRANSACCIÓN SEGURA
                </p>

                {/* PASOS */}
                <div className="checkout-steps">
                    <span className="checkout-step active">PASO 1<br /><strong>ENVÍO</strong></span>
                    <span className="checkout-step">PASO 2<br /><strong>PAGO</strong></span>
                    <span className="checkout-step">PASO 3<br /><strong>CONFIRMAR</strong></span>
                </div>

                <div className="checkout-layout">
                    {/* FORMULARIO */}
                    <div className="checkout-form">
                        <h2>Datos de Envío</h2>

                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>NOMBRE COMPLETO</label>
                                <input placeholder="Ej. Julianne Moore" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} />
                            </div>
                            <div className="checkout-field">
                                <label>CORREO ELECTRÓNICO</label>
                                <input type="email" placeholder="julianne@aurea.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                            </div>
                        </div>

                        <div className="checkout-field full">
                            <label>DIRECCIÓN DE ENTREGA</label>
                            <input placeholder="Calle de la Elegancia 123, Suite 405" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} />
                        </div>

                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>CIUDAD</label>
                                <input placeholder="Lanús" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
                            </div>
                            <div className="checkout-field">
                                <label>CÓDIGO POSTAL</label>
                                <input placeholder="1822" value={form.codigoPostal} onChange={(e) => set("codigoPostal", e.target.value)} />
                            </div>
                        </div>

                        <h2 style={{ marginTop: "2.5rem" }}>Método de Pago</h2>

                        <div className="checkout-pago-tipo">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                            <span>Tarjeta de Crédito / Débito</span>
                            <span style={{ marginLeft: "auto", fontSize: "12px", color: "#8a8580" }}>Visa, Mastercard, American Express</span>
                            <div className="checkout-radio-active" />
                        </div>

                        <div className="checkout-field full">
                            <label>NÚMERO DE TARJETA</label>
                            <div className="checkout-input-icon">
                                <input placeholder="0000 0000 0000 0000" value={form.tarjeta} onChange={(e) => set("tarjeta", e.target.value)} maxLength={19} />
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                        </div>

                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>FECHA DE VENCIMIENTO</label>
                                <input placeholder="MM / AA" value={form.vencimiento} onChange={(e) => set("vencimiento", e.target.value)} />
                            </div>
                            <div className="checkout-field">
                                <label>CÓDIGO CVV</label>
                                <input placeholder="***" type="password" maxLength={4} value={form.cvv} onChange={(e) => set("cvv", e.target.value)} />
                            </div>
                        </div>

                        {/* COMPROMISO */}
                        <div className="checkout-compromiso">
                            <p className="checkout-compromiso-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                Compromiso Ético AUREA
                            </p>
                            <p>Cada pieza de nuestra colección AUREA Luxury Guild es el resultado de un proceso de trazabilidad riguroso. Garantizamos que todos nuestros diamantes y metales preciosos han sido obtenidos bajo los estándares más estrictos del Consejo de Joyería Responsable (RJC).</p>
                            <div className="checkout-sellos">
                                <span>RJC CERTIFIED</span>
                                <span>KIMBERLEY PROCESS</span>
                                <span>TRACEABLE ORIGIN</span>
                            </div>
                        </div>
                    </div>

                    {/* RESUMEN */}
                    <div className="checkout-resumen">
                        <p className="checkout-resumen-title">Resumen del Pedido</p>

                        {carrito.map((p) => (
                            <div key={p.id} className="checkout-resumen-item">
                                <img src={p.imagenes?.[0] || p.imagen} alt={p.nombre} />
                                <div>
                                    <p style={{ fontSize: "14px", color: "#8a8580", letterSpacing: "0.1em", fontSize: "11px" }}>{p.subcategoria?.toUpperCase()}</p>
                                    <p style={{ fontSize: "17px", color: "#2a2520", fontWeight: 500 }}>{p.nombre}</p>
                                    <p style={{ fontSize: "13px", color: "#8a8580" }}>Cantidad: {p.cantidad}</p>
                                </div>
                                <p style={{ fontSize: "17px", color: "#8b6914", fontWeight: 600, marginLeft: "auto" }}>
                                    ${(p.precio * p.cantidad).toLocaleString("es-AR")}
                                </p>
                            </div>
                        ))}

                        <div className="checkout-resumen-rows">
                            <div className="checkout-resumen-row"><span>Subtotal</span><span>${subtotal.toLocaleString("es-AR")}</span></div>
                            <div className="checkout-resumen-row"><span>Envío Premium (Asegurado)</span><span style={{ color: "#2a2520" }}>$0</span></div>
                            <div className="checkout-resumen-row"><span>Impuestos (IVA 21%)</span><span>$0</span></div>
                        </div>

                        <div className="checkout-total">
                            <span>TOTAL</span>
                            <span>${subtotal.toLocaleString("es-AR")}</span>
                        </div>

                        <button className="checkout-btn" onClick={handleSubmit}>
                            CONFIRMAR Y PAGAR →
                        </button>

                        <p className="checkout-garantia">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Garantía AUREA de Autenticidad
                        </p>

                        <div className="checkout-iconos">
                            <div className="checkout-icono">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="1.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="#8a8580"/>
                                </svg>
                                <span>ENCRYPTED</span>
                            </div>
                            <div className="checkout-icono">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                <span>GIA SECURE</span>
                            </div>
                            <div className="checkout-icono">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span>GIA CERTIFIED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
