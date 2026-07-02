import { createSlice } from "@reduxjs/toolkit";
import { showToast } from "../ui/toastSlice";

const favoritosSlice = createSlice({
    name: "favoritos",
    initialState: {
        items: [],
    },
    reducers: {
        agregarFavoritoLocal: (state, action) => {
            state.items.push(action.payload);
        },
        quitarFavoritoLocal: (state, action) => {
            state.items = state.items.filter((p) => p.id !== action.payload);
        },
    },
});

const { agregarFavoritoLocal, quitarFavoritoLocal } = favoritosSlice.actions;

export const toggleFavorito = (producto) => (dispatch, getState) => {
    const existe = getState().favoritos.items.find((p) => p.id === producto.id);
    if (existe) {
        dispatch(quitarFavoritoLocal(producto.id));
        dispatch(showToast(`${producto.nombre} quitado de favoritos`, "favorito-off"));
    } else {
        dispatch(agregarFavoritoLocal(producto));
        dispatch(showToast(`${producto.nombre} guardado en favoritos`, "favorito"));
    }
};

export default favoritosSlice.reducer;
