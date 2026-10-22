# CDISFRUTA frontend

Aplicación React 19 con Vite y Tailwind CSS. Mantiene sus rutas de navegador y consume la API mediante `VITE_API_URL`.

## Desarrollo

```sh
npm install
npm run dev
```

Configura `.env` a partir de `.env.example`. Para compilar y revisar el código usa `npm run build` y `npm run lint`.

## Estructura

- `src/routes`: enrutador de la aplicación; conserva las URLs públicas y protegidas.
- `src/pages`: páginas públicas, de autenticación, usuario y administración.
- `src/components`: elementos compartidos de layout e interfaz.
- `src/services/api`: cliente HTTP y servicios de API.
- `src/hooks`, `src/utils`: hooks y utilidades compartidas.
- `src/styles`: estilos globales y tema del panel interno.
- `src/assets`, `public`: recursos importados por código y archivos estáticos.
- `src/legacy/legal`: versiones previas sin referencias activas, retenidas para revisión.

La configuración de Vite está en `vite.config.js`; no se usan alias de importación.
