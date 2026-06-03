import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext();

// Credenciales admin fijas
const ADMIN_EMAIL = "admin@aurea.com";
const ADMIN_PASS = "admin1234";

const mockJWT = (email) => {
    const rol = email === ADMIN_EMAIL ? "admin" : "usuario";
    return { email, rol, exp: Date.now() + 3600000 };
};

export function AppProvider({ children }) {
    const [token, setToken] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [cupon, setCupon] = useState(null);
    // Estado global compartido admin
    const [pedidosAdmin, setPedidosAdmin] = useState([]);
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);
    const [categoriasAdmin, setCategoriasAdmin] = useState([
        { id: 1, nombre: "Alta Joyería", slug: "joyeria", desc: "Piezas únicas engastadas con gemas de procedencia ética.", badge: "GIA CERTIFIED", productos: 142, valor: "$12.4M", publicado: true },
        { id: 2, nombre: "Relojería", slug: "relojes", desc: "Cronógrafos de manufactura suiza y complicaciones mecánicas.", badge: null, stock: 89, publicado: true },
        { id: 3, nombre: "Colecciones Especiales", slug: "especiales", desc: "Colaboraciones exclusivas y cápsulas estacionales.", badge: null, series: 12, publicado: false },
        { id: 4, nombre: "Piezas de Autor", slug: "autor", desc: "Diseños conceptuales firmados por maestros artesanos.", badge: "ARTISAN SELECT", productos: 34, publicado: true },
    ]);
    const [productosStock, setProductosStock] = useState([
        { id: 9, nombre: "Reloj Chronos", categoria: "Relojes", precio: 150000, stock: 1, imagen: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=100&q=60" },
        { id: 4, nombre: "Pulsera Eternidad", categoria: "Joyería", precio: 180000, stock: 3, imagen: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100&q=60" },
        { id: 1, nombre: "Anillo Solitario de Esmeralda", categoria: "Joyería", precio: 130000, stock: 9, imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&q=60" },
    ]);

    const addToast = useCallback((msg, tipo = "carrito") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, tipo }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    }, []);

    // Login único con validación de contraseña para admin
    const login = (datos, password) => {
        if (datos.email === ADMIN_EMAIL && password !== ADMIN_PASS) {
            return { ok: false, error: "Contraseña incorrecta para administrador." };
        }
        const jwt = mockJWT(datos.email);
        setToken(jwt);
        const usuarioFinal = { ...datos, rol: jwt.rol };
        setUsuario(usuarioFinal);
        // Registrar en lista de usuarios admin si no existe
        if (jwt.rol !== "admin") {
            setUsuariosAdmin((prev) => {
                const existe = prev.find((u) => u.email === datos.email);
                if (existe) return prev;
                return [...prev, { ...usuarioFinal, acceso: "Ahora mismo", miembro: datos.miembro || "MEMBER" }];
            });
        }
        return { ok: true };
    };

    const logout = () => { setToken(null); setUsuario(null); };
    const esAdmin = usuario?.rol === "admin";

    // Carrito
    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) return prev.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p);
            return [...prev, { ...producto, cantidad: 1 }];
        });
        addToast(`${producto.nombre} agregado al carrito`, "carrito");
    };
    const quitarDelCarrito = (id) => setCarrito((prev) => prev.filter((p) => p.id !== id));
    const cambiarCantidad = (id, cantidad) => {
        if (cantidad < 1) return;
        setCarrito((prev) => prev.map((p) => p.id === id ? { ...p, cantidad } : p));
    };
    const vaciarCarrito = () => setCarrito([]);

    // Favoritos
    const toggleFavorito = (producto) => {
        setFavoritos((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) { addToast(`${producto.nombre} quitado de favoritos`, "favorito-off"); return prev.filter((p) => p.id !== producto.id); }
            addToast(`${producto.nombre} guardado en favoritos`, "favorito");
            return [...prev, producto];
        });
    };
    const esFavorito = (id) => favoritos.some((p) => p.id === id);

    // Cupones
    const CUPONES = { "AUREA10": 10, "AUREA20": 20, "VIP30": 30 };
    const aplicarCupon = (codigo) => {
        const descuento = CUPONES[codigo.toUpperCase()];
        if (descuento) { setCupon({ codigo: codigo.toUpperCase(), descuento }); return true; }
        return false;
    };
    const quitarCupon = () => setCupon(null);

    // Confirmar compra → agrega pedido al admin
    const confirmarCompra = (datosEnvio) => {
        const pedido = {
            id: "#" + Math.floor(1000 + Math.random() * 9000),
            cliente: usuario?.nombre || datosEnvio?.nombre || "Cliente",
            email: usuario?.email || datosEnvio?.email || "",
            fecha: new Date().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
            total: total,
            estado: "PENDIENTE",
            productos: [...carrito],
            direccion: datosEnvio?.direccion || usuario?.direccion || "",
            ciudad: datosEnvio?.ciudad || "",
        };
        setPedidosAdmin((prev) => [pedido, ...prev]);
        // También actualizar historial del usuario
        if (usuario) {
            setUsuario((prev) => ({
                ...prev,
                pedidos: [{ id: pedido.id, producto: carrito[0]?.nombre, precio: total, fecha: pedido.fecha, estado: "EN CAMINO" }, ...(prev.pedidos || [])],
            }));
        }
        vaciarCarrito();
        return pedido;
    };

    // Categorías admin
    const agregarCategoria = (cat) => {
        setCategoriasAdmin((prev) => [...prev, { ...cat, id: Date.now(), publicado: true, productos: 0 }]);
    };
    const eliminarCategoria = (id) => setCategoriasAdmin((prev) => prev.filter((c) => c.id !== id));
    const editarCategoria = (id, datos) => setCategoriasAdmin((prev) => prev.map((c) => c.id === id ? { ...c, ...datos } : c));

    // Stock
    const editarStock = (id, cantidad) => setProductosStock((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, cantidad) } : p));
    const eliminarStock = (id) => setProductosStock((prev) => prev.filter((p) => p.id !== id));

    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const descuentoCupon = cupon ? Math.round(subtotal * cupon.descuento / 100) : 0;
    const total = subtotal - descuentoCupon;
    const totalCarrito = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    return (
        <AppContext.Provider value={{
            token, usuario, login, logout, esAdmin,
            carrito, agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, totalCarrito,
            favoritos, toggleFavorito, esFavorito,
            subtotal, total, cupon, descuentoCupon, aplicarCupon, quitarCupon,
            toasts,
            pedidosAdmin, setPedidosAdmin, confirmarCompra,
            usuariosAdmin,
            categoriasAdmin, agregarCategoria, eliminarCategoria, editarCategoria,
            productosStock, editarStock, eliminarStock,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
