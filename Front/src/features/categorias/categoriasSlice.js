import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";

const mapearCategoria = (c) => ({
    id: c.id,
    nombre: c.nombre,
    slug: c.slug || "",
    desc: c.descripcion || "",
    publicado: c.publicado,
});

export const fetchCategorias = createAsyncThunk("categorias/fetchCategorias", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/categories");
        return data.map(mapearCategoria);
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudieron cargar las categorías");
    }
});

export const crearCategoria = createAsyncThunk("categorias/crearCategoria", async (cat, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/categories", {
            nombre: cat.nombre,
            slug: cat.slug,
            descripcion: cat.desc || "",
            publicado: true,
        });
        return mapearCategoria(data);
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo crear la categoría");
    }
});

export const editarCategoria = createAsyncThunk("categorias/editarCategoria", async ({ id, datos }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put(`/categories/${id}`, {
            nombre: datos.nombre,
            slug: datos.slug,
            descripcion: datos.desc || "",
            publicado: datos.publicado ?? true,
        });
        return mapearCategoria(data);
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo editar la categoría");
    }
});

export const eliminarCategoria = createAsyncThunk("categorias/eliminarCategoria", async (id, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/categories/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo eliminar la categoría");
    }
});

const categoriasSlice = createSlice({
    name: "categorias",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategorias.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategorias.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategorias.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(crearCategoria.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(editarCategoria.fulfilled, (state, action) => {
                const idx = state.items.findIndex((c) => c.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(eliminarCategoria.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c.id !== action.payload);
            });
    },
});

export default categoriasSlice.reducer;
