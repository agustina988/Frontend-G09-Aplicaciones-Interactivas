# AUREA — Joyería & Lingotes Premium

E-commerce de joyería fina y lingotes de metales preciosos.

## Tecnologías
- React + Vite
- React Router DOM
- CSS propio

## Instrucciones para ejecutar

1. Instalar dependencias:
   npm install

2. Iniciar el servidor de desarrollo:
   npm run dev

3. Abrir en el navegador:
   http://localhost:5173

## Credenciales de prueba
- Admin: admin@aurea.com / admin1234
- Usuario: cualquier email / cualquier contraseña

## Estructura del proyecto
src/
├── assets/        → Imágenes y recursos estáticos
│   ├── home/      → Imágenes del home
│   ├── joyeria/   → Imágenes de productos de joyería
│   ├── relojes/   → Imágenes de relojes
│   └── lingotes/  → Imágenes de lingotes
├── components/    → Navigation, Footer, ProductCard, Toast
├── views/         → Todas las vistas del usuario
│   └── admin/     → Panel de administración
├── context/       → AppContext (estado global)
└── data/          → productos.js (datos mock)