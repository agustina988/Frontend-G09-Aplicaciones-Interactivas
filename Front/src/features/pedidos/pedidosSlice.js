import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";
import { confirmarCarritoBackend, vaciarCarrito } from "../carrito/carritoSlice";
import { restarStockLocal } from "../productos/productosSlice";

export const fetchPedidos = createAsyncThunk("pedidos/fetchPedidos", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/pedidos");
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudieron cargar los pedidos");
    }
});

export const fetchMisPedidos = createAsyncThunk("pedidos/fetchMisPedidos", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/pedidos/mis-pedidos");
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudieron cargar tus pedidos");
    }
});

const crearPedidoBackend = createAsyncThunk("pedidos/crearPedidoBackend", async (datos, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/pedidos", datos);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo guardar el pedido");
    }
});

export const cambiarEstadoPedido = createAsyncThunk("pedidos/cambiarEstadoPedido", async ({ id, estado }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put(`/pedidos/${id}/estado`, { estado });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo cambiar el estado del pedido");
    }
});

export const confirmarCompra = createAsyncThunk(
    "pedidos/confirmarCompra",
    async (datosEnvio, { dispatch, getState, rejectWithValue }) => {
        const { carrito, auth } = getState();
        const carritoSnapshot = [...carrito.items];
        const subtotal = carritoSnapshot.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
        const descuento = getState().cupones.cuponAplicado
            ? Math.round(subtotal * getState().cupones.cuponAplicado.descuento / 100)
            : 0;
        const total = subtotal - descuento;

        await dispatch(confirmarCarritoBackend());

        let pedidoBackend = null;
        if (auth.token) {
            const resultado = await dispatch(crearPedidoBackend({
                total,
                direccionEnvio: datosEnvio?.direccion || auth.usuario?.direccion || "",
                productos: carritoSnapshot.map((p) => ({
                    idProducto: p.id,
                    nombreProducto: p.nombre,
                    precioUnitario: p.precio,
                    cantidad: p.cantidad,
                })),
            }));
            if (crearPedidoBackend.fulfilled.match(resultado)) {
                pedidoBackend = resultado.payload;
            } else {
                return rejectWithValue(resultado.payload || "No se pudo guardar el pedido");
            }
        }

        dispatch(restarStockLocal(carritoSnapshot.map((c) => ({ id: c.id, cantidad: c.cantidad }))));
        dispatch(vaciarCarrito());

        return {
            id: pedidoBackend ? `#${pedidoBackend.id}` : "#" + Math.floor(1000 + Math.random() * 9000),
            idReal: pedidoBackend?.id,
            cliente: auth.usuario?.nombre || auth.usuario?.email || "Cliente",
            email: auth.usuario?.email || "",
            fecha: new Date().toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }),
            total,
            estado: "PENDIENTE",
            productos: carritoSnapshot,
            direccion: datosEnvio?.direccion || auth.usuario?.direccion || "",
        };
    }
);

const pedidosSlice = createSlice({
    name: "pedidos",
    initialState: {
        adminList: [],
        misPedidos: [],
        ultimoPedido: null,
        loading: false,
        error: null,
        cargadoAdmin: false,
        cargadoMisPedidos: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPedidos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPedidos.fulfilled, (state, action) => {
                state.loading = false;
                state.adminList = action.payload;
                state.cargadoAdmin = true;
            })
            .addCase(fetchPedidos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.cargadoAdmin = true;
            })
            .addCase(fetchMisPedidos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMisPedidos.fulfilled, (state, action) => {
                state.loading = false;
                state.misPedidos = action.payload;
                state.cargadoMisPedidos = true;
            })
            .addCase(fetchMisPedidos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.cargadoMisPedidos = true;
            })
            .addCase(cambiarEstadoPedido.fulfilled, (state, action) => {
                const idx = state.adminList.findIndex((p) => p.id === action.payload.id);
                if (idx !== -1) state.adminList[idx] = action.payload;
            })
            .addCase(confirmarCompra.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmarCompra.fulfilled, (state, action) => {
                state.loading = false;
                state.ultimoPedido = action.payload;
            })
            .addCase(confirmarCompra.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default pedidosSlice.reducer;
