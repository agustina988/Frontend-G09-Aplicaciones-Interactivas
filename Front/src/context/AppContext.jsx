import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { productos } from "../data/productos";

const AppContext = createContext();

const IDS_ESTATICOS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

export function AppProvider({ children }) {
    const [token, setToken] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [cupon, setCupon] = useState(null);
    const [pedidosAdmin, setPedidosAdmin] = useState([]);
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);
    const [productosBackend, setProductosBackend] = useState([]);
    const [backendOnline, setBackendOnline] = useState(true);

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
        setTimeout(() => setToasts((prev) => prev.map((t) => t.id === id ? { ...t, saliendo: true } : t)), 3000);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3400);
    }, []);

    // Sincronizar productos y estado del backend al montar
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("token");
        if (!tokenGuardado) return;

        fetch("http://localhost:4002/productos", {
            headers: { Authorization: `Bearer ${tokenGuardado}` }
        })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setBackendOnline(true);
                setProductosStock((prev) => prev.map((p) => {
                    const b = data.find((b) => b.id === p.id);
                    return b ? { ...p, stock: b.stock, precio: b.precio } : p;
                }));
                const nuevos = data.filter((b) => !IDS_ESTATICOS.includes(b.id));
                if (nuevos.length > 0) {
                    setProductosBackend((prevBackend) => nuevos.map((b) => {
                        const previo = prevBackend.find((pb) => pb.id === b.id);
                        return { id: b.id, nombre: b.nombre, descripcion: b.descripcion || "", precio: b.precio, stock: b.stock, tipo: b.tipo || "joyeria", imagenUrl: previo?.imagenUrl || null };
                    }));
                    setProductosStock((prev) => {
                        const idsActuales = prev.map((p) => p.id);
                        const faltantes = nuevos.filter((b) => !idsActuales.includes(b.id)).map((b) => ({ id: b.id, nombre: b.nombre, categoria: mapTipoACategoria(b.tipo), precio: b.precio, stock: b.stock, imagen: "/src/assets/placeholder.jpg" }));
                        return faltantes.length > 0 ? [...prev, ...faltantes] : prev;
                    });
                }
            })
            .catch(() => setBackendOnline(false));
    }, [usuario]);

    // Cargar carrito del backend
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("token");
        if (!tokenGuardado || !usuario || usuario.rol === "ROLE_ADMIN") return;
        fetch("http://localhost:4002/carrito", { headers: { Authorization: `Bearer ${tokenGuardado}` } })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                if (data.productos && data.productos.length > 0) {
                    setCarrito(data.productos.map((p) => {
                        const prodLocal = productos.find((pl) => pl.id === p.idProducto);
                        return { id: p.idProducto, nombre: p.nombre, precio: p.precio, cantidad: p.cantidad, imagenes: prodLocal?.imagenes || [], subcategoria: prodLocal?.subcategoria || "" };
                    }));
                } else {
                    setCarrito([]);
                }
            })
            .catch(() => {});
    }, [usuario]);

    // Cargar pedidos del admin
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("token");
        if (!tokenGuardado || !usuario || usuario.rol !== "ROLE_ADMIN") return;
        fetch("http://localhost:4002/pedidos", { headers: { Authorization: `Bearer ${tokenGuardado}` } })
            .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
            .then((data) => {
                setPedidosAdmin(data.map((p) => ({
                    id: `#${p.id}`,
                    idReal: p.id,
                    cliente: p.emailUsuario,
                    email: p.emailUsuario,
                    fecha: p.fechaPedido,
                    total: p.total,
                    estado: p.estado,
                    direccion: p.direccionEnvio,
                    productos: p.detalles?.map((d) => ({ id: d.idProducto, nombre: d.nombreProducto, precio: d.precioUnitario, cantidad: d.cantidad })) || [],
                })));
            })
            .catch(() => {});
    }, [usuario]);

    const login = (datos) => {
        // datos viene del backend ya completo
        setUsuario(datos);
        return { ok: true };
    };

    const logout = () => {
        setToken(null);
        setUsuario(null);
        setCarrito([]);
        setPedidosAdmin([]);
        localStorage.removeItem("token");
    };

    const esAdmin = usuario?.rol === "ROLE_ADMIN";

    const agregarAlCarrito = async (producto) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.id === producto.id);
            if (existe) return prev.map((p) => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p);
            return [...prev, { ...producto, cantidad: 1 }];
        });
        addToast(`${producto.nombre} agregado al carrito`, "carrito");
        const tokenGuardado = localStorage.getItem("token");
        if (tokenGuardado && !esAdmin) {
            try {
                await fetch("http://localhost:4002/carrito/agregar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenGuardado}` },
                    body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
                });
            } catch (err) { console.error("Error sincronizando carrito:", err); }
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
        if (tokenGuardado && !esAdmin) {
            fetch("http://localhost:4002/carrito/vaciar", { method: "DELETE", headers: { Authorization: `Bearer ${tokenGuardado}` } }).catch(() => {});
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

    const confirmarCompra = async (datosEnvio) => {
        const carritoSnapshot = [...carrito];
        const totalSnapshot = total;
        const tokenGuardado = localStorage.getItem("token");

        // 1. Confirmar compra en backend (descuenta stock y vacía carrito)
        if (tokenGuardado && !esAdmin) {
            try {
                await fetch("http://localhost:4002/carrito/confirmar", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${tokenGuardado}` },
                });
            } catch (err) { console.error("Error confirmando compra:", err); }
        }

        // 2. Guardar pedido en backend
        let pedidoBackend = null;
        if (tokenGuardado) {
            try {
                const res = await fetch("http://localhost:4002/pedidos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenGuardado}` },
                    body: JSON.stringify({
                        total: totalSnapshot,
                        direccionEnvio: datosEnvio?.direccion || usuario?.direccion || "",
                        productos: carritoSnapshot.map((p) => ({
                            idProducto: p.id,
                            nombreProducto: p.nombre,
                            precioUnitario: p.precio,
                            cantidad: p.cantidad,
                        })),
                    }),
                });
                if (res.ok) pedidoBackend = await res.json();
            } catch (err) { console.error("Error guardando pedido:", err); }
        }

        const pedido = {
            id: pedidoBackend ? `#${pedidoBackend.id}` : "#" + Math.floor(1000 + Math.random() * 9000),
            idReal: pedidoBackend?.id,
            cliente: usuario?.nombre || usuario?.email || "Cliente",
            email: usuario?.email || "",
            fecha: new Date().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
            total: totalSnapshot,
            estado: "PENDIENTE",
            productos: carritoSnapshot,
            direccion: datosEnvio?.direccion || usuario?.direccion || "",
        };

        // 3. Restar stock local
        setProductosStock((prev) => prev.map((p) => {
            const comprado = carritoSnapshot.find((c) => c.id === p.id);
            return comprado ? { ...p, stock: Math.max(0, p.stock - comprado.cantidad) } : p;
        }));

        // 4. Actualizar pedidos del usuario en estado local
        if (usuario) {
            setUsuario((prev) => ({
                ...prev,
                pedidos: [
                    { id: pedido.id, producto: carritoSnapshot[0]?.nombre, precio: totalSnapshot, fecha: pedido.fecha, estado: "EN CAMINO", productos: carritoSnapshot },
                    ...(prev.pedidos || [])
                ],
            }));
        }

        setCarrito([]);
        return pedido;
    };

    const agregarCategoria = (cat) => setCategoriasAdmin((prev) => [...prev, { ...cat, id: Date.now(), publicado: true, productos: 0 }]);
    const eliminarCategoria = (id) => setCategoriasAdmin((prev) => prev.filter((c) => c.id !== id));
    const editarCategoria = (id, datos) => setCategoriasAdmin((prev) => prev.map((c) => c.id === id ? { ...c, ...datos } : c));

    const editarStock = (id, cantidad) => setProductosStock((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, cantidad) } : p));
    const eliminarStock = (id) => {
        setProductosStock((prev) => prev.filter((p) => p.id !== id));
        setProductosBackend((prev) => prev.filter((p) => p.id !== id));
    };

    const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const descuentoCupon = cupon ? Math.round(subtotal * cupon.descuento / 100) : 0;
    const total = subtotal - descuentoCupon;
    const totalCarrito = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    return (
        <AppContext.Provider value={{
            token, usuario, setUsuario, login, logout, esAdmin,
            carrito, agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, totalCarrito,
            favoritos, toggleFavorito, esFavorito,
            subtotal, total, cupon, descuentoCupon, aplicarCupon, quitarCupon,
            toasts,
            pedidosAdmin, setPedidosAdmin, confirmarCompra,
            usuariosAdmin,
            categoriasAdmin, agregarCategoria, eliminarCategoria, editarCategoria,
            productosStock, setProductosStock, editarStock, eliminarStock,
            productosBackend, setProductosBackend,
            backendOnline,
        }}>
            {children}
        </AppContext.Provider>
    );
}

function mapTipoACategoria(tipo) {
    const map = { "joyeria": "Joyería", "relojes": "Relojes", "lingotes": "Lingotes", "edicion-limitada": "Edición Limitada" };
    return map[tipo] || "Joyería";
}

export const useApp = () => useContext(AppContext);