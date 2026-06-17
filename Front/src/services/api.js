const BASE_URL = "http://localhost:4002";

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// AUTH
export const loginAPI = (email, password) =>
    request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

// PRODUCTOS
export const getProductosAPI = () => request("/productos");
export const getProductoByIdAPI = (id) => request(`/productos/${id}`);
export const crearProductoAPI = (datos) =>
    request("/productos", { method: "POST", body: JSON.stringify(datos) });
export const editarProductoAPI = (id, datos) =>
    request(`/productos/${id}`, { method: "PUT", body: JSON.stringify(datos) });
export const eliminarProductoAPI = (id) =>
    request(`/productos/${id}`, { method: "DELETE" });

// CARRITO
export const getCarritoAPI = () => request("/carrito");
export const agregarAlCarritoAPI = (productoId, cantidad) =>
    request("/carrito/agregar", {
        method: "POST",
        body: JSON.stringify({ productoId, cantidad }),
    });
export const vaciarCarritoAPI = () =>
    request("/carrito/vaciar", { method: "DELETE" });

// CATEGORÍAS
export const getCategoriasAPI = () => request("/categorias");

// MATERIALES
export const getMaterialesAPI = () => request("/materiales");