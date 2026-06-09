# Backend Entrega 1 — Nahuel Carrera

API REST desarrollada con **Node.js** y **Express** como primera entrega del curso de Backend en CoderHouse. Implementa un CRUD completo de productos y gestión de carritos de compra, con persistencia de datos en archivos JSON.

---

##  Tecnologías

- **Node.js** (ES Modules)
- **Express 4.x**
- Persistencia en archivos **JSON** (sin base de datos)

---

## Estructura del proyecto

```
├── app.js                        # Entry point del servidor
├── package.json
└── src/
    ├── data/
    │   ├── products.json         # Base de datos de productos
    │   └── carts.json            # Base de datos de carritos
    ├── managers/
    │   ├── ProductManager.js     # Lógica CRUD de productos
    │   └── CartManager.js        # Lógica de carritos
    └── routes/
        ├── products.router.js    # Rutas /api/products
        └── carts.router.js       # Rutas /api/carts
```

---

## Instalación y uso

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

El servidor quedará escuchando en `http://localhost:8080`.

---

##  Endpoints — Productos

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
> `status` (boolean, default `true`) y `thumbnails` (array, default `[]`) son opcionales.



##  Endpoints — Carritos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/carts` | Crear un nuevo carrito vacío |
| `GET` | `/api/carts/:cid` | Obtener un carrito por ID |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar un producto al carrito (incrementa cantidad si ya existe) |



##  Notas

- Los datos se persisten automáticamente en `src/data/products.json` y `src/data/carts.json`.
- Los IDs se auto-incrementan y son gestionados por los managers.
- No se puede modificar el `id` de un producto al hacer `PUT` (el campo es ignorado).



## Autor

**Nahuel Alexis Carrera** 
