import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:4002/productos";

export const fetchProductos = createAsyncThunk("productos/fetchProductos", async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(URL, { headers: { Authorization: `Bearer ${token}` } });
  return data;
});

export const updateStockProducto = createAsyncThunk("productos/updateStock", async ({ id, nuevoStock }) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(`${URL}/${id}`, { stock: nuevoStock }, { headers: { Authorization: `Bearer ${token}` } });
  return data;
});

const productoSlice = createSlice({
  name: "productos",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductos.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProductos.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateStockProducto.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) { state.items[index] = action.payload; }
      });
  },
});

export default productoSlice.reducer;