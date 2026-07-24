import { createSlice } from "@reduxjs/toolkit";

const TODAS_CATEGORIAS = "Todas las Categorías";

// Todo lo que antes era estado "de front" (useState sueltos en Navigation,
// en Productos, y en las pantallas de admin) ahora vive acá, en Redux,
// como cualquier otra tabla de la app.
const filtrosSlice = createSlice({
    name: "filtros",
    initialState: {
        // Texto del buscador del navbar
        busqueda: "",
        // Filtros de la vista Productos, guardados por categoría
        // (joyeria, relojes, lingotes, edicion-limitada)
        porCategoria: {},

        // --- Buscadores del panel de administración ---
        // (antes eran useState locales en cada componente de admin)
        adminStockBusqueda: "",
        adminStockCategoria: TODAS_CATEGORIAS,
        adminUsuariosBusqueda: "",
        adminPedidosBusqueda: "",
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

        // --- Reducers de los buscadores de admin ---
        setAdminStockBusqueda: (state, action) => {
            state.adminStockBusqueda = action.payload;
        },
        setAdminStockCategoria: (state, action) => {
            state.adminStockCategoria = action.payload;
        },
        setAdminUsuariosBusqueda: (state, action) => {
            state.adminUsuariosBusqueda = action.payload;
        },
        setAdminPedidosBusqueda: (state, action) => {
            state.adminPedidosBusqueda = action.payload;
        },
    },
});

export const {
    setBusqueda,
    limpiarBusqueda,
    setFiltroCategoria,
    resetFiltroCategoria,
    setAdminStockBusqueda,
    setAdminStockCategoria,
    setAdminUsuariosBusqueda,
    setAdminPedidosBusqueda,
} = filtrosSlice.actions;

export const TODAS = TODAS_CATEGORIAS;

export default filtrosSlice.reducer;