import { useNavigate } from "react-router-dom";
import "./LoginSelector.css";

export default function LoginSelector() {
    const navigate = useNavigate();

    return (
        <div className="login-sel-page">
            <div className="login-sel-logo">AUREA</div>

            <h1 className="login-sel-title">Acceso Exclusivo</h1>
            <p className="login-sel-sub">Seleccione su portal de entrada a la excelencia.</p>

            <div className="login-sel-cards">
                <button className="login-sel-card" onClick={() => navigate("/login/usuario")}>
                    <div className="login-sel-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <p className="login-sel-card-title">Cliente AUREA</p>
                    <p className="login-sel-card-desc">Acceda a sus adquisiciones y piezas deseadas</p>
                    <span className="login-sel-link">ENTRAR AL ATELIER</span>
                </button>

                <button className="login-sel-card" onClick={() => navigate("/login/admin")}>
                    <div className="login-sel-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            <circle cx="12" cy="16" r="1" fill="currentColor"/>
                        </svg>
                    </div>
                    <p className="login-sel-card-title">Administrador</p>
                    <p className="login-sel-card-desc">Gestión de inventario y operaciones exclusivas</p>
                    <span className="login-sel-link">ACCESO DE GESTIÓN</span>
                </button>
            </div>

            <div className="login-sel-footer">
        <span className="login-sel-cert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          GIA CERTIFIED &amp; FEDERATED GUILD
        </span>
                <p className="login-sel-copy">© 2024 AUREA PRECISION HOROLOGY &amp; FINE JEWELRY. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    );
}
