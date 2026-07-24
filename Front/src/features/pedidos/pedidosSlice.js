import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";
import { vaciarCarrito } from "../carrito/carritoSlice";
// ELIMINADO: import { restarStockLocal } from "../productos/productosSlice"; 
// El stock ahora lo maneja exclusivamente el backend para evitar desincronización.

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
        const { carrito, auth, cupones } = getState();
        const carritoSnapshot = [...carrito.items];

        if (carritoSnapshot.length === 0) {
            return rejectWithValue("El carrito está vacío");
        }

        // 1. Construcción del Payload. 
        // Solo enviamos referencias (IDs), cantidades y datos de contacto.
        // Los precios y cálculos totales se procesan en el servidor.
        const payloadBackend = {
            direccionEnvio: datosEnvio?.direccion || auth.usuario?.direccion || "",
            emailContacto: auth.usuario?.email || datosEnvio?.email || "",
            cuponAplicado: cupones.cuponAplicado?.codigo || null,
            productos: carritoSnapshot.map((p) => ({
                idProducto: p.id,
                cantidad: p.cantidad
            }))
        };

        // 2. Ejecutar la llamada real al backend.
        const resultado = await dispatch(crearPedidoBackend(payloadBackend));

        if (crearPedidoBackend.fulfilled.match(resultado)) {
            // 3. Limpiar estado local solo si el backend confirmó la transacción con éxito.
            dispatch(vaciarCarrito());
            
            // Retornamos el objeto Pedido real que generó y respondió la base de datos.
            return resultado.payload; 
        } else {
            return rejectWithValue(resultado.payload || "Error al procesar la compra en el servidor");
        }
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
        actualizandoEstado: false,
        errorEstado: null,
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
            .addCase(cambiarEstadoPedido.pending, (state) => {
                state.actualizandoEstado = true;
                state.errorEstado = null;
            })
            .addCase(cambiarEstadoPedido.fulfilled, (state, action) => {
                state.actualizandoEstado = false;
                const idx = state.adminList.findIndex((p) => p.id === action.payload.id);
                if (idx !== -1) state.adminList[idx] = action.payload;
            })
            .addCase(cambiarEstadoPedido.rejected, (state, action) => {
                state.actualizandoEstado = false;
                state.errorEstado = action.payload || action.error.message;
            })
            .addCase(confirmarCompra.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmarCompra.fulfilled, (state, action) => {
                state.loading = false;
                // El action.payload ahora contiene el JSON completo que envió el backend
                // con el total real, el ID real de base de datos y los detalles validados.
                state.ultimoPedido = action.payload; 
            })
            .addCase(confirmarCompra.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default pedidosSlice.reducer;