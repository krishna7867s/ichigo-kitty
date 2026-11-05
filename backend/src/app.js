const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const db = require('./models/db');

// Importar modelos en orden de dependencia para crear las tablas si no existen
require('./models/usuario');
require('./models/proveedorModel');
require('./models/categoriaModel');
require('./models/productoModel');
require('./models/pedidoModel');
require('./models/detallePedidoModel');

const authMiddleware = require('./middlewares/authMiddleware');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');

function sembrarDatosIniciales() {
  const totalCategorias = db.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;
  const totalProveedores = db.prepare('SELECT COUNT(*) AS total FROM proveedores').get().total;

  if (totalCategorias > 0 || totalProveedores > 0) {
    return;
  }

  const ejecutarSeed = db.transaction(() => {
    const insertarCategoria = db.prepare(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)'
    );
    insertarCategoria.run('Peluches', 'Muñecos de felpa suaves y coleccionables estilo kawaii');
    insertarCategoria.run('Llaveros', 'Colgantes acrílicos, de peluche y PVC para mochilas y llaves');
    insertarCategoria.run('Stickers', 'Hojas y paquetes de calcomanías decorativas para papelería');
    insertarCategoria.run('Accesorios', 'Pinzas para cabello, monederos, espejos y artículos de escritorio');

    const insertarProveedor = db.prepare(
      'INSERT INTO proveedores (nombre, plataforma, ciudad, contacto, calificacion) VALUES (?, ?, ?, ?, ?)'
    );
    insertarProveedor.run('Sakura Plush Studio', 'Taobao', 'Guangzhou', 'wechat: sakura_plush_gz', 5);
    insertarProveedor.run('Yiwu Kawaii Craft Factory', '1688', 'Yiwu', 'wechat: yiwu_kawaii1688', 4);
    insertarProveedor.run('Mochi Stationery Store', 'Taobao', 'Hangzhou', 'mochi.shop@qq.com', 5);
    insertarProveedor.run('Lucky Neko Global Shop', 'AliExpress', 'Shenzhen', 'luckyneko.ali@163.com', 4);

    const insertarProducto = db.prepare(`
      INSERT INTO productos (nombre, precio_compra_cny, precio_venta, stock, categoria_id, proveedor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertarProducto.run('Peluche Gatito Mochi Rosa 25cm', 28.5, 220, 15, 1, 1);
    insertarProducto.run('Peluche Conejito Fresita 30cm', 35.0, 260, 8, 1, 1);
    insertarProducto.run('Peluche Capibara con Mochila Tortuga', 24.0, 190, 20, 1, 4);
    insertarProducto.run('Llavero Acrílico Gatito Boba', 4.5, 45, 50, 2, 2);
    insertarProducto.run('Llavero Pompón Patita de Gato', 6.0, 60, 35, 2, 2);
    insertarProducto.run('Llavero Mini Peluche Osito Pastel', 9.5, 85, 25, 2, 1);
    insertarProducto.run('Pack 50 Stickers Gatitos Pasteleros', 5.2, 55, 40, 3, 3);
    insertarProducto.run('Set Washi Tape y Stickers Sakura', 12.0, 110, 18, 3, 3);
    insertarProducto.run('Pinzas para Cabello Orejitas de Gato', 3.8, 40, 60, 4, 2);
    insertarProducto.run('Monedero de Felpa Cara de Gatito', 11.0, 95, 12, 4, 4);

    const insertarPedido = db.prepare(`
      INSERT INTO pedidos (proveedor_id, fecha, estado, rastreo, costo_envio)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertarPedido.run(1, '2026-10-15T10:30:00.000Z', 'recibido', 'SF1428593012CN', 180);
    insertarPedido.run(2, '2026-10-25T14:15:00.000Z', 'en_transito', 'YT2409182736CN', 145);
    insertarPedido.run(3, '2026-11-01T09:00:00.000Z', 'pedido', null, 95);
    insertarPedido.run(4, '2026-10-10T16:45:00.000Z', 'cancelado', 'LP0058192034CN', 0);

    const insertarDetalle = db.prepare(`
      INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario_cny)
      VALUES (?, ?, ?, ?)
    `);
    insertarDetalle.run(1, 1, 10, 28.5);
    insertarDetalle.run(1, 2, 8, 35.0);
    insertarDetalle.run(1, 6, 15, 9.5);

    insertarDetalle.run(2, 4, 30, 4.5);
    insertarDetalle.run(2, 5, 20, 6.0);
    insertarDetalle.run(2, 9, 40, 3.8);

    insertarDetalle.run(3, 7, 25, 5.2);
    insertarDetalle.run(3, 8, 12, 12.0);

    insertarDetalle.run(4, 3, 10, 24.0);
    insertarDetalle.run(4, 10, 15, 11.0);
  });

  ejecutarSeed();
}

sembrarDatosIniciales();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas de autenticación (register y login) y ruta protegida /api/auth/me
app.get('/api/auth/me', authMiddleware, authController.obtenerPerfil);
app.use('/api/auth', authRoutes);

// Rutas protegidas de las 5 entidades
app.use('/api/proveedores', authMiddleware, proveedorRoutes);
app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/productos', authMiddleware, productoRoutes);
app.use('/api/pedidos', authMiddleware, pedidoRoutes);
app.use('/api/detalle_pedido', authMiddleware, detallePedidoRoutes);
app.use('/api/detalles_pedido', authMiddleware, detallePedidoRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'El formato del JSON enviado no es válido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
