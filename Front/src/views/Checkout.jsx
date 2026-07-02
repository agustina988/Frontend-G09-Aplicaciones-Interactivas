import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { validarCupon, quitarCuponAplicado } from "../features/cupones/cuponesSlice";
import Footer from "../components/Footer";
import "./Checkout.css";

function detectarTarjeta(numero) {
    const n = numero.replace(/\s/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "American Express";
    return null;
}

function formatearTarjeta(valor) {
    const solo = valor.replace(/\D/g, "");
    const grupos = solo.match(/.{1,4}/g) || [];
    return grupos.join(" ").slice(0, 19);
}

function formatearVencimiento(valor) {
    const solo = valor.replace(/\D/g, "").slice(0, 4);
    if (solo.length >= 3) return solo.slice(0, 2) + "/" + solo.slice(2);
    return solo;
}

function validarVencimiento(val) {
    const match = val.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return "Formato inválido (MM/AA)";
    const mes = parseInt(match[1]);
    const anio = parseInt("20" + match[2]);
    if (mes < 1 || mes > 12) return "El mes debe estar entre 01 y 12";
    if (anio < 2026) return "La tarjeta está vencida";
    return null;
}

export default function Checkout() {
    const dispatch = useDispatch();
    const carrito = useSelector((state) => state.carrito.items);
    const usuario = useSelector((state) => state.auth.usuario);
    const cupon = useSelector((state) => state.cupones.cuponAplicado);
    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const descuentoCupon = cupon ? Math.round(subtotal * cupon.descuento / 100) : 0;
    const total = subtotal - descuentoCupon;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: usuario?.nombre || "", email: usuario?.email || "",
        direccion: "", ciudad: "", codigoPostal: "",
        tarjeta: "", vencimiento: "", cvv: "",
    });
    const [errores, setErrores] = useState({});
    const [codigoCupon, setCodigoCupon] = useState("");
    const [errorCupon, setErrorCupon] = useState("");
    const [metodoPago, setMetodoPago] = useState("tarjeta");

    const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrores((p) => ({ ...p, [k]: "" })); };

    const tipoTarjeta = detectarTarjeta(form.tarjeta);
    const cvvMax = tipoTarjeta === "American Express" ? 4 : 3;
    const descuentoMetodo = metodoPago === "transferencia" ? Math.round(subtotal * 0.05) : 0;
    const totalFinal = total - descuentoMetodo;

    const handleCupon = async () => {
        const resultado = await dispatch(validarCupon(codigoCupon));
        if (validarCupon.fulfilled.match(resultado)) setErrorCupon("");
        else setErrorCupon(resultado.payload || "Cupón inválido o vencido.");
    };

    const validar = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = "Requerido";
        if (!form.email.trim() || !form.email.includes("@")) e.email = "Email inválido";
        if (!form.direccion.trim()) e.direccion = "Requerido";
        if (!form.ciudad.trim()) e.ciudad = "Requerido";
        if (!form.codigoPostal.trim()) e.codigoPostal = "Requerido";

        if (metodoPago === "tarjeta") {
            const numSolo = form.tarjeta.replace(/\s/g, "");
            if (numSolo.length < 15) e.tarjeta = "Número incompleto";
            const errVenc = validarVencimiento(form.vencimiento);
            if (errVenc) e.vencimiento = errVenc;
            if (form.cvv.length < cvvMax) e.cvv = `CVV debe tener ${cvvMax} dígitos`;
        }
        return e;
    };

    const handleSubmit = () => {
        const e = validar();
        if (Object.keys(e).length > 0) { setErrores(e); return; }
        navigate("/confirmacion");
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

                <div className="checkout-layout">
                    <div className="checkout-form">
                        {/* ENVÍO */}
                        <h2>Datos de Envío</h2>
                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>NOMBRE COMPLETO</label>
                                <input placeholder="Ej. Julianne Moore" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className={errores.nombre ? "input-error" : ""} />
                                {errores.nombre && <span className="checkout-field-error">{errores.nombre}</span>}
                            </div>
                            <div className="checkout-field">
                                <label>CORREO ELECTRÓNICO</label>
                                <input type="email" placeholder="julianne@aurea.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={errores.email ? "input-error" : ""} />
                                {errores.email && <span className="checkout-field-error">{errores.email}</span>}
                            </div>
                        </div>
                        <div className="checkout-field full">
                            <label>DIRECCIÓN DE ENTREGA</label>
                            <input placeholder="Calle de la Elegancia 123" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} className={errores.direccion ? "input-error" : ""} />
                            {errores.direccion && <span className="checkout-field-error">{errores.direccion}</span>}
                        </div>
                        <div className="checkout-row">
                            <div className="checkout-field">
                                <label>CIUDAD</label>
                                <input placeholder="Lanús" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} className={errores.ciudad ? "input-error" : ""} />
                                {errores.ciudad && <span className="checkout-field-error">{errores.ciudad}</span>}
                            </div>
                            <div className="checkout-field">
                                <label>CÓDIGO POSTAL</label>
                                <input placeholder="1822" value={form.codigoPostal} onChange={(e) => set("codigoPostal", e.target.value)} className={errores.codigoPostal ? "input-error" : ""} />
                                {errores.codigoPostal && <span className="checkout-field-error">{errores.codigoPostal}</span>}
                            </div>
                        </div>

                        {/* MÉTODO DE PAGO */}
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

                        {/* CAMPOS TARJETA */}
                        {metodoPago === "tarjeta" && (
                            <>
                                <div className="checkout-field full" style={{ marginTop: "1rem" }}>
                                    <label>
                                        NÚMERO DE TARJETA
                                        {tipoTarjeta && <span className="checkout-tipo-tarjeta">{tipoTarjeta}</span>}
                                    </label>
                                    <input
                                        placeholder="0000 0000 0000 0000"
                                        value={form.tarjeta}
                                        inputMode="numeric"
                                        autoComplete="off"
                                        onChange={(e) => set("tarjeta", formatearTarjeta(e.target.value))}
                                        className={errores.tarjeta ? "input-error" : ""}
                                    />
                                    {errores.tarjeta && <span className="checkout-field-error">{errores.tarjeta}</span>}
                                </div>
                                <div className="checkout-row">
                                    <div className="checkout-field">
                                        <label>FECHA DE VENCIMIENTO</label>
                                        <input
                                            placeholder="MM/AA"
                                            value={form.vencimiento}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            onChange={(e) => set("vencimiento", formatearVencimiento(e.target.value))}
                                            maxLength={5}
                                            className={errores.vencimiento ? "input-error" : ""}
                                        />
                                        {errores.vencimiento && <span className="checkout-field-error">{errores.vencimiento}</span>}
                                    </div>
                                    <div className="checkout-field">
                                        <label>CÓDIGO CVV {tipoTarjeta === "American Express" ? "(4 dígitos)" : "(3 dígitos)"}</label>
                                        <input
                                            placeholder={"•".repeat(cvvMax)}
                                            type="password"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            maxLength={cvvMax}
                                            value={form.cvv}
                                            onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, cvvMax))}
                                            className={errores.cvv ? "input-error" : ""}
                                        />
                                        {errores.cvv && <span className="checkout-field-error">{errores.cvv}</span>}
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
                                        <button onClick={() => dispatch(quitarCuponAplicado())}>✕</button>
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
                            {descuentoMetodo > 0 && <div className="checkout-resumen-row descuento"><span>Desc. transferencia (5%)</span><span>-${descuentoMetodo.toLocaleString("es-AR")}</span></div>}
                            <div className="checkout-resumen-row"><span>Envío Premium</span><span style={{ color: "#2a2520" }}>$0</span></div>
                        </div>
                        <div className="checkout-total">
                            <span>TOTAL</span>
                            <span>${totalFinal.toLocaleString("es-AR")}</span>
                        </div>
                        <button className="checkout-btn" onClick={handleSubmit}>CONFIRMAR Y PAGAR →</button>
                        <p className="checkout-garantia">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Garantía AUREA de Autenticidad
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
