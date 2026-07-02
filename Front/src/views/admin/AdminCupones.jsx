import { useState, useEffect } from "react";
import { getCuponesAPI, crearCuponAPI, eliminarCuponAPI } from "../../services/api";
import AdminNav from "./AdminNav";
import "./AdminPanel.css";

export default function AdminCupones() {
    const [cupones, setCupones] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [descuento, setDescuento] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getCuponesAPI()
            .then((data) => setCupones(data))
            .catch((err) => console.error("Error al cargar cupones:", err));
    }, []);

    const handleCrearCupon = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await crearCuponAPI({ codigo: codigo.toUpperCase(), descuento: Number(descuento) });
            setCupones([...cupones, data]);
            setCodigo("");
            setDescuento("");
        } catch (err) {
            setError(err.message || "No se pudo crear el cupón.");
        }
    };

    const handleEliminar = async (id) => {
        try {
            await eliminarCuponAPI(id);
            setCupones(cupones.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error al eliminar cupón:", err);
        }
    };

    return (
        <div className="admin-panel">
            <AdminNav />
            <div className="admin-panel-inner">
                <h1 className="admin-section-title">Gestión de Cupones</h1>

                {/* Formulario de Alta */}
                <form onSubmit={handleCrearCupon} style={{ marginBottom: "30px", display: "flex", gap: "15px" }}>
                    <input
                        type="text"
                        placeholder="CÓDIGO (Ej: AUREA20)"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                        style={{ padding: "10px" }}
                    />
                    <input
                        type="number"
                        placeholder="% Descuento"
                        value={descuento}
                        onChange={(e) => setDescuento(e.target.value)}
                        required
                        min="1" max="100"
                        style={{ padding: "10px" }}
                    />
                    <button type="submit" style={{ padding: "10px 20px", background: "#c9a84c", color: "#fff", border: "none", cursor: "pointer" }}>
                        Crear Cupón
                    </button>
                </form>

                {error && <p style={{ color: "#c44", marginBottom: "1rem" }}>{error}</p>}

                {/* Tabla de Cupones */}
                <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th>ID</th>
                        <th>CÓDIGO</th>
                        <th>DESCUENTO</th>
                        <th>ACCIÓN</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cupones.map(c => (
                        <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px 0" }}>{c.id}</td>
                            <td><strong>{c.codigo}</strong></td>
                            <td>{c.descuento}%</td>
                            <td>
                                <button onClick={() => handleEliminar(c.id)} style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}