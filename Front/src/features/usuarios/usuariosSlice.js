import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

export const fetchUsuarios = createAsyncThunk("usuarios/fetchUsuarios", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/usuarios");
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudieron cargar los usuarios");
    }
});

const usuariosSlice = createSlice({
    name: "usuarios",
    initialState: {
        items: [],
        loading: false,
        error: null,
        cargado: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsuarios.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsuarios.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.cargado = true;
            })
            .addCase(fetchUsuarios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.cargado = true;
            });
    },
});

export default usuariosSlice.reducer;
