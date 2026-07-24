import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCupones, crearCupon, eliminarCupon } from "../../features/cupones/cuponesSlice";
import AdminNav from "./AdminNav";
import "./AdminPanel.css";

export default function AdminCupones() {
    const dispatch = useDispatch();
    const cupones = useSelector((state) => state.cupones.items);
    const error = useSelector((state) => state.cupones.error);
    const cargado = useSelector((state) => state.cupones.cargado);
    const [codigo, setCodigo] = useState("");
    const [descuento, setDescuento] = useState("");

    useEffect(() => {
        // Antes: dispatch(fetchCupones()) sin guard -> cada vez que se
        // entraba a esta pantalla, volvía a pegarle al backend.
        // Ahora: se pide una única vez por sesión, igual que usuarios/pedidos.
        if (!cargado) {
            dispatch(fetchCupones());
        }
    }, [cargado, dispatch]);

    const handleCrearCupon = (e) => {
        e.preventDefault();
        dispatch(crearCupon({ codigo: codigo.toUpperCase(), descuento: Number(descuento) })).then((resultado) => {
            if (crearCupon.fulfilled.match(resultado)) {
                setCodigo("");
                setDescuento("");
            }
        });
    };

    const handleEliminar = (id) => {
        dispatch(eliminarCupon(id));
    };

    return (
        <div className="admin-panel">
            <AdminNav />
            <div className="admin-panel-inner">
                <h1 className="admin-section-title">Gestión de Cupones</h1>

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