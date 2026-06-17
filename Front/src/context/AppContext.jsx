import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { productos } from "../data/productos";

const AppContext = createContext();

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
    const [pedidosAdmin, setPedidosAdmin] = useState([]);
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);
    const [categoriasAdmin, setCategoriasAdmin] = useState([
        { id: 1, nombre: "Alta Joyería", slug: "joyeria", desc: "Piezas únicas engastadas con gemas de procedencia ética.", badge: "GIA CERTIFIED", productos: 142, valor: "$12.4M", publicado: true },
        { id: 2, nombre: "Relojería", slug: "relojes", desc: "Cronógrafos de manufactura suiza y complicaciones mecánicas.", badge: null, stock: 89, publicado: true },
        { id: 3, nombre: "Colecciones Especiales", slug: "especiales", desc: "Colaboraciones exclusivas y cápsulas estacionales.", badge: null, series: 12, publicado: false },
        { id: 4, nombre: "Piezas de Autor", slug: "autor", desc: "Diseños conceptuales firmados por maestros artesanos.", badge: "ARTISAN SELECT", productos: 34, publicado: true },
    ]);
    const [productosStock, setProductosStock] = useState([
        { id: 1, nombre: "Aros Aura Pearl", categoria: "Joyería", precio: 90000, stock: 4, imagen: "/src/assets/joyeria/aros aura/foto1.jpg" },
        { id: 2, nombre: "Aros Alba", categoria: "Joyería", precio: 110000, stock: 0, imagen: "/src/assets/joyeria/aros alba/foto1.jpg" },
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
        setToasts((prev) => [...prev, { id, msg, tipo, saliendo: false }]);
        setTimeout(() => {
            setToasts((prev) => prev.map((t) => t.id === id ? { ...t, saliendo: true } : t));
        }, 3000);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3400);
    }, []);

    // Cargar carrito del backend cuando el usuario se loguea
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("token");
        if (!tokenGuardado || !usuario || usuario.rol === "admin") return;

        fetch("http://localhost:4002/carrito", {
            headers: { Authorization: `Bearer ${tokenGuardado}` }
        })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                if (data.productos && data.productos.length > 0) {
                    setCarrito(data.productos.map((p) => {
                        const prodLocal = productos.find((pl) => pl.id === p.idProducto);
                        return {
                            id: p.idProducto,
                            nombre: p.nombre,
                            precio: p.precio,
                            cantidad: p.cantidad,
                            imagenes: prodLocal?.imagenes || [],
                            subcategoria: prodLocal?.subcategoria || "",
                        };
                    }));
                } else {
                    setCarrito([]);
                }
            })
            .catch(() => {});
    }, [usuario]);

    // Sincronizar stock con el backend cuando el usuario está logueado
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("token");
        if (!tokenGuardado) return;
        fetch("http://localhost:4002/productos", {
            headers: { Authorization: `Bearer ${tokenGuardado}` }
        })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setProductosStock((prev) => prev.map((p) => {
                    const backendProd = data.find((b) => b.nombre === p.nombre);
                    if (backendProd) return { ...p, stock: backendProd.stock };
                    return p;
                }));
            })
            .catch(() => {});
    }, [usuario]);

    const login = (datos, password) => {
        if (datos.email === ADMIN_EMAIL && password !== ADMIN_PASS) {
            return { ok: false, error: "Contraseña incorrecta para administrador." };
        }
        const jwt = mockJWT(datos.email);
        setToken(jwt);
        const usuarioFinal = { ...datos, rol: jwt.rol };
        setUsuario(usuarioFinal);
        if (jwt.rol !== "admin") {
            setUsuariosAdmin((prev) => {
                const existe = prev.find((u) => u.email === datos.email);
                if (existe) return prev;
                return [...prev, { ...usuarioFinal, acceso: "Ahora mismo", miembro: datos.miembro || "MEMBER" }];
            });
        }
        return { ok: true };
    };

    const logout = () => {
        setToken(null);
        setUsuario(null);
        setCarrito([]);
        localStorage.removeItem("token");
    };

    const esAdmin = usuario?.rol === "admin";

    const agregarAlCarrito = async (producto) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) return prev.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p);
            return [...prev, { ...producto, cantidad: 1 }];
        });
        addToast(`${producto.nombre} agregado al carrito`, "carrito");

        const tokenGuardado = localStorage.getItem("token");
        if (tokenGuardado && usuario?.rol !== "admin") {
            try {
                await fetch("http://localhost:4002/carrito/agregar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenGuardado}`,
                    },
                    body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
                });
            } catch (err) {
                console.error("Error sincronizando carrito:", err);
            }
        }
    };

    const quitarDelCarrito = (id) => setCarrito((prev) => prev.filter((p) => p.id !== id));

    const cambiarCantidad = (id, cantidad) => {
        if (cantidad < 1) return;
        setCarrito((prev) => prev.map((p) => p.id === id ? { ...p, cantidad } : p));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
        const tokenGuardado = localStorage.getItem("token");
        if (tokenGuardado && usuario?.rol !== "admin") {
            fetch("http://localhost:4002/carrito/vaciar", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${tokenGuardado}` },
            }).catch(() => {});
        }
    };

    const toggleFavorito = (producto) => {
        setFavoritos((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) { addToast(`${producto.nombre} quitado de favoritos`, "favorito-off"); return prev.filter((p) => p.id !== producto.id); }
            addToast(`${producto.nombre} guardado en favoritos`, "favorito");
            return [...prev, producto];
        });
    };
    const esFavorito = (id) => favoritos.some((p) => p.id === id);

    const CUPONES = { "AUREA10": 10, "AUREA20": 20, "VIP30": 30 };
    const aplicarCupon = (codigo) => {
        const descuento = CUPONES[codigo.toUpperCase()];
        if (descuento) { setCupon({ codigo: codigo.toUpperCase(), descuento }); return true; }
        return false;
    };
    const quitarCupon = () => setCupon(null);

    const confirmarCompra = (datosEnvio) => {
        const carritoSnapshot = [...carrito];
        const totalSnapshot = total;

        const pedido = {
            id: "#" + Math.floor(1000 + Math.random() * 9000),
            cliente: usuario?.nombre || datosEnvio?.nombre || "Cliente",
            email: usuario?.email || datosEnvio?.email || "",
            fecha: new Date().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
            total: totalSnapshot,
            estado: "PENDIENTE",
            productos: carritoSnapshot,
            direccion: datosEnvio?.direccion || usuario?.direccion || "",
            ciudad: datosEnvio?.ciudad || "",
        };

        setPedidosAdmin((prev) => [pedido, ...prev]);

        const tokenGuardado = localStorage.getItem("token");

        // Restar stock en el backend
        carritoSnapshot.forEach((p) => {
            if (tokenGuardado) {
                fetch(`http://localhost:4002/productos/${p.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenGuardado}`,
                    },
                    body: JSON.stringify({ stock: Math.max(0, (p.stock || 0) - p.cantidad) }),
                }).catch(() => {});
            }
        });

        // Restar stock local
        setProductosStock((prev) =>
            prev.map((p) => {
                const comprado = carritoSnapshot.find((c) => c.id === p.id);
                if (comprado) return { ...p, stock: Math.max(0, p.stock - comprado.cantidad) };
                return p;
            })
        );

        // Guardar pedido en historial del usuario
        if (usuario) {
            setUsuario((prev) => ({
                ...prev,
                pedidos: [
                    { id: pedido.id, producto: carritoSnapshot[0]?.nombre, precio: totalSnapshot, fecha: pedido.fecha, estado: "EN CAMINO", productos: carritoSnapshot },
                    ...(prev.pedidos || [])
                ],
            }));
        }

        // Vaciar carrito local inmediatamente
        setCarrito([]);

        // Vaciar carrito en el backend
        if (tokenGuardado && usuario?.rol !== "admin") {
            fetch("http://localhost:4002/carrito/vaciar", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${tokenGuardado}` },
            }).catch(() => {});
        }

        return pedido;
    };

    const agregarCategoria = (cat) => {
        setCategoriasAdmin((prev) => [...prev, { ...cat, id: Date.now(), publicado: true, productos: 0 }]);
    };
    const eliminarCategoria = (id) => setCategoriasAdmin((prev) => prev.filter((c) => c.id !== id));
    const editarCategoria = (id, datos) => setCategoriasAdmin((prev) => prev.map((c) => c.id === id ? { ...c, ...datos } : c));

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