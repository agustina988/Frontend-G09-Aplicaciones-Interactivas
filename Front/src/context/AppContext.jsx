import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
    getProductosAPI,
    getCategoriasAPI,
    crearCategoriaAPI,
    editarCategoriaAPI,
    eliminarCategoriaAPI,
    getCarritoAPI,
    agregarAlCarritoAPI,
    vaciarCarritoAPI,
    confirmarCarritoAPI,
    getPedidosAPI,
    crearPedidoAPI,
    validarCuponAPI,
} from '../services/api';

const AppContext = createContext();

// Favoritos: por ahora se persisten en localStorage (a futuro pasan a Redux).
const cargarFavoritosGuardados = () => {
    try {
        const raw = localStorage.getItem("favoritos");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export function AppProvider({ children }) {
    // El token es la fuente de verdad estable: se inicializa leyendo localStorage
    // una sola vez, y todo lo que dependa de "¿hay sesión?" debe mirar esto,
    // no el objeto `usuario` (que cambia de referencia en cada actualización).
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [usuario, setUsuario] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [favoritos, setFavoritos] = useState(cargarFavoritosGuardados);
    const [toasts, setToasts] = useState([]);
    const [cupon, setCupon] = useState(null);
    const [pedidosAdmin, setPedidosAdmin] = useState([]);
    const [usuariosAdmin, setUsuariosAdmin] = useState([]);
    const [productosBackend, setProductosBackend] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [backendOnline, setBackendOnline] = useState(true);

    // Categorías: vienen 100% del backend (/categories). No hay datos inventados acá.
    const [categoriasAdmin, setCategoriasAdmin] = useState([]);

    const [productosStock, setProductosStock] = useState([]);

    const addToast = useCallback((msg, tipo = "carrito") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, msg, tipo, saliendo: false }]);
        setTimeout(() => setToasts((prev) => prev.map((t) => t.id === id ? { ...t, saliendo: true } : t)), 3000);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3400);
    }, []);

    // Sincronizar productos y estado del backend al montar (catálogo público).
    // Corre UNA sola vez: nunca debe volver a pedir todos los productos por
    // filtrar, agregar a favoritos, o loguearse. Solo un F5 real dispara esto de nuevo.
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
                    // Todas las imágenes (portada primero), no solo la primera
                    imagenes: (b.imagenes || [])
                        .slice()
                        .sort((x, y) => (y.esPrincipal ? 1 : 0) - (x.esPrincipal ? 1 : 0))
                        .map((img) => img.url),
                    imagenUrl: b.imagenes?.[0]?.url || null,
                    badge: b.badge || null,
                    peso: b.peso || "",
                    certificacion: b.certificacion || "",
                    composicionMaterial: b.composicionMaterial || "",
                    esencia: b.esencia || "",
                    caracteristicas: (b.caracteristicas || []).map((c) => ({ titulo: c.titulo, texto: c.texto })),
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
            .catch(() => setBackendOnline(false))
            .finally(() => setCargandoProductos(false));

        // Categorías reales del backend (para el panel de admin)
        getCategoriasAPI()
            .then((data) => setCategoriasAdmin(data.map((c) => ({
                id: c.id,
                nombre: c.nombre,
                slug: c.slug || "",
                desc: c.descripcion || "",
                publicado: c.publicado,
            }))))
            .catch(() => {});
    }, []);

    // Persistir favoritos en localStorage cada vez que cambian
    useEffect(() => {
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }, [favoritos]);

    // Cargar carrito del backend — depende del token (estable), no de `usuario`
    useEffect(() => {
        if (!token || usuario?.rol === "ROLE_ADMIN") return;
        getCarritoAPI()
            .then((data) => {
                if (data.productos && data.productos.length > 0) {
                    setCarrito(data.productos.map((p) => {
                        const prodBackend = productosBackend.find((pl) => pl.id === p.idProducto);
                        return {
                            id: p.idProducto,
                            nombre: p.nombre,
                            precio: p.precio,
                            cantidad: p.cantidad,
                            imagenes: prodBackend?.imagenUrl ? [prodBackend.imagenUrl] : [],
                            subcategoria: prodBackend?.subcategoria || "",
                        };
                    }));
                } else {
                    setCarrito([]);
                }
            })
            .catch(() => {});
    }, [token]);

    // Cargar pedidos del admin — depende del token, no de `usuario`
    useEffect(() => {
        if (!token || usuario?.rol !== "ROLE_ADMIN") return;
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
    }, [token, usuario?.rol]);

    const login = (datos) => {
        // datos viene del backend ya completo
        setToken(localStorage.getItem("token"));
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
        if (token && !esAdmin) {
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
        if (token && !esAdmin) {
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

    // El cupón se valida contra el backend (/cupones/validar/:codigo) — no hay
    // códigos inventados en el front. Si el código no existe, el backend responde 404.
    const aplicarCupon = async (codigo) => {
        try {
            const data = await validarCuponAPI(codigo.toUpperCase());
            setCupon({ codigo: data.codigo, descuento: data.descuento });
            return true;
        } catch {
            return false;
        }
    };
    const quitarCupon = () => setCupon(null);

    const confirmarCompra = async (datosEnvio) => {
        const carritoSnapshot = [...carrito];
        const totalSnapshot = total;

        // 1. Confirmar compra en backend (descuenta stock y vacía carrito)
        if (token && !esAdmin) {
            try {
                await confirmarCarritoAPI();
            } catch (err) { console.error("Error confirmando compra:", err); }
        }

        // 2. Guardar pedido en backend
        let pedidoBackend = null;
        if (token) {
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

    // Categorías: todas las operaciones pegan al backend (/categories) y recién
    // después actualizan el estado local con lo que el backend confirmó.
    const agregarCategoria = async (cat) => {
        const creada = await crearCategoriaAPI({
            nombre: cat.nombre,
            slug: cat.slug,
            descripcion: cat.desc || "",
            publicado: true,
        });
        setCategoriasAdmin((prev) => [...prev, {
            id: creada.id, nombre: creada.nombre, slug: creada.slug || "",
            desc: creada.descripcion || "", publicado: creada.publicado,
        }]);
    };

    const eliminarCategoria = async (id) => {
        await eliminarCategoriaAPI(id);
        setCategoriasAdmin((prev) => prev.filter((c) => c.id !== id));
    };

    const editarCategoria = async (id, datos) => {
        const actual = categoriasAdmin.find((c) => c.id === id);
        const actualizada = await editarCategoriaAPI(id, {
            nombre: datos.nombre ?? actual?.nombre,
            slug: datos.slug ?? actual?.slug,
            descripcion: datos.desc ?? actual?.desc ?? "",
            publicado: datos.publicado ?? actual?.publicado ?? true,
        });
        setCategoriasAdmin((prev) => prev.map((c) => c.id === id ? {
            id: actualizada.id, nombre: actualizada.nombre, slug: actualizada.slug || "",
            desc: actualizada.descripcion || "", publicado: actualizada.publicado,
        } : c));
    };

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
            productosBackend, setProductosBackend, cargandoProductos,
            backendOnline,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);