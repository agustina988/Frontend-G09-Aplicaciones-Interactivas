import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/carrito";

export const fetchCarrito = createAsyncThunk("carrito/fetchCarrito", async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(URL, { headers: { Authorization: `Bearer ${token}` } });
  return data.productos || []; 
});

export const addProductoCarrito = createAsyncThunk("carrito/addProducto", async (payload) => {
  const token = localStorage.getItem("token");
  await axios.post(`${URL}/agregar`, payload, { headers: { Authorization: `Bearer ${token}` } });
  return payload;
});

export const vaciarCarrito = createAsyncThunk("carrito/vaciar", async () => {
  const token = localStorage.getItem("token");
  await axios.delete(`${URL}/vaciar`, { headers: { Authorization: `Bearer ${token}` } });
  return [];
});

export const quitarDelCarrito = createAsyncThunk("carrito/quitarProducto", async (productoId) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${URL}/eliminar/${productoId}`, { headers: { Authorization: `Bearer ${token}` } });
  return productoId;
});

export const cambiarCantidad = createAsyncThunk("carrito/cambiarCantidad", async ({ id, cantidad }) => {
  const token = localStorage.getItem("token");
  await axios.put(`${URL}/actualizar/${id}`, { cantidad }, { headers: { Authorization: `Bearer ${token}` } });
  return { id, cantidad };
});

const carritoSlice = createSlice({
  name: "carrito",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
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
        state.error = action.error.message;
      })
      .addCase(addProductoCarrito.fulfilled, (state, action) => {
        const existe = state.items.find(p => p.productoId === action.payload.productoId);
        if (existe) {
            existe.cantidad += action.payload.cantidad;
        } else {
            state.items.push(action.payload);
        }
      })
      .addCase(vaciarCarrito.fulfilled, (state) => { 
        state.items = []; 
      })
      .addCase(quitarDelCarrito.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(cambiarCantidad.fulfilled, (state, action) => {
        const item = state.items.find(p => p.id === action.payload.id);
        if (item && action.payload.cantidad > 0) {
            item.cantidad = action.payload.cantidad;
        }
      });
  },
});

export default carritoSlice.reducer;