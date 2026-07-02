import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";


const mapearProducto = (b) => ({
    id: b.id,
    nombre: b.nombre,
    descripcion: b.descripcion || "",
    precio: b.precio,
    stock: b.stock,
    categoriaId: b.categoria?.id ?? null,
    categoriaNombre: b.categoria?.nombre || "Sin categoría",
    categoriaSlug: b.categoria?.slug || "",
    subcategoria: b.subcategoria || "",
    materiales: b.materiales?.map((m) => m.nombre || m.name) || [],
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
});

export const fetchProductos = createAsyncThunk("productos/fetchProductos", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/productos");
        return data.map(mapearProducto);
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudieron cargar los productos");
    }
});

export const crearProducto = createAsyncThunk("productos/crearProducto", async (datos, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/productos", datos);
        return mapearProducto(data);
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo crear el producto");
    }
});

export const crearImagenProducto = createAsyncThunk("productos/crearImagenProducto", async ({ productoId, url }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/imagenes", {
            url,
            esPrincipal: true,
            producto: { id: productoId },
        });
        return { productoId, url: data.url };
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo guardar la imagen");
    }
});

export const editarStockProducto = createAsyncThunk("productos/editarStockProducto", async ({ id, stock }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put(`/productos/${id}/stock`, { stock });
        return mapearProducto(data);
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo actualizar el stock");
    }
});

export const eliminarProducto = createAsyncThunk("productos/eliminarProducto", async (id, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/productos/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo eliminar el producto");
    }
});

const productosSlice = createSlice({
    name: "productos",
    initialState: {
        items: [],
        loading: false,
        error: null,
        cargado: false,
    },
    reducers: {
        restarStockLocal: (state, action) => {
            action.payload.forEach(({ id, cantidad }) => {
                const p = state.items.find((i) => i.id === id);
                if (p) p.stock = Math.max(0, p.stock - cantidad);
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductos.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.cargado = true;
            })
            .addCase(fetchProductos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.cargado = true;
            })
            .addCase(crearProducto.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(crearImagenProducto.fulfilled, (state, action) => {
                const p = state.items.find((i) => i.id === action.payload.productoId);
                if (p) {
                    p.imagenUrl = action.payload.url;
                    p.imagenes = [action.payload.url];
                }
            })
            .addCase(editarStockProducto.fulfilled, (state, action) => {
                const idx = state.items.findIndex((p) => p.id === action.payload.id);
                if (idx !== -1) state.items[idx] = { ...state.items[idx], stock: action.payload.stock };
            })
            .addCase(eliminarProducto.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.payload);
            });
    },
});

export const { restarStockLocal } = productosSlice.actions;
export default productosSlice.reducer;
