# Backend Entrega 2 — Nahuel Carrera

API REST con vistas en tiempo real, desarrollada con **Node.js**, **Express**, **Handlebars** y **Socket.io** como segunda entrega del curso de Backend en CoderHouse.

---

## 🚀 Tecnologías

- **Node.js** (ES Modules)
- **Express 4.x**
- **express-handlebars** — Motor de plantillas
- **Socket.io** — Comunicación en tiempo real
- Persistencia en archivos **JSON**

---

## 📁 Estructura del proyecto

```
├── app.js                              # Entry point (HTTP + Socket.io)
├── package.json
├── public/                             # Archivos estáticos
└── src/
    ├── data/
    │   ├── products.json               # Base de datos de productos
    │   └── carts.json                  # Base de datos de carritos
    ├── managers/
    │   ├── ProductManager.js           # Lógica CRUD de productos
    │   └── CartManager.js              # Lógica de carritos
    ├── routes/
    │   ├── products.router.js          # Rutas /api/products
    │   ├── carts.router.js             # Rutas /api/carts
    │   └── views.router.js             # Rutas de vistas
    └── views/
        ├── layouts/
        │   └── main.handlebars         # Layout principal
        ├── home.handlebars             # Lista estática de productos
        └── realTimeProducts.handlebars # Lista en tiempo real + formulario
```

---

## ⚙️ Instalación y uso

```bash
# Clonar el repositorio
git clone https://github.com/nahuelalexiscarrera/EntregaBackend_NahuelCarrera.git
cd EntregaBackend_NahuelCarrera

# Instalar dependencias
npm install

# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

El servidor queda escuchando en `http://localhost:8080`.

---

## 🖥️ Vistas

| Ruta | Descripción |
|------|-------------|
| `GET /` | Lista estática de productos (Handlebars SSR) |
| `GET /realtimeproducts` | Lista en tiempo real con WebSockets + formulario para crear/eliminar |

---

## 📦 Endpoints API — Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/products` | Obtener todos los productos. Acepta `?limit=N` |
| `GET` | `/api/products/:pid` | Obtener un producto por ID |
| `POST` | `/api/products` | Crear un nuevo producto |
| `PUT` | `/api/products/:pid` | Actualizar un producto por ID |
| `DELETE` | `/api/products/:pid` | Eliminar un producto por ID |

### Body para `POST /api/products`

```json
{
  "title": "Nombre del producto",
  "description": "Descripción",
  "code": "ABC123",
  "price": 1500,
  "stock": 10,
  "category": "electrónica",
  "status": true,
  "thumbnails": []
}
```

> **Campos obligatorios:** `title`, `description`, `code`, `price`, `stock`, `category`.
> `status` (default `true`) y `thumbnails` (default `[]`) son opcionales.

---

## 🛒 Endpoints API — Carritos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/carts` | Crear un nuevo carrito vacío |
| `GET` | `/api/carts/:cid` | Obtener un carrito por ID |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar un producto al carrito |

---

## 🔌 WebSockets

La vista `/realtimeproducts` se conecta por Socket.io. Los eventos son:

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `updateProducts` | Server → Client | Envía la lista completa actualizada |
| `newProduct` | Client → Server | Crea un producto desde el formulario |
| `deleteProduct` | Client → Server | Elimina un producto por ID |

Las rutas `POST /api/products` y `DELETE /api/products/:pid` también emiten `updateProducts` a todos los clientes conectados.

---

## 👤 Autor

**Nahuel Alexis Carrera** — CoderHouse Backend
