import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productoReducer from "./productoSlice";
import carritoReducer from "./carritoSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    productos: productoReducer,
    carrito: carritoReducer,
  },
});