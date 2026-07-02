import { createContext, useContext, useState, useCallback, useEffect } from "react";
//import { productos } from "../data/productos";
import {
    getProductosAPI,
    getCategoriasAPI,
    getCarritoAPI,
    agregarAlCarritoAPI,
    vaciarCarritoAPI,
    confirmarCarritoAPI,
    getPedidosAPI,
    crearPedidoAPI,
} from '../services/api';

const AppContext = createContext();

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

    const [productosStock, setProductosStock] = useState([]);

    const addToast = useCallback((msg, tipo = "carrito") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, tipo, saliendo: false }]);
        setTimeout(() => setToasts((prev) => prev.map((t) => t.id === id ? { ...t, saliendo: true } : t)), 3000);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3400);
    }, []);

    // Sincronizar productos y estado del backend al montar (catálogo público, no requiere login)
    useEffect(() => {
        getProductosAPI()
            .then((data) => {
                setBackendOnline(true);
                setProductosBackend(data.map((b) => ({
                    id: b.id,
                    nombre: b.nombre,
                    descripcion: b.descripcion || "",
                    precio: b.precio,
                    stock: b.stock,
                    categoriaId: b.categoria?.id ?? null,
                    categoriaNombre: b.categoria?.nombre || "Sin categoría",
                    categoriaSlug: b.categoria?.slug || "",
                    subcategoria: b.subcategoria || "",
                    materiales: b.materiales?.map((m) => m.nombre) || [],
                    imagenUrl: b.imagenes?.[0]?.url || null,
                })));
                setProductosStock(data.map((b) => ({
                    id: b.id,
                    nombre: b.nombre,
                    categoria: b.categoria?.nombre || "Sin categoría",
                    categoriaSlug: b.categoria?.slug || "",
                    precio: b.precio,
                    stock: b.stock,
                    imagen: b.imagenes?.[0]?.url || "/src/assets/placeholder.jpg",
                })));
            })
            .catch(() => setBackendOnline(false));
    }, [usuario]);

    // Cargar carrito del backend
    useEffect(() => {
        const tokenGuardado = localStorage.getItem("token");
        if (!tokenGuardado || !usuario || usuario.rol === "ROLE_ADMIN") return;
        getCarritoAPI()
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
        getPedidosAPI()
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
                await agregarAlCarritoAPI(producto.id, 1);
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
            vaciarCarritoAPI().catch(() => {});
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
                await confirmarCarritoAPI();
            } catch (err) { console.error("Error confirmando compra:", err); }
        }

        // 2. Guardar pedido en backend
        let pedidoBackend = null;
        if (tokenGuardado) {
            try {
                pedidoBackend = await crearPedidoAPI({
                    total: totalSnapshot,
                    direccionEnvio: datosEnvio?.direccion || usuario?.direccion || "",
                    productos: carritoSnapshot.map((p) => ({
                        idProducto: p.id,
                        nombreProducto: p.nombre,
                        precioUnitario: p.precio,
                        cantidad: p.cantidad,
                    })),
                });
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

export const useApp = () => useContext(AppContext);