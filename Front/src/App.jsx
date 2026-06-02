import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navigation from "./components/Navigation";
import Home from "./views/Home";
import Productos from "./views/Productos";
import LoginSelector from "./views/LoginSelector";
import Login from "./views/Login";
import Registro from "./views/Registro";
import Perfil from "./views/Perfil";
import Favoritos from "./views/Favoritos";
import "./App.css";

function Layout({ children }) {
    return (
        <>
            <Navigation />
            <main>{children}</main>
        </>
    );
}

function AppRoutes() {
    return (
        <Routes>
            {/* Sin navbar */}
            <Route path="/login" element={<LoginSelector />} />
            <Route path="/login/usuario" element={<Login rol="usuario" />} />
            <Route path="/login/admin" element={<Login rol="admin" />} />
            <Route path="/registro" element={<Registro />} />

            {/* Con navbar */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/joyeria" element={<Layout><Productos categoria="joyeria" /></Layout>} />
            <Route path="/relojes" element={<Layout><Productos categoria="relojes" /></Layout>} />
            <Route path="/lingotes" element={<Layout><Productos categoria="lingotes" /></Layout>} />
            <Route path="/edicion-limitada" element={<Layout><Productos categoria="edicion-limitada" /></Layout>} />
            <Route path="/favoritos" element={<Layout><Favoritos /></Layout>} />
            <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </BrowserRouter>
    );
}
