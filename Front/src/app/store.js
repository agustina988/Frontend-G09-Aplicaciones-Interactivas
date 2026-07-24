import { configureStore, combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import productosReducer from "../features/productos/productosSlice";
import categoriasReducer from "../features/categorias/categoriasSlice";
import carritoReducer from "../features/carrito/carritoSlice";
import favoritosReducer from "../features/favoritos/favoritosSlice";
import cuponesReducer from "../features/cupones/cuponesSlice";
import pedidosReducer from "../features/pedidos/pedidosSlice";
import usuariosReducer from "../features/usuarios/usuariosSlice";
import filtrosReducer from "../features/filtros/filtrosSlice";
import uiReducer from "../features/ui/toastSlice";
import { setTokenGetter } from "./axiosInstance";

// Antes: el rootReducer se envolvía con persistReducer (redux-persist),
// que guardaba "auth" y "favoritos" en localStorage por debajo.
// Ahora: ni Context, ni localStorage. Todo el estado vive únicamente
// en memoria, adentro del store de Redux, tal como pidió la profe.
const rootReducer = combineReducers({
    auth: authReducer,
    productos: productosReducer,
    categorias: categoriasReducer,
    carrito: carritoReducer,
    favoritos: favoritosReducer,
    cupones: cuponesReducer,
    pedidos: pedidosReducer,
    usuarios: usuariosReducer,
    filtros: filtrosReducer,
    ui: uiReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

setTokenGetter(() => store.getState().auth.token);