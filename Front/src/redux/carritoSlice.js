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

const carritoSlice = createSlice({
  name: "carrito",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarrito.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(addProductoCarrito.fulfilled, (state, action) => {
        const existe = state.items.find(p => p.productoId === action.payload.productoId);
        if (existe) {
            existe.cantidad += action.payload.cantidad;
        } else {
            state.items.push(action.payload);
        }
      })
      .addCase(vaciarCarrito.fulfilled, (state) => { state.items = []; });
  },
});

export default carritoSlice.reducer;