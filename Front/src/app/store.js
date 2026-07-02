import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice";
import productosReducer from "../features/productos/productosSlice";
import categoriasReducer from "../features/categorias/categoriasSlice";
import carritoReducer from "../features/carrito/carritoSlice";
import favoritosReducer from "../features/favoritos/favoritosSlice";
import cuponesReducer from "../features/cupones/cuponesSlice";
import pedidosReducer from "../features/pedidos/pedidosSlice";
import usuariosReducer from "../features/usuarios/usuariosSlice";
import uiReducer from "../features/ui/toastSlice";
import { setTokenGetter } from "./axiosInstance";

const rootReducer = combineReducers({
    auth: authReducer,
    productos: productosReducer,
    categorias: categoriasReducer,
    carrito: carritoReducer,
    favoritos: favoritosReducer,
    cupones: cuponesReducer,
    pedidos: pedidosReducer,
    usuarios: usuariosReducer,
    ui: uiReducer,
});

const persistConfig = {
    key: "aurea-root",
    storage,
    whitelist: ["auth", "favoritos"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

setTokenGetter(() => store.getState().auth.token);

export const persistor = persistStore(store);