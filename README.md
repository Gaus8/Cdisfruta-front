# CDISFRUTA

Sitio de CDISFRUTA, marca de snacks de fruta deshidratada y aromáticas frutales de Ubaté, Cundinamarca. Este repositorio es la aplicación web. La API está en [Cdisfruta-back](https://github.com/Gaus8/Cdisfruta-back).

En producción el sitio está en `https://cdisfruta.vercel.app` y la API en `https://cdisfruta-back.vercel.app`.

## Qué incluye

La aplicación tiene cuatro zonas:

- **Inicio público.** Carrusel de portada, historia, misión y visión, videos y contacto. La portada sale de `GET /api/portada`. Historia, misión y videos son contenido del front.
- **Tienda.** Catálogo publicado, carrito y checkout con contraentrega, Nequi o tarjeta. Un visitante puede comprar sin cuenta. Con cuenta, el pedido queda a su nombre.
- **Área del cliente.** Tienda con sesión, perfil, configuración y pedidos. Desde ahí puede cancelar un pedido que siga pendiente.
- **Panel.** Inicio, productos, inventario, usuarios, analítica, pedidos, reportes, diseño de portada, perfil y configuración. Lo que ve cada persona depende de su rol.

## Roles y pantallas

| Rol | Entra a | Pantallas |
| --- | --- | --- |
| Visitante | `/`, `/tienda`, `/login`, `/registro` | Inicio, tienda, legales y acceso. |
| `user` | `/cliente` | Tienda, perfil, configuración y pedidos. |
| `admin` | `/admin` | Todo el panel. |
| `logistica` | `/admin/inventario` | Inventario. |
| `catalogo` | `/admin/productos` | Catálogo. |

El administrador diseña la portada: agrega, ordena y quita diapositivas (de 1 a 12) y las guarda en el servidor. Las fotos aceptan JPG, PNG, WebP, GIF, AVIF, BMP, TIFF y HEIC, hasta 8 MB, con el lado más largo de al menos 480 px.

## Rutas

| Ruta | Quién | Función |
| --- | --- | --- |
| `/` | Pública | Inicio. |
| `/tienda` | Pública | Catálogo y compra. |
| `/pago/resultado` | Pública | Regreso del pago de Wompi. |
| `/login`, `/registro` | Pública | Correo o botón Continuar con Google. |
| `/validacion` | Pública | Código de verificación del correo. |
| `/reset-password` | Pública | Nueva contraseña con el enlace del correo. |
| `/terminos`, `/politica-datos` | Pública | Textos legales. |
| `/cliente/tienda` | Cliente | Tienda autenticada. |
| `/cliente/perfil`, `/cliente/configuracion` | Cliente | Datos, avatar y contraseña. |
| `/cliente/pedidos` | Cliente | Pedidos propios y cancelación. |
| `/admin` | Panel | Inicio administrativo. |
| `/admin/productos` | Catálogo | Alta, edición y baja de productos. |
| `/admin/inventario` | Logística | Stock, códigos de barras y exportación al catálogo. |
| `/admin/usuarios` | Admin | Clientes, roles y actividad. |
| `/admin/analitica-productos` | Admin | Visitas, interés y ventas por producto. |
| `/admin/pedidos` | Admin | Estados del pedido. |
| `/admin/reportes` | Admin | Reportes del panel. |
| `/admin/diseno-portada` | Admin | Carrusel del inicio. |
| `/admin/perfil`, `/admin/configuracion` | Admin | Cuenta y avisos. |

`/dev/formas` y `/dev/mision-vision` solo existen con `npm run dev`. Cualquier otra ruta vuelve al inicio.

## Sesión

`AuthProvider` comprueba la cookie al abrir la app, al cambiar de ruta protegida y cada dos minutos. Si la sesión que ya existía deja de ser válida, la app marca la expiración y lleva al login.

La cookie la escribe la API. Las llamadas salen con `withCredentials` para que el navegador la envíe. El login con Google usa el botón oficial, que devuelve un ID token; el front lo entrega a `POST /api/auth/google`.

El ID público del cliente de Google está en `src/main.jsx`. Tiene que coincidir con `GOOGLE_CLIENT_ID` del servidor, y Google Cloud debe autorizar `http://localhost:5173` y `https://cdisfruta.vercel.app` como orígenes de JavaScript.

## Puesta en marcha

Requiere Node.js y la API corriendo.

```sh
npm install
cp .env.example .env
npm run dev
```

Vite sirve el front en `http://localhost:5173`. `.env` solo necesita:

```
VITE_API_URL=http://localhost:5000/api
```

En el proyecto de Vercel del front, ese valor es `https://cdisfruta-back.vercel.app/api`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Compila a `dist`. |
| `npm run preview` | Sirve la compilación. |
| `npm run lint` | Revisa el código con ESLint. |

## Estructura

```
index.html
vite.config.js                 Vite, React, Tailwind y cabecera COOP
vercel.json                    SPA y cabecera COOP en producción
src/main.jsx                   montaje y proveedor de Google
src/routes/AppRouter.jsx       rutas públicas, de cliente y de panel
src/pages/public               inicio, tienda y legales
src/pages/auth                 login, registro, verificación y recuperación
src/pages/user                 área del cliente
src/pages/admin                panel
src/components                 layout del panel y piezas compartidas
src/services/api               Axios y servicios (auth, productos, pedidos)
src/hooks/useAuth.js           sesión compartida
src/styles                     estilos globales
public                         imágenes, logo y videos del inicio
```

`src/legacy/legal` conserva textos anteriores que ninguna ruta usa.

## Cómo se conecta con la API

Todas las peticiones usan `VITE_API_URL`. El contrato detallado, con cuerpos y permisos, está en la colección `docs/CDISFRUTA.postman_collection.json` del repositorio del backend.

CORS del servidor permite `http://localhost:5173` y `https://cdisfruta.vercel.app`, con credenciales. Un cambio de este repositorio se ve en producción después de desplegarlo en Vercel.
