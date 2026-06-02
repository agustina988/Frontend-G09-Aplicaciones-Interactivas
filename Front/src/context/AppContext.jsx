import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [favoritos, setFavoritos] = useState([]);

    const login = (datos) => setUsuario(datos);
    const logout = () => setUsuario(null);

    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) return prev.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p);
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const toggleFavorito = (producto) => {
        setFavoritos((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) return prev.filter((p) => p.id !== producto.id);
            return [...prev, producto];
        });
    };

    const esFavorito = (id) => favoritos.some((p) => p.id === id);

    const totalCarrito = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    return (
        <AppContext.Provider value={{ usuario, login, logout, carrito, agregarAlCarrito, totalCarrito, favoritos, toggleFavorito, esFavorito }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
