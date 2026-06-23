Aplicación de recetas con Next.js 16, TypeScript, MongoDB, Mongoose, JWT con JOSE, React Context, MUI, Zod, Nodemailer y bcryptjs.

## Getting Started

1. Copia `.env.example` a `.env.local` y completa las variables.
2. Instala dependencias con `npm install`.
3. Ejecuta `npm run dev`.

## Seed

Ejecuta `npm run seed` para cargar 10 recetas iniciales.

## Arquitectura

Presentation -> API Routes -> Services -> Models -> MongoDB.

Toda interacción con MongoDB pasa por services.

## Rutas

- `/` catálogo público
- `/recipes/[id]` detalle de receta
- `/register` registro
- `/login` login
- `/favorites` favoritos protegidos

## API

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/me`
- `/api/recipes`
- `/api/recipes/[id]`
- `/api/favorites`
- `/api/favorites/[id]`