import { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import "./AdminPanel.css";

export default function AdminCupones() {
    const [cupones, setCupones] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [descuento, setDescuento] = useState("");

    useEffect(() => {
        fetch("http://localhost:4002/cupones", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => setCupones(data))
        .catch(err => console.error("Error al cargar cupones:", err));
    }, []);

    const handleCrearCupon = (e) => {
        e.preventDefault();
        const nuevoCupon = { codigo: codigo.toUpperCase(), descuento: Number(descuento) };

        fetch("http://localhost:4002/cupones", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(nuevoCupon)
        })
        .then(res => res.json())
        .then(data => {
            setCupones([...cupones, data]);
            setCodigo("");
            setDescuento("");
        })
        .catch(err => console.error("Error al crear cupón:", err));
    };

    const handleEliminar = (id) => {
        fetch(`http://localhost:4002/cupones/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
            setCupones(cupones.filter(c => c.id !== id));
        })
        .catch(err => console.error("Error al eliminar cupón:", err));
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