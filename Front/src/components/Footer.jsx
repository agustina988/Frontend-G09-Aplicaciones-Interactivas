import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import Swal from 'sweetalert2'

export default function Footer() {
    
    const [email, setEmail] = useState("");
    const [suscrito, setSuscrito] = useState(false);

    const handleUnirse = () => {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (emailValido) {
            setSuscrito(true);
            setEmail("");
            
            Swal.fire({
                title: "¡Gracias!",
                text: "Te uniste a la comunidad AUREA.",
                icon: "success"
            });
            
            setTimeout(() => setSuscrito(false), 4000);} 
            else {
            Swal.fire({
                title: "Oops...",
                text: "Por favor, ingresa un correo electrónico válido.",
                icon: "error"
            });
        }
};

    return (
        <footer className="footer">
            <div className="footer-newsletter">
                <div className="footer-newsletter-box">
                    <div className="footer-newsletter-inner">
                        <p className="footer-newsletter-label">EXCLUSIVIDAD</p>
                        <h2>Se parte de AUREA</h2>
                        <p className="footer-newsletter-desc">
                            Sé la primera persona en descubrir las nuevas colecciones, piezas exclusivas y lanzamientos limitados de joyería y lingotes premium.<br />
                            Recibí beneficios especiales, acceso anticipado y novedades de nuestra marca directamente en tu correo.
                        </p>
                        {suscrito ? (
                            <div className="footer-newsletter-exito">
                                ✓ ¡Gracias! Te uniste a la comunidad AUREA.
                            </div>
                        ) : (
                            <div className="footer-newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Tu dirección de correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button onClick={handleUnirse}>UNIRSE</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-main">
                <div className="footer-brand">
                    <p className="footer-logo">AUREA</p>
                    <p className="footer-tagline">La excelencia en metales preciosos y joyería fina desde 1980. Tradición y valor en cada gramo.</p>
                </div>
                <div className="footer-col">
                    <p className="footer-col-title">COLECCIONES</p>
                    <Link to="/joyeria">Joyería</Link>
                    <Link to="/relojes">Relojes</Link>
                    <Link to="/lingotes">Lingotes de Oro</Link>
                </div>
                <div className="footer-col">
                    <p className="footer-col-title">INVERSIÓN</p>
                    <Link to="/informacion/precios">Precios en Vivo</Link>
                    <Link to="/informacion/boveda">Bóveda Segura</Link>
                    <Link to="/informacion/abastecimiento">Abastecimiento Ético</Link>
                    <Link to="/informacion/mercado">Análisis de Mercado</Link>
                </div>
                <div className="footer-col">
                    <p className="footer-col-title">SOPORTE</p>
                    <Link to="/informacion/privacidad">Política de Privacidad</Link>
                    <Link to="/informacion/terminos">Términos de Servicio</Link>
                    <Link to="/informacion/contacto">Contáctenos</Link>
                    <Link to="/informacion/envios">Envíos y Devoluciones</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 AUREA. Todos los derechos reservados.</p>
                <p>Diseñado con exclusividad para coleccionistas y amantes del lujo.</p>
            </div>

        </footer>
    );
}