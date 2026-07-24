import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

export const fetchCupones = createAsyncThunk("cupones/fetchCupones", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/cupones");
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudieron cargar los cupones");
    }
});

export const crearCupon = createAsyncThunk("cupones/crearCupon", async (datos, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/cupones", datos);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo crear el cupón");
    }
});

export const eliminarCupon = createAsyncThunk("cupones/eliminarCupon", async (id, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/cupones/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo eliminar el cupón");
    }
});

export const validarCupon = createAsyncThunk("cupones/validarCupon", async (codigo, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get(`/cupones/validar/${encodeURIComponent(codigo.toUpperCase())}`);
        return data;
    } catch (err) {
        return rejectWithValue("Cupón inválido o vencido.");
    }
});

const cuponesSlice = createSlice({
    name: "cupones",
    initialState: {
        items: [],
        cuponAplicado: null,
        loading: false,
        error: null,
        errorValidacion: null,
        // NUEVO: igual que productos/usuarios/pedidos. Si ya se pidió una vez,
        // entrar y salir de la pantalla de cupones no vuelve a gettear.
        cargado: false,
    },
    reducers: {
        quitarCuponAplicado: (state) => {
            state.cuponAplicado = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCupones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCupones.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.cargado = true;
            })
            .addCase(fetchCupones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.cargado = true;
            })
            .addCase(crearCupon.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(eliminarCupon.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c.id !== action.payload);
            })
            .addCase(validarCupon.pending, (state) => {
                state.errorValidacion = null;
            })
            .addCase(validarCupon.fulfilled, (state, action) => {
                state.cuponAplicado = { codigo: action.payload.codigo, descuento: action.payload.descuento };
                state.errorValidacion = null;
            })
            .addCase(validarCupon.rejected, (state, action) => {
                state.errorValidacion = action.payload || action.error.message;
            });
    },
});

export const { quitarCuponAplicado } = cuponesSlice.actions;
export default cuponesSlice.reducer;