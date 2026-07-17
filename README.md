# Backend Entrega Final. Nahuel Carrera

E-commerce API con persistencia en MongoDB, autenticación JWT por roles, carrito con populate, paginación profesional y cierre de compra con ticket. Proyecto final del curso de Backend en CoderHouse.

## Tecnologías

- **Node.js** (ES Modules) + **Express 4**
- **MongoDB** + **Mongoose** + **mongoose-paginate-v2**
- **Passport** (local + JWT en cookie httpOnly) + **bcrypt**
- **express-handlebars** + **Socket.io**

## Arquitectura

El proyecto está organizado por capas: los routers solo definen rutas y middlewares, los controllers manejan request y response, los services concentran la lógica de negocio y el acceso a datos, y los models definen los esquemas de Mongoose.

```
├── app.js                          Bootstrap del servidor
├── scripts/seed.js                 Carga inicial de productos y usuario admin
├── public/                         Estáticos (css y js de cliente)
└── src/
    ├── config/                     Entorno, conexión a Mongo, passport, socket
    ├── models/                     Esquemas: Product, Cart, User, Ticket
    ├── services/                   Lógica de negocio y acceso a datos
    ├── controllers/                Manejo de request/response
    ├── routes/                     Definición de rutas y protección
    ├── middlewares/                Autenticación, autorización y manejo de errores
    ├── utils/                      Hash, JWT, asyncHandler
    └── views/                      Plantillas Handlebars
```

## Instalación y uso

Requiere MongoDB corriendo (local o Atlas).

```bash
git clone https://github.com/nahuelalexiscarrera/EntregaBackend_NahuelCarrera.git
cd EntregaBackend_NahuelCarrera
npm install

cp .env.example .env
# Editar .env con la URI de Mongo y un JWT_SECRET propio

npm run seed      # Carga 10 productos y crea el usuario admin
npm run dev       # Desarrollo con hot reload
npm start         # Producción
```

El servidor queda escuchando en `http://localhost:8080`.

### Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `8080` |
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://localhost:27017/entrega_final` |
| `JWT_SECRET` | Secret para firmar los tokens | |
| `COOKIE_NAME` | Nombre de la cookie de sesión | `authToken` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales del admin que crea el seed | |

## Roles

| Rol | Permisos |
|-----|----------|
| `user` | Operar su propio carrito (agregar, quitar, actualizar, comprar) |
| `admin` | Crear, actualizar y eliminar productos |

El admin se crea con `npm run seed` a partir de las credenciales del `.env`. Los usuarios registrados reciben rol `user` y un carrito propio.

## Endpoints API. Sesiones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/sessions/register` | Registrar usuario. Crea su carrito |
| `POST` | `/api/sessions/login` | Iniciar sesión. Setea cookie httpOnly con JWT |
| `GET` | `/api/sessions/current` | Datos del usuario autenticado |
| `POST` | `/api/sessions/logout` | Cerrar sesión |

### Body para register

```json
{
  "first_name": "Nahuel",
  "last_name": "Carrera",
  "email": "usuario@mail.com",
  "age": 28,
  "password": "secreta123"
}
```

## Endpoints API. Productos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/api/products` | Listado paginado con filtros y ordenamiento | Público |
| `GET` | `/api/products/:pid` | Producto por id | Público |
| `POST` | `/api/products` | Crear producto | Admin |
| `PUT` | `/api/products/:pid` | Actualizar producto | Admin |
| `DELETE` | `/api/products/:pid` | Eliminar producto | Admin |

### Query params de GET /api/products

| Param | Descripción | Default |
|-------|-------------|---------|
| `limit` | Cantidad de resultados por página | `10` |
| `page` | Página a consultar | `1` |
| `sort` | `asc` o `desc`, ordena por precio | Sin orden |
| `query` | `disponible`, `nodisponible` o nombre de categoría | Sin filtro |

Respuesta:

```json
{
  "status": "success",
  "payload": [],
  "totalPages": 3,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?limit=4&page=1",
  "nextLink": "/api/products?limit=4&page=3"
}
```

## Endpoints API. Carritos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `POST` | `/api/carts` | Crear carrito vacío | Público |
| `GET` | `/api/carts/:cid` | Carrito por id con productos populados | Autenticado |
| `POST` | `/api/carts/:cid/products/:pid` | Agregar producto (incrementa quantity si ya existe) | User, carrito propio |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualizar solo la cantidad. Body `{ "quantity": 5 }` | User, carrito propio |
| `DELETE` | `/api/carts/:cid/products/:pid` | Quitar un producto del carrito | User, carrito propio |
| `PUT` | `/api/carts/:cid` | Reemplazar todos los productos. Body `{ "products": [{ "product": "pid", "quantity": 2 }] }` | User, carrito propio |
| `DELETE` | `/api/carts/:cid` | Vaciar el carrito | User, carrito propio |
| `POST` | `/api/carts/:cid/purchase` | Cierre de compra | User, carrito propio |

### Cierre de compra

El purchase verifica stock producto por producto con un decremento atómico. Los productos con stock suficiente se descuentan y suman al ticket; los que no alcanzan quedan en el carrito. Respuesta:

```json
{
  "status": "success",
  "message": "Compra realizada",
  "payload": {
    "ticket": {
      "code": "uuid",
      "purchase_datetime": "2026-07-17T00:00:00.000Z",
      "amount": 179.99,
      "purchaser": "usuario@mail.com"
    },
    "notProcessedIds": []
  }
}
```

## Vistas

| Ruta | Descripción |
|------|-------------|
| `GET /products` | Listado paginado con filtros, botón de agregar al carrito y link al detalle |
| `GET /products/:pid` | Detalle completo del producto con botón de agregar al carrito |
| `GET /carts/:cid` | Carrito con productos populados, subtotales, total y botón de compra |
| `GET /login` y `GET /register` | Autenticación |
| `GET /` | Lista simple de productos |
| `GET /realtimeproducts` | Alta y baja de productos en tiempo real con WebSockets. Solo admin |

## WebSockets

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `updateProducts` | Server a Client | Lista completa actualizada |
| `newProduct` | Client a Server | Crear producto desde el formulario. Requiere rol admin |
| `deleteProduct` | Client a Server | Eliminar producto por id. Requiere rol admin |
| `productError` | Server a Client | Error de operación (por ejemplo código duplicado) |

## Autor

**Nahuel Alexis Carrera**. CoderHouse Backend
