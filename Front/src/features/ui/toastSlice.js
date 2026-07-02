import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: "ui",
    initialState: {
        toasts: [],
    },
    reducers: {
        addToast: (state, action) => {
            state.toasts.push(action.payload);
        },
        marcarSaliendo: (state, action) => {
            const t = state.toasts.find((t) => t.id === action.payload);
            if (t) t.saliendo = true;
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
    },
});

export const { addToast, marcarSaliendo, removeToast } = toastSlice.actions;

export const showToast = (msg, tipo = "carrito") => (dispatch) => {
    const id = Date.now() + Math.random();
    dispatch(addToast({ id, msg, tipo, saliendo: false }));
    setTimeout(() => dispatch(marcarSaliendo(id)), 3000);
    setTimeout(() => dispatch(removeToast(id)), 3400);
};

export default toastSlice.reducer;
