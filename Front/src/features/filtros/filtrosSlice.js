import { createSlice } from "@reduxjs/toolkit";

// Todo lo que antes era estado "de front" (useState sueltos en Navigation y
// en Productos, equivalente a guardar cosas solo en el navegador) ahora vive
// acá, en Redux, como cualquier otra tabla de la app.
const filtrosSlice = createSlice({
    name: "filtros",
    initialState: {
        // Texto del buscador del navbar
        busqueda: "",
        // Filtros de la vista Productos, guardados por categoría
        // (joyeria, relojes, lingotes, edicion-limitada)
        porCategoria: {},
    },
    reducers: {
        setBusqueda: (state, action) => {
            state.busqueda = action.payload;
        },
        limpiarBusqueda: (state) => {
            state.busqueda = "";
        },
        setFiltroCategoria: (state, action) => {
            const { categoria, filtros } = action.payload;
            state.porCategoria[categoria] = {
                ...(state.porCategoria[categoria] || {}),
                ...filtros,
            };
        },
        resetFiltroCategoria: (state, action) => {
            const { categoria, precioMax } = action.payload;
            state.porCategoria[categoria] = {
                subcat: null,
                materiales: [],
                orden: "relevancia",
                precioMax,
            };
        },
    },
});

export const { setBusqueda, limpiarBusqueda, setFiltroCategoria, resetFiltroCategoria } = filtrosSlice.actions;
export default filtrosSlice.reducer;
