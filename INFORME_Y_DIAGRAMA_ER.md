# Entregables del Proyecto: Ichigo Kitty (Kitty Import)

---

## 1. Informe de Investigación a Profundidad: Aplicación de Tokens JWT y Seguridad en APIs REST

### 1.1 Introducción a la Autenticación Basada en Tokens (Stateless)
En las arquitecturas cliente-servidor modernas (como una SPA en React consumiendo una API REST en Express), la autenticación tradicional basada en sesiones del servidor obliga a almacenar el estado de cada usuario conectado en memoria o base de datos. Frente a ello, el estándar **JSON Web Token (JWT, RFC 7519)** permite implementar un mecanismo **sin estado (*stateless*)**: el servidor valida las credenciales una sola vez en el inicio de sesión y emite un token firmado criptográficamente. En cada petición subsecuente, el cliente envía dicho token y el servidor verifica su autenticidad y vigencia matemáticamente usando su clave secreta, sin necesidad de consultar una tabla de sesiones.

### 1.2 Estructura Interna de un JSON Web Token (JWT)
Un JWT es una cadena compacta codificada en **Base64Url** dividida en tres partes separadas por puntos (`Header.Payload.Signature`):

1. **Header (Encabezado)**:
   Especifica el tipo de token (`"typ": "JWT"`) y el algoritmo criptográfico empleado para la firma, en este proyecto `HS256` (HMAC con SHA-256):
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```
2. **Payload (Carga útil o *Claims*)**:
   Contiene las declaraciones (*claims*) sobre la entidad autenticada y metadatos de control como `iat` (*issued at*, instante de emisión) y `exp` (*expiration time*, instante de vencimiento).
   - **Principio de minimización de datos**: Como el *payload* únicamente está codificado en Base64Url y **no cifrado**, cualquier persona que intercepte el token puede decodificar su contenido. Por ello, en **Ichigo Kitty** el *payload* almacena exclusivamente el identificador del usuario (`{ "id": usuario.id }`), omitiendo correos electrónicos, nombres o hashes de contraseñas.
3. **Signature (Firma criptográfica)**:
   Se calcula combinando el *Header* y el *Payload* codificados en Base64Url y firmándolos mediante el algoritmo `HMAC-SHA256` junto con la clave secreta almacenada en la variable de entorno `JWT_SECRET`:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + \text{"."} + \text{base64UrlEncode}(\text{Payload}), \text{JWT\_SECRET})$$
   Si un atacante modifica un solo carácter del *payload* (por ejemplo, cambiar `"id": 2` por `"id": 1`), la firma resultante no coincidirá con la calculada por el servidor y el middleware rechazará el token inmediatamente con `401 Unauthorized`.

### 1.3 Protección de Contraseñas con `bcryptjs`
Antes de emitir cualquier token, la base de datos debe resguardar las credenciales de forma irreversible. Guardar contraseñas en texto plano o con funciones hash rápidas (como MD5 o SHA-256) expone a los usuarios ante ataques de diccionario y tablas arcoíris (*rainbow tables*).
- **Algoritmo Bcrypt y Factor de Costo**: En el registro (`POST /api/auth/register`), se utiliza `bcryptjs` con **10 rondas de costo** (` saltRounds = 10`, equivalente a $2^{10} = 1024$ iteraciones internas del cifrado Blowfish).
- **Sal aleatoria integrada (*Salt*)**: `bcryptjs` genera automáticamente una sal aleatoria única por cada usuario y la incorpora en la misma cadena resultante (`password_hash`). Así, dos usuarios con la misma contraseña producen hashes completamente distintos.
- **Mitigación de enumeración de usuarios**: En el inicio de sesión (`POST /api/auth/login`), tanto si el correo no existe en SQLite como si la contraseña no coincide al evaluarla con `bcrypt.compareSync`, el servidor devuelve exactamente el mismo código y mensaje (`401 {"error": "Correo o contraseña incorrectos"}`), impidiendo que un atacante descubra qué correos están registrados.

### 1.4 Aplicación Práctica del Token en el Proyecto (Backend y Frontend)

1. **Emisión y Configuración Segura (`.env`)**:
   - Al autenticar al usuario en [authController.js](backend/src/controllers/authController.js), el servidor firma el token con `jwt.sign({ id: registroUsuario.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRA })`.
   - La clave `JWT_SECRET` (de al menos 48 caracteres de entropía) y el tiempo de vida `JWT_EXPIRA=8h` se cargan desde `backend/.env` mediante `dotenv`, quedando excluidos del control de versiones a través de `.gitignore`.

2. **Transporte mediante Esquema `Bearer` (RFC 6750)**:
   - El cliente envía el token en cada petición a rutas protegidas dentro del encabezado estándar HTTP:
     ```http
     Authorization: Bearer <token>
     ```

3. **Verificación en el Middleware ([authMiddleware.js](backend/src/middlewares/authMiddleware.js))**:
   - El middleware intercepta todas las rutas de `/api/proveedores`, `/api/categorias`, `/api/productos`, `/api/pedidos`, `/api/detalle_pedido` y `/api/auth/me` directamente en [app.js](backend/src/app.js).
   - Comprueba la presencia del prefijo `Bearer `, extrae el token y ejecuta `jwt.verify(token, process.env.JWT_SECRET)`. Si el token falta, está truncado, fue firmado con otra clave o superó las 8 horas de vigencia (`TokenExpiredError`), responde `401 {"error": "No autorizado"}`. Si es válido, inyecta `req.usuarioId = payload.id` y cede el control al controlador.

4. **Gestión en el Cliente React ([AuthContext.jsx](frontend/src/context/AuthContext.jsx) y [api.js](frontend/src/services/api.js))**:
   - El token se persiste en `localStorage` bajo la clave `"token_kitty"`.
   - Un **interceptor de petición de Axios** adjunta automáticamente el encabezado `Authorization: Bearer <token>` antes de despachar cualquier solicitud HTTP.
   - Al recargar la aplicación, `AuthContext` invoca `GET /api/auth/me` para reconstruir el estado del usuario a partir del token guardado.
   - Un **interceptor de respuesta de Axios** detecta cualquier respuesta `401` fuera de `/auth/login` y `/auth/register`, elimina `"token_kitty"` de `localStorage` y redirige de inmediato a `/login`.

### 1.5 Fuentes Consultadas
1. **IETF — RFC 7519**: Jones, M., Bradley, J., & Sakimura, N. (2015). *JSON Web Token (JWT)*. Internet Engineering Task Force (IETF). Disponible en: https://datatracker.ietf.org/doc/html/rfc7519
2. **IETF — RFC 6750**: Jones, M., & Hardt, D. (2012). *The OAuth 2.0 Authorization Framework: Bearer Token Usage*. Internet Engineering Task Force (IETF). Disponible en: https://datatracker.ietf.org/doc/html/rfc6750
3. **OWASP Foundation**: *JSON Web Token (JWT) Cheat Sheet for Java / Web Applications* & *Password Storage Cheat Sheet*. Open Worldwide Application Security Project. Disponible en: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html y https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
4. **Auth0 Documentation**: *Introduction to JSON Web Tokens*. Auth0 by Okta. Disponible en: https://jwt.io/introduction
5. **MDN Web Docs**: *HTTP Authentication — Bearer tokens & Authorization header*. Mozilla Developer Network. Disponible en: https://developer.mozilla.org/es/docs/Web/HTTP/Authentication
6. **Documentación Oficial de `jsonwebtoken` (Node.js)**: Auth0 / npm. Disponible en: https://github.com/auth0/node-jsonwebtoken

---

## 2. Diagrama Entidad-Relación (ER) Actualizado (20 Tablas — Costa Rica)

El modelo de base de datos en SQLite (`kitty_import.db`) y sus 20 migraciones (`backend/migrations/` y `migrations/`) constan de **20 entidades** integradas con llaves foráneas activas (`PRAGMA foreign_keys = ON`):

```mermaid
erDiagram
    USUARIOS {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL"
        TEXT email "NOT NULL, UNIQUE"
        TEXT password_hash "NOT NULL (bcryptjs 10 rondas)"
        INTEGER rol_id FK "NULLABLE -> ROLES.id"
        TEXT creado_en "NOT NULL (ISO 8601)"
    }

    ROLES {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL, UNIQUE"
        TEXT descripcion "NOT NULL"
    }

    PROVEEDORES {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL"
        TEXT plataforma "NOT NULL ('Taobao', '1688', 'AliExpress')"
        TEXT ciudad "NULLABLE"
        TEXT contacto "NOT NULL"
        INTEGER calificacion "NULLABLE (1 a 5)"
        TEXT descripcion "NULLABLE"
    }

    CATEGORIAS {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL, UNIQUE"
        TEXT descripcion "NULLABLE"
    }

    PRODUCTOS {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL"
        TEXT sku "NULLABLE"
        TEXT descripcion "NULLABLE"
        REAL precio_compra_cny "NOT NULL (> 0)"
        REAL precio_venta "NOT NULL (> 0)"
        INTEGER stock "NOT NULL (>= 0)"
        INTEGER categoria_id FK "NOT NULL -> CATEGORIAS.id"
        INTEGER proveedor_id FK "NOT NULL -> PROVEEDORES.id"
    }

    PEDIDOS {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER proveedor_id FK "NOT NULL -> PROVEEDORES.id"
        TEXT fecha "NOT NULL (ISO 8601)"
        TEXT estado "NOT NULL ('pedido', 'en_transito', 'recibido', 'cancelado')"
        TEXT rastreo "NULLABLE"
        REAL costo_envio "NOT NULL (>= 0)"
        TEXT notas_importacion "NULLABLE"
    }

    DETALLE_PEDIDO {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER pedido_id FK "NOT NULL -> PEDIDOS.id"
        INTEGER producto_id FK "NOT NULL -> PRODUCTOS.id"
        INTEGER cantidad "NOT NULL (> 0)"
        REAL precio_unitario_cny "NOT NULL (> 0)"
    }

    ALMACENES {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL"
        TEXT ubicacion "NOT NULL (San Jose / Alajuela / Heredia)"
        INTEGER capacidad_maxima "NOT NULL (> 0)"
        TEXT responsable "NOT NULL"
        TEXT descripcion "NULLABLE"
    }

    INVENTARIO_ALMACEN {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER almacen_id FK "NOT NULL -> ALMACENES.id"
        INTEGER producto_id FK "NOT NULL -> PRODUCTOS.id"
        INTEGER cantidad "NOT NULL (>= 0)"
        TEXT pasillo "NULLABLE"
    }

    AGENTES_ENVIO {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL"
        TEXT tipo_transporte "NOT NULL ('Aereo', 'Maritimo', 'Expres')"
        REAL tarifa_kg_usd "NOT NULL (> 0)"
        TEXT contacto "NOT NULL"
        TEXT pais_origen "NOT NULL"
        TEXT descripcion_servicio "NULLABLE"
    }

    ADUANA_DESPACHOS {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER pedido_id FK "NOT NULL -> PEDIDOS.id"
        INTEGER agente_id FK "NOT NULL -> AGENTES_ENVIO.id"
        TEXT numero_pedimento "NOT NULL, UNIQUE (DUA TICA CR)"
        REAL arancel_crc "NOT NULL (>= 0 Colones CR)"
        TEXT estado_aduana "NOT NULL ('en_revision', 'liberado', 'retenido')"
        TEXT fecha_despacho "NOT NULL"
        TEXT observaciones "NULLABLE"
    }

    CLIENTES {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL"
        TEXT correo "NOT NULL, UNIQUE"
        TEXT telefono "NULLABLE (+506 CR)"
        TEXT ciudad "NULLABLE (GAM Costa Rica)"
        TEXT nivel_membresia "NOT NULL ('Bronce', 'Plata', 'Oro', 'VIP')"
        TEXT notas_preferencia "NULLABLE"
    }

    VENTAS {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER cliente_id FK "NOT NULL -> CLIENTES.id"
        INTEGER usuario_id FK "NULLABLE -> USUARIOS.id"
        TEXT fecha "NOT NULL"
        REAL total "NOT NULL (>= 0)"
        TEXT estado_venta "NOT NULL ('pendiente', 'pagada', 'enviada', 'cancelada')"
    }

    DETALLE_VENTA {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER venta_id FK "NOT NULL -> VENTAS.id"
        INTEGER producto_id FK "NOT NULL -> PRODUCTOS.id"
        INTEGER cantidad "NOT NULL (> 0)"
        REAL precio_unitario "NOT NULL (> 0)"
    }

    METODOS_PAGO {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL, UNIQUE (SINPE Movil, BAC, Alipay...)"
        REAL comision_porcentaje "NOT NULL (>= 0)"
        INTEGER activo "NOT NULL (1 o 0)"
        TEXT descripcion "NULLABLE"
    }

    PAGOS_PROVEEDOR {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER pedido_id FK "NOT NULL -> PEDIDOS.id"
        INTEGER metodo_pago_id FK "NOT NULL -> METODOS_PAGO.id"
        REAL monto_cny "NOT NULL (> 0)"
        REAL tipo_cambio "NOT NULL (> 0)"
        TEXT referencia "NOT NULL"
        TEXT fecha_pago "NOT NULL"
    }

    MARCAS_LICENCIAS {
        INTEGER id PK "AUTOINCREMENT"
        TEXT nombre "NOT NULL, UNIQUE"
        TEXT pais_origen "NOT NULL"
        TEXT fabricante_oficial "NOT NULL"
        TEXT tipo_licencia "NOT NULL"
        TEXT descripcion "NOT NULL"
    }

    CONTROL_CALIDAD {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER pedido_id FK "NOT NULL -> PEDIDOS.id"
        INTEGER producto_id FK "NOT NULL -> PRODUCTOS.id"
        TEXT inspector "NOT NULL"
        INTEGER unidades_revisadas "NOT NULL"
        INTEGER unidades_defectuosas "NOT NULL"
        TEXT resultado "NOT NULL ('aprobado', 'aprobado_con_observaciones', 'rechazado')"
        TEXT observaciones "NOT NULL"
    }

    PROMOCIONES_DESCUENTOS {
        INTEGER id PK "AUTOINCREMENT"
        TEXT codigo "NOT NULL, UNIQUE"
        TEXT nombre_campana "NOT NULL"
        REAL porcentaje_descuento "NOT NULL"
        REAL minimo_compra_usd "NOT NULL"
        TEXT fecha_inicio "NOT NULL"
        TEXT fecha_fin "NOT NULL"
        INTEGER activa "NOT NULL (1 o 0)"
        TEXT descripcion "NOT NULL"
    }

    INCIDENCIAS_ENVIO {
        INTEGER id PK "AUTOINCREMENT"
        INTEGER pedido_id FK "NOT NULL -> PEDIDOS.id"
        TEXT tipo_incidencia "NOT NULL"
        TEXT severidad "NOT NULL ('baja', 'media', 'alta')"
        TEXT descripcion "NOT NULL"
        TEXT resolucion "NOT NULL"
        TEXT estado "NOT NULL"
    }

    ROLES ||--o{ USUARIOS : "asigna (1:N)"
    CATEGORIAS ||--o{ PRODUCTOS : "clasifica (1:N)"
    PROVEEDORES ||--o{ PRODUCTOS : "suministra (1:N)"
    PROVEEDORES ||--o{ PEDIDOS : "atiende (1:N)"
    PEDIDOS ||--o{ DETALLE_PEDIDO : "contiene (1:N)"
    PRODUCTOS ||--o{ DETALLE_PEDIDO : "se_incluye_en (1:N)"
    ALMACENES ||--o{ INVENTARIO_ALMACEN : "almacena (1:N)"
    PRODUCTOS ||--o{ INVENTARIO_ALMACEN : "ubicado_en (1:N)"
    PEDIDOS ||--o{ ADUANA_DESPACHOS : "tramita_DUA (1:N)"
    AGENTES_ENVIO ||--o{ ADUANA_DESPACHOS : "transporta (1:N)"
    CLIENTES ||--o{ VENTAS : "realiza (1:N)"
    USUARIOS ||--o{ VENTAS : "registra (1:N)"
    VENTAS ||--o{ DETALLE_VENTA : "incluye (1:N)"
    PRODUCTOS ||--o{ DETALLE_VENTA : "vendido_en (1:N)"
    PEDIDOS ||--o{ PAGOS_PROVEEDOR : "liquida (1:N)"
    METODOS_PAGO ||--o{ PAGOS_PROVEEDOR : "procesa (1:N)"
    PEDIDOS ||--o{ CONTROL_CALIDAD : "inspecciona_lote (1:N)"
    PRODUCTOS ||--o{ CONTROL_CALIDAD : "evalua_calidad (1:N)"
    PEDIDOS ||--o{ INCIDENCIAS_ENVIO : "reporta_evento (1:N)"
```

### Resumen de Relaciones y Reglas de Integridad
| Relación | Cardinalidad | Clave Foránea | Regla de Eliminación / Negocio |
| :--- | :---: | :--- | :--- |
| `CATEGORIAS` -> `PRODUCTOS` | `1 : N` | `productos.categoria_id` | No permite borrar categoría con productos asociados (`409 Conflict`). |
| `PROVEEDORES` -> `PRODUCTOS` | `1 : N` | `productos.proveedor_id` | No permite borrar proveedor con productos asociados (`409 Conflict`). |
| `PROVEEDORES` -> `PEDIDOS` | `1 : N` | `pedidos.proveedor_id` | No permite borrar proveedor con pedidos asociados (`409 Conflict`). |
| `PEDIDOS` -> `DETALLE_PEDIDO` | `1 : N` | `detalle_pedido.pedido_id` | Al recibir un pedido (`estado = 'recibido'`), suma `cantidad` al `stock` de cada producto en una transacción. |
| `PRODUCTOS` -> `DETALLE_PEDIDO` | `1 : N` | `detalle_pedido.producto_id` | No permite borrar producto con detalles de pedido asociados (`409 Conflict`). |
| `USUARIOS` (Autenticación) | Independiente | — | Protege todos los endpoints de las 5 entidades mediante `authMiddleware` (`JWT`). |

