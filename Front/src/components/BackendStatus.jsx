import { useSelector } from "react-redux";

export default function BackendStatus() {
    const cargando = useSelector((state) => state.productos.loading);
    const error = useSelector((state) => state.productos.error);
    const cargado = useSelector((state) => state.productos.cargado);

    // El estado de conexión se deriva directamente del fetchProductos que ya
    // dispara App.jsx al montar — no hace falta un segundo pedido al backend
    // solo para chequear si está online.
    if (cargando || !cargado || !error) return null;

    return (
        <div style={{
            position: "fixed", bottom: "1rem", left: "1rem",
            background: "#c44", color: "#fff", padding: "10px 20px",
            borderRadius: "4px", fontFamily: "Cormorant Garamond, serif",
            fontSize: "14px", zIndex: 9999,
        }}>
            ⚠ Sin conexión al servidor. Algunas funciones pueden no estar disponibles.
        </div>
    );
}
