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
        { id: 1, nombre: "Aros Aura Pearl", categoria: "Joyería", precio: 90000, stock: 5, imagen: "/src/assets/joyeria/aros aura/foto1.jpg" },
        { id: 2, nombre: "Aros Alba", categoria: "Joyería", precio: 110000, stock: 5, imagen: "/src/assets/joyeria/aros alba/foto1.jpg" },
        { id: 3, nombre: "Aros Éter", categoria: "Joyería", precio: 100000, stock: 5, imagen: "/src/assets/joyeria/aros eter/foto1.jpg" },
        { id: 4, nombre: "Aros Ambar", categoria: "Joyería", precio: 140000, stock: 5, imagen: "/src/assets/joyeria/aro ambar/foto1.jpg" },
        { id: 5, nombre: "Anillo Eternity", categoria: "Joyería", precio: 80000, stock: 5, imagen: "/src/assets/joyeria/anillo eternity/foto1.jpg" },
        { id: 6, nombre: "Anillo Vittoria", categoria: "Joyería", precio: 130000, stock: 5, imagen: "/src/assets/joyeria/anillo victoria/foto1.jpg" },
        { id: 7, nombre: "Collar Heaven", categoria: "Joyería", precio: 170000, stock: 5, imagen: "/src/assets/joyeria/collar heaven/foto1.jpg" },
        { id: 8, nombre: "Pulsera Firenze", categoria: "Joyería", precio: 180000, stock: 5, imagen: "/src/assets/joyeria/pulsera firenze/foto1.jpg" },
        { id: 9, nombre: "Pulsera Siena", categoria: "Joyería", precio: 110000, stock: 5, imagen: "/src/assets/joyeria/pulsera siena/foto1.jpg" },
        { id: 10, nombre: "Reloj Imperial", categoria: "Relojes", precio: 200000, stock: 5, imagen: "/src/assets/relojes/reloj imperial/foto1.jpg" },
        { id: 11, nombre: "Reloj Chronos", categoria: "Relojes", precio: 150000, stock: 5, imagen: "/src/assets/relojes/reloj chronos/foto1.jpg" },
        { id: 12, nombre: "Reloj Monaco", categoria: "Relojes", precio: 150000, stock: 5, imagen: "/src/assets/relojes/reloj monaco/foto1.jpg" },
        { id: 13, nombre: "Reloj Noir", categoria: "Relojes", precio: 180000, stock: 5, imagen: "/src/assets/relojes/reloj noir/foto1.jpg" },
        { id: 14, nombre: "Reloj Tempus", categoria: "Relojes", precio: 150000, stock: 5, imagen: "/src/assets/relojes/reloj tempus/foto1.jpg" },
        { id: 15, nombre: "Lingote de Oro Laminado", categoria: "Lingotes", precio: 2300000, stock: 5, imagen: "/src/assets/lingotes/lingote_oro.jpg" },
        { id: 16, nombre: "Lingote de Plata", categoria: "Lingotes", precio: 1400000, stock: 5, imagen: "/src/assets/lingotes/lingote_plata.jpg" },
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

        // restar stock por cada producto comprado
        setProductosStock((prev) =>
            prev.map((p) => {
                const comprado = carrito.find((c) => c.id === p.id);
                if (comprado) {
                    return { ...p, stock: Math.max(0, p.stock - comprado.cantidad) };
                }
                return p;
            })
        );

        if (usuario) {
            setUsuario((prev) => ({
                ...prev,
                pedidos: [
                    { id: pedido.id, producto: carrito[0]?.nombre, precio: total, fecha: pedido.fecha, estado: "EN CAMINO", productos: [...carrito] },
                    ...(prev.pedidos || [])
                ],
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
