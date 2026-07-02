import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";

const contenidoPorTipo = {
  privacidad: {
    titulo: "Política de Privacidad",
    descripcion: "Tu información personal se maneja con confidencialidad y se utiliza únicamente para brindar una experiencia segura y personalizada.",
  },
  terminos: {
    titulo: "Términos de Servicio",
    descripcion: "Al utilizar AUREA, aceptas nuestras condiciones de compra, uso de la plataforma y políticas de confidencialidad.",
  },
  contacto: {
    titulo: "Contáctenos",
    descripcion: "Podés escribirnos por correo a contacto@aurea.com o completar nuestro formulario de contacto para recibir asesoramiento.",
  },
  envios: {
    titulo: "Envíos y Devoluciones",
    descripcion: "Ofrecemos entrega segura y seguimiento en tiempo real. Las devoluciones están sujetas a las condiciones de cada pieza y compra.",
  },
  precios: {
    titulo: "Precios en Vivo",
    descripcion: "Consultá valores actualizados del mercado, cotizaciones de metales preciosos y tendencias de inversión para tomar decisiones informadas.",
  },
  boveda: {
    titulo: "Bóveda Segura",
    descripcion: "Nuestras piezas y lingotes se almacenan en instalaciones de alta seguridad con control de acceso, monitoreo continuo y protocolos de custodia premium.",
  },
  abastecimiento: {
    titulo: "Abastecimiento Ético",
    descripcion: "Trabajamos con proveedores certificados y procesos transparentes para asegurar origen responsable y calidad premium.",
  },
  mercado: {
    titulo: "Análisis de Mercado",
    descripcion: "Te compartimos información relevante sobre tendencias del mercado, valor de metales preciosos y oportunidades de inversión.",
  },
};

export default function Informacion() {
  const { tipo = "privacidad" } = useParams();
  const contenido = contenidoPorTipo[tipo] || contenidoPorTipo.privacidad;

  return (
    <>
      <section style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem 1.5rem", color: "#1f1f1f" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{contenido.titulo}</h1>
        <p style={{ lineHeight: 1.7, marginBottom: "1.5rem" }}>{contenido.descripcion}</p>
        <Link to="/" style={{ color: "#b08d2b", fontWeight: 600 }}>
          Volver al inicio
        </Link>
      </section>
      <Footer />
    </>
  );
}
