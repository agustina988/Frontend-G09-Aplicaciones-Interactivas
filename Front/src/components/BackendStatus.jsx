import { useState, useEffect } from "react";

export default function BackendStatus() {
    const [online, setOnline] = useState(true);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch("http://localhost:4002/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test", password: "test" }),
        })
            .then(() => setOnline(true))
            .catch(() => setOnline(false))
            .finally(() => setCargando(false));
    }, []);

    if (cargando || online) return null;

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