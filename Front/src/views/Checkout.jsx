import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Footer from "../components/Footer";
import "./Checkout.css";

export default function Checkout() {
    const { carrito, subtotal, total, cupon, descuentoCupon, aplicarCupon, quitarCupon, usuario } = useApp();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombre: usuario?.nombre || "", email: usuario?.email || "",
        direccion: "", ciudad: "", codigoPostal: "",
        tarjeta: "", vencimiento: "", cvv: "",
    });
    const [codigoCupon, setCodigoCupon] = useState("");
    const [errorCupon, setErrorCupon] = useState("");
    const [metodoPago, setMetodoPago] = useState("tarjeta"); // tarjeta | transferencia | efectivo
    const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const descuentoMetodo = metodoPago === "transferencia" ? Math.round(subtotal * 0.05) : 0;
    const totalFinal = total - descuentoMetodo;

    const handleCupon = () => {
        if (aplicarCupon(codigoCupon)) { setErrorCupon(""); }
        else setErrorCupon("Cupón inválido. Probá con AUREA10, AUREA20 o VIP30");
    };

    if (carrito.length === 0) { navigate("/carrito"); return null; }

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

                <div className="checkout-steps">
                    <span className="checkout-step active">PASO 1<br /><strong>ENVÍO</strong></span>
                    <span className="checkout-step">PASO 2<br /><strong>PAGO</strong></span>
                    <span className="checkout-step">PASO 3<br /><strong>CONFIRMAR</strong></span>
                </div>

                <div className="checkout-layout">
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

                        <h2 style={{ marginTop: "2rem" }}>Método de Pago</h2>
                        <div className="checkout-metodos">
                            {[
                                { val: "tarjeta", label: "Tarjeta de Crédito / Débito", desc: "Visa, Mastercard, American Express" },
                                { val: "transferencia", label: "Transferencia Bancaria", desc: "5% de descuento aplicado automáticamente" },
                                { val: "efectivo", label: "Efectivo / Mercado Pago", desc: "" },
                            ].map((m) => (
                                <div key={m.val} className={`checkout-metodo${metodoPago === m.val ? " active" : ""}`} onClick={() => setMetodoPago(m.val)}>
                                    <div className="checkout-metodo-radio" />
                                    <div>
                                        <p>{m.label}</p>
                                        {m.desc && <p style={{ fontSize: "12px", color: metodoPago === m.val && m.val === "transferencia" ? "#2a7a3a" : "#8a8580" }}>{m.desc}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {metodoPago === "tarjeta" && (
                            <>
                                <div className="checkout-field full" style={{ marginTop: "1rem" }}>
                                    <label>NÚMERO DE TARJETA</label>
                                    <input placeholder="0000 0000 0000 0000" value={form.tarjeta} onChange={(e) => set("tarjeta", e.target.value)} maxLength={19} />
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
                            </>
                        )}

                        {/* CUPÓN */}
                        <div className="checkout-cupon">
                            <p className="checkout-cupon-label">¿TENÉS UN CUPÓN DE DESCUENTO?</p>
                            <div className="checkout-cupon-row">
                                {cupon ? (
                                    <div className="checkout-cupon-aplicado">
                                        <span>✓ Cupón <strong>{cupon.codigo}</strong> aplicado — {cupon.descuento}% off</span>
                                        <button onClick={quitarCupon}>✕</button>
                                    </div>
                                ) : (
                                    <>
                                        <input placeholder="Ingresá tu código..." value={codigoCupon} onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())} />
                                        <button className="checkout-cupon-btn" onClick={handleCupon}>APLICAR</button>
                                    </>
                                )}
                            </div>
                            {errorCupon && <p className="checkout-cupon-error">{errorCupon}</p>}
                        </div>
                    </div>

                    {/* RESUMEN */}
                    <div className="checkout-resumen">
                        <p className="checkout-resumen-title">Resumen del Pedido</p>
                        {carrito.map((p) => (
                            <div key={p.id} className="checkout-resumen-item">
                                <img src={p.imagenes?.[0] || p.imagen} alt={p.nombre} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: "11px", color: "#8a8580", letterSpacing: "0.1em" }}>{p.subcategoria?.toUpperCase()}</p>
                                    <p style={{ fontSize: "17px", color: "#2a2520", fontWeight: 500 }}>{p.nombre}</p>
                                    <p style={{ fontSize: "13px", color: "#8a8580" }}>Cantidad: {p.cantidad}</p>
                                </div>
                                <p style={{ fontSize: "17px", color: "#8b6914", fontWeight: 600 }}>${(p.precio * p.cantidad).toLocaleString("es-AR")}</p>
                            </div>
                        ))}

                        <div className="checkout-resumen-rows">
                            <div className="checkout-resumen-row"><span>Subtotal</span><span>${subtotal.toLocaleString("es-AR")}</span></div>
                            {cupon && <div className="checkout-resumen-row descuento"><span>Cupón {cupon.codigo} ({cupon.descuento}%)</span><span>-${descuentoCupon.toLocaleString("es-AR")}</span></div>}
                            {descuentoMetodo > 0 && <div className="checkout-resumen-row descuento"><span>Descuento transferencia (5%)</span><span>-${descuentoMetodo.toLocaleString("es-AR")}</span></div>}
                            <div className="checkout-resumen-row"><span>Envío Premium</span><span style={{ color: "#2a2520" }}>$0</span></div>
                            <div className="checkout-resumen-row"><span>Impuestos</span><span>$0</span></div>
                        </div>

                        <div className="checkout-total">
                            <span>TOTAL</span>
                            <span>${totalFinal.toLocaleString("es-AR")}</span>
                        </div>

                        <button className="checkout-btn" onClick={() => navigate("/confirmacion")}>CONFIRMAR Y PAGAR →</button>

                        <p className="checkout-garantia">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Garantía AUREA de Autenticidad
                        </p>
                        <div className="checkout-iconos">
                            <div className="checkout-icono"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>ENCRYPTED</span></div>
                            <div className="checkout-icono"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8580" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>GIA SECURE</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
