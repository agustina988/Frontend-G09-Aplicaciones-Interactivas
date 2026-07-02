import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";
import { showToast } from "../ui/toastSlice";

export const fetchCarrito = createAsyncThunk("carrito/fetchCarrito", async (_, { getState, rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/carrito");
        const productos = getState().productos.items;
        const items = (data.productos || []).map((p) => {
            const prod = productos.find((pl) => pl.id === p.idProducto);
            return {
                id: p.idProducto,
                nombre: p.nombre,
                precio: p.precio,
                cantidad: p.cantidad,
                imagenes: prod?.imagenUrl ? [prod.imagenUrl] : [],
                subcategoria: prod?.subcategoria || "",
            };
        });
        return items;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo cargar el carrito");
    }
});

export const agregarAlCarrito = createAsyncThunk(
    "carrito/agregarAlCarrito",
    async (producto, { dispatch, getState, rejectWithValue }) => {
        dispatch(carritoSlice.actions.addItemLocal(producto));
        dispatch(showToast(`${producto.nombre} agregado al carrito`, "carrito"));

        const { token, usuario } = getState().auth;
        if (token && usuario?.rol !== "ROLE_ADMIN") {
            try {
                await axiosInstance.post("/carrito/agregar", { productoId: producto.id, cantidad: 1 });
            } catch (err) {
                return rejectWithValue(err.response?.data || "No se pudo sincronizar el carrito");
            }
        }
        return producto;
    }
);

export const vaciarCarrito = createAsyncThunk("carrito/vaciarCarrito", async (_, { dispatch, getState, rejectWithValue }) => {
    dispatch(carritoSlice.actions.vaciarCarritoLocal());
    const { token, usuario } = getState().auth;
    if (token && usuario?.rol !== "ROLE_ADMIN") {
        try {
            await axiosInstance.delete("/carrito/vaciar");
        } catch (err) {
            return rejectWithValue(err.response?.data || "No se pudo vaciar el carrito en el servidor");
        }
    }
});

export const confirmarCarritoBackend = createAsyncThunk(
    "carrito/confirmarCarritoBackend",
    async (_, { getState, rejectWithValue }) => {
        const { token, usuario } = getState().auth;
        if (!token || usuario?.rol === "ROLE_ADMIN") return;
        try {
            await axiosInstance.post("/carrito/confirmar");
        } catch (err) {
            return rejectWithValue(err.response?.data || "No se pudo confirmar la compra");
        }
    }
);

const carritoSlice = createSlice({
    name: "carrito",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {
        addItemLocal: (state, action) => {
            const producto = action.payload;
            const existe = state.items.find((p) => p.id === producto.id);
            if (existe) existe.cantidad += 1;
            else state.items.push({ ...producto, cantidad: 1 });
        },
        quitarDelCarrito: (state, action) => {
            state.items = state.items.filter((p) => p.id !== action.payload);
        },
        cambiarCantidad: (state, action) => {
            const { id, cantidad } = action.payload;
            if (cantidad < 1) return;
            const item = state.items.find((p) => p.id === id);
            if (item) item.cantidad = cantidad;
        },
        vaciarCarritoLocal: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarrito.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCarrito.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCarrito.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { quitarDelCarrito, cambiarCantidad } = carritoSlice.actions;
export default carritoSlice.reducer;
