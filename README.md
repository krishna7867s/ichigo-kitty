# Kitty Import

## Instalación

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuración de variables de entorno

Copia el archivo `backend/.env.example` a `backend/.env` y completa los valores:

```bash
cp backend/.env.example backend/.env
```

Variables requeridas en `backend/.env`:
- `PUERTO=3001`
- `JWT_SECRET=` (cadena aleatoria de al menos 48 caracteres)
- `JWT_EXPIRA=8h`

## Ejecución

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Puertos

- Backend (API): `http://localhost:3001`
- Frontend (Vite): `http://localhost:5173`

