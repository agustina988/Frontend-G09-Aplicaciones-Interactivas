import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../app/axiosInstance";


export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/auth/login", { email, password });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Email o contraseña incorrectos");
    }
});

export const registrarUsuario = createAsyncThunk("auth/registrarUsuario", async (datos, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post("/auth/registro", datos);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo registrar el usuario");
    }
});

export const fetchPerfil = createAsyncThunk("auth/fetchPerfil", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get("/usuarios/perfil");
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo cargar el perfil");
    }
});

export const actualizarPerfil = createAsyncThunk("auth/actualizarPerfil", async (datos, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.put("/usuarios/perfil", datos);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data || "No se pudo actualizar el perfil");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        usuario: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.usuario = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.usuario = {
                    id: action.payload.id,
                    nombre: action.payload.nombre,
                    email: action.payload.email,
                    telefono: action.payload.telefono || "",
                    direccion: action.payload.direccion || "",
                    rol: action.payload.rol,
                    miembro: action.payload.rol === "ROLE_ADMIN" ? "ADMINISTRADOR" : "MEMBER",
                    desde: new Date().getFullYear().toString(),
                };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // REGISTRO
            .addCase(registrarUsuario.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registrarUsuario.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.usuario = {
                    id: action.payload.id,
                    nombre: action.payload.nombre,
                    email: action.payload.email,
                    telefono: action.payload.telefono || "",
                    direccion: action.payload.direccion || "",
                    rol: action.payload.rol || "ROLE_USER",
                    miembro: "MEMBER",
                    desde: new Date().getFullYear().toString(),
                };
            })
            .addCase(registrarUsuario.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // PERFIL (GET)
            .addCase(fetchPerfil.fulfilled, (state, action) => {
                if (state.usuario) {
                    state.usuario.nombre = action.payload.nombre || state.usuario.nombre;
                    state.usuario.telefono = action.payload.telefono || state.usuario.telefono;
                    state.usuario.direccion = action.payload.direccion || state.usuario.direccion;
                }
            })
            // PERFIL (PUT)
            .addCase(actualizarPerfil.fulfilled, (state, action) => {
                if (state.usuario) {
                    state.usuario.nombre = action.payload.nombre || state.usuario.nombre;
                    state.usuario.telefono = action.payload.telefono || state.usuario.telefono;
                    state.usuario.direccion = action.payload.direccion || state.usuario.direccion;
                }
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
