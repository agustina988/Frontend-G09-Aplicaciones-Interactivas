import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import Navigation from "./components/Navigation";
import Toast from "./components/Toast";
import BackendStatus from "./components/BackendStatus";
import Swal from "sweetalert2";
import { useEffect } from "react";

import { fetchProductos } from "./features/productos/productosSlice";
import { fetchCategorias } from "./features/categorias/categoriasSlice";
import { fetchCarrito } from "./features/carrito/carritoSlice";
import { fetchPedidos } from "./features/pedidos/pedidosSlice";

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
import Informacion from "./views/Informacion";

import LoginAdmin from "./views/admin/LoginAdmin";
import AdminPanel from "./views/admin/AdminPanel";
import AdminPedidos from "./views/admin/AdminPedidos";
import AdminUsuarios from "./views/admin/AdminUsuarios";
import AdminCategorias from "./views/admin/AdminCategorias";
import AdminStock from "./views/admin/AdminStock";
import AdminProductos from "./views/admin/AdminProductos";
import AdminCupones from "./views/admin/AdminCupones";

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
    const usuario = useSelector((state) => state.auth.usuario);
    const esAdmin = usuario?.rol === "ROLE_ADMIN";
    if (!usuario) return <Navigate to="/login" />;
    if (!esAdmin) return <Navigate to="/" />;
    return children;
}

// El admin no compra: ni siquiera puede entrar a estas rutas navegando
// directamente por URL. Nada de carrito, nada de checkout, nada de nada.
function SinAdminRoute({ children }) {
    const usuario = useSelector((state) => state.auth.usuario);
    const esAdmin = usuario?.rol === "ROLE_ADMIN";
    if (esAdmin) return <Navigate to="/admin" />;
    return children;
}

function PrivateRoute({ children }) {
    const usuario = useSelector((state) => state.auth.usuario);
    const navigate = useNavigate();

    useEffect(() => {
        if (!usuario) {
            Swal.fire({
                title: "Acceso Restringido",
                text: "Necesitas iniciar sesión para ver esta sección.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#D4AF37",
                cancelButtonColor: "#333333",
                confirmButtonText: "Ir a Login",
                cancelButtonText: "Volver atrás",
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                } else if (result.isDismissed) {
                    navigate("/");
                }
            });
        }
    }, [usuario, navigate]);

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
                <Route path="/admin/productos" element={<AdminRoute><AdminProductos /></AdminRoute>} />
                <Route path="/admin/cupones" element={<AdminRoute><AdminCupones /></AdminRoute>} />

                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/producto/:id" element={<Layout><DetalleProducto /></Layout>} />
                <Route path="/informacion/:tipo" element={<Layout><Informacion /></Layout>} />

                <Route path="/joyeria" element={<Layout><Productos key="joyeria" categoria="joyeria" /></Layout>} />
                <Route path="/relojes" element={<Layout><Productos key="relojes" categoria="relojes" /></Layout>} />
                <Route path="/lingotes" element={<Layout><Productos key="lingotes" categoria="lingotes" /></Layout>} />
                <Route path="/edicion-limitada" element={<Layout><Productos key="edicion" categoria="edicion-limitada" /></Layout>} />

                <Route path="/carrito" element={<Layout><PrivateRoute><SinAdminRoute><Carrito /></SinAdminRoute></PrivateRoute></Layout>} />
                <Route path="/perfil" element={<Layout><PrivateRoute><Perfil /></PrivateRoute></Layout>} />
                <Route path="/favoritos" element={<Layout><PrivateRoute><Favoritos /></PrivateRoute></Layout>} />
                <Route path="/checkout" element={<Layout><PrivateRoute><SinAdminRoute><Checkout /></SinAdminRoute></PrivateRoute></Layout>} />
                <Route path="/confirmacion" element={<Layout><PrivateRoute><SinAdminRoute><Confirmacion /></SinAdminRoute></PrivateRoute></Layout>} />
            </Routes>
        </>
    );
}

export default function App() {
    const dispatch = useDispatch();
    const cargado = useSelector((state) => state.productos.cargado);
    const token = useSelector((state) => state.auth.token);
    const rol = useSelector((state) => state.auth.usuario?.rol);
    const cargadoAdmin = useSelector((state) => state.pedidos.cargadoAdmin);

    useEffect(() => {
        if (!cargado) {
            dispatch(fetchProductos());
            dispatch(fetchCategorias());
        }
    }, [cargado, dispatch]);

    useEffect(() => {
        if (token && rol !== "ROLE_ADMIN") dispatch(fetchCarrito());
    }, [token]);

    useEffect(() => {
        // Se pide una sola vez por sesión: si ya está cargado (cargadoAdmin),
        // no se vuelve a gettear solo porque el componente se vuelva a montar.
        if (token && rol === "ROLE_ADMIN" && !cargadoAdmin) dispatch(fetchPedidos());
    }, [token, rol, cargadoAdmin, dispatch]);

    return (
        <BrowserRouter>
            <AppRoutes />
            <Toast />
            <BackendStatus />
        </BrowserRouter>
    );
}