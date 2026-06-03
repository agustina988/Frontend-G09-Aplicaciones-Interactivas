import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import ScrollToTop from "./components/ScrollToTop";
import Navigation from "./components/Navigation";
import Toast from "./components/Toast";

import Home from "./views/Home";
import Productos from "./views/Productos";
import DetalleProducto from "./views/DetalleProducto";
import Login from "./views/Login";
import Registro from "./views/Registro";
import Perfil from "./views/Perfil";
import Favoritos from "./views/Favoritos";
import Carrito from "./views/Carrito";
import Checkout from "./views/Checkout";
import Confirmacion from "./views/Confirmacion";
import VenderLingote from "./views/VenderLingote";

import LoginAdmin from "./views/admin/LoginAdmin";
import AdminPanel from "./views/admin/AdminPanel";
import AdminPedidos from "./views/admin/AdminPedidos";
import AdminUsuarios from "./views/admin/AdminUsuarios";
import AdminCategorias from "./views/admin/AdminCategorias";
import AdminStock from "./views/admin/AdminStock";

import "./App.css";

function Layout({ children }) {
    return (
        <>
            <Navigation />
            <main>{children}</main>
        </>
    );
}

function AdminRoute({ children }) {
    const { esAdmin, usuario } = useApp();
    if (!usuario) return <Navigate to="/login" />;
    if (!esAdmin) return <Navigate to="/" />;
    return children;
}

function AppRoutes() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/login/admin" element={<LoginAdmin />} />
                <Route path="/registro" element={<Registro />} />

                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/admin/pedidos" element={<AdminRoute><AdminPedidos /></AdminRoute>} />
                <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />
                <Route path="/admin/categorias" element={<AdminRoute><AdminCategorias /></AdminRoute>} />
                <Route path="/admin/stock" element={<AdminRoute><AdminStock /></AdminRoute>} />

                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/joyeria" element={<Layout><Productos categoria="joyeria" /></Layout>} />
                <Route path="/relojes" element={<Layout><Productos categoria="relojes" /></Layout>} />
                <Route path="/lingotes" element={<Layout><Productos categoria="lingotes" /></Layout>} />
                <Route path="/edicion-limitada" element={<Layout><Productos categoria="edicion-limitada" /></Layout>} />
                <Route path="/producto/:id" element={<Layout><DetalleProducto /></Layout>} />
                <Route path="/vender-lingote" element={<Layout><VenderLingote /></Layout>} />
                <Route path="/favoritos" element={<Layout><Favoritos /></Layout>} />
                <Route path="/carrito" element={<Layout><Carrito /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/confirmacion" element={<Layout><Confirmacion /></Layout>} />
                <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRoutes />
                <Toast />
            </AppProvider>
        </BrowserRouter>
    );
}
