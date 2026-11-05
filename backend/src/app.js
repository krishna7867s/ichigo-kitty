const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const db = require('./models/db');

// Importar los 16 modelos en orden de dependencia para crear las tablas si no existen
require('./models/usuario');
require('./models/rolModel');
require('./models/proveedorModel');
require('./models/categoriaModel');
require('./models/productoModel');
require('./models/pedidoModel');
require('./models/detallePedidoModel');
require('./models/almacenModel');
require('./models/inventarioAlmacenModel');
require('./models/agenteEnvioModel');
require('./models/aduanaDespachoModel');
require('./models/clienteModel');
require('./models/ventaModel');
require('./models/detalleVentaModel');
require('./models/metodoPagoModel');
require('./models/pagoProveedorModel');

const authMiddleware = require('./middlewares/authMiddleware');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');
const {
  usuariosRoutes,
  rolesRoutes,
  almacenesRoutes,
  inventarioAlmacenRoutes,
  agentesEnvioRoutes,
  aduanaDespachosRoutes,
  clientesRoutes,
  ventasRoutes,
  detalleVentaRoutes,
  metodosPagoRoutes,
  pagosProveedorRoutes
} = require('./routes/operacionesRoutes');

function sembrarDatosIniciales() {
  const totalCategorias = db.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;
  const totalProveedores = db.prepare('SELECT COUNT(*) AS total FROM proveedores').get().total;

  if (totalCategorias === 0 && totalProveedores === 0) {
    const ejecutarSeedBase = db.transaction(() => {
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

    ejecutarSeedBase();
  }

  const totalRoles = db.prepare('SELECT COUNT(*) AS total FROM roles').get().total;
  if (totalRoles === 0) {
    const ejecutarSeedExtendida = db.transaction(() => {
      const insRol = db.prepare('INSERT INTO roles (nombre, descripcion) VALUES (?, ?)');
      insRol.run('Directora General', 'Administración completa de compras internacionales y catálogo');
      insRol.run('Encargada de Importación', 'Seguimiento de pedidos en Taobao, 1688 y aduanas');
      insRol.run('Almacenista', 'Control de recepción de cajas, pasillos y existencias');
      insRol.run('Coordinadora de Ventas', 'Atención a clientas VIP y despachos nacionales');

      const insAlmacen = db.prepare(
        'INSERT INTO almacenes (nombre, ubicacion, capacidad_maxima, responsable) VALUES (?, ?, ?, ?)'
      );
      insAlmacen.run('Bodega Central Sakura', 'CDMX - Col. Roma Norte', 2500, 'Hinata Hyuga');
      insAlmacen.run('Estación Empaque Fresa', 'Guadalajara - Zona Chapultepec', 1200, 'Tomoyo Daidouji');
      insAlmacen.run('Showroom Ichigo', 'Monterrey - Barrio Antiguo', 800, 'Miki Koishikawa');

      const insInv = db.prepare(
        'INSERT INTO inventario_almacen (almacen_id, producto_id, cantidad, pasillo) VALUES (?, ?, ?, ?)'
      );
      insInv.run(1, 1, 10, 'Pasillo A-1');
      insInv.run(1, 4, 35, 'Pasillo B-2');
      insInv.run(2, 7, 25, 'Estante Rosa 3');
      insInv.run(3, 9, 40, 'Vitrina Principal');

      const insAgente = db.prepare(
        'INSERT INTO agentes_envio (nombre, tipo_transporte, tarifa_kg_usd, contacto, pais_origen) VALUES (?, ?, ?, ?, ?)'
      );
      insAgente.run('SF Express Air Cargo', 'Aéreo', 11.5, 'sf.kawaii@sf-express.com', 'China');
      insAgente.run('YunExpress Fast Line', 'Exprés', 14.0, 'support@yunexpress.cn', 'China');
      insAgente.run('COSCO Neko Sea Freight', 'Marítimo', 4.2, 'maritimo@cosconeko.cn', 'China');

      const insAduana = db.prepare(
        'INSERT INTO aduana_despachos (pedido_id, agente_id, numero_pedimento, arancel_mxn, estado_aduana, fecha_despacho) VALUES (?, ?, ?, ?, ?, ?)'
      );
      insAduana.run(1, 1, '26-47-3829-6001234', 340.5, 'liberado', '2026-10-20T12:00:00.000Z');
      insAduana.run(2, 2, '26-47-3829-6001299', 285.0, 'en_revision', '2026-10-28T09:30:00.000Z');

      const insCliente = db.prepare(
        'INSERT INTO clientes (nombre, correo, telefono, ciudad, nivel_membresia) VALUES (?, ?, ?, ?, ?)'
      );
      insCliente.run('Chibiusa Tsukino', 'chibiusa@moonpink.mx', '5512345678', 'CDMX', 'VIP');
      insCliente.run('Anya Forger', 'anya@eden.edu.mx', '3398765432', 'Guadalajara', 'Oro');
      insCliente.run('Tohru Honda', 'tohru@onigiri.mx', '8123456789', 'Monterrey', 'Plata');

      const insVenta = db.prepare(
        'INSERT INTO ventas (cliente_id, usuario_id, fecha, total, estado_venta) VALUES (?, ?, ?, ?, ?)'
      );
      insVenta.run(1, null, '2026-11-01T15:20:00.000Z', 485.0, 'entregada' === 'pagada' ? 'pagada' : 'enviada');
      insVenta.run(2, null, '2026-11-02T18:10:00.000Z', 275.0, 'pagada');

      const insDetVenta = db.prepare(
        'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)'
      );
      insDetVenta.run(1, 1, 2, 220.0);
      insDetVenta.run(1, 4, 1, 45.0);
      insDetVenta.run(2, 7, 5, 55.0);

      const insMetodo = db.prepare(
        'INSERT INTO metodos_pago (nombre, comision_porcentaje, activo) VALUES (?, ?, ?)'
      );
      insMetodo.run('Alipay Internacional', 1.5, 1);
      insMetodo.run('WeChat Pay Business', 1.2, 1);
      insMetodo.run('Tarjeta Corporativa Wise', 0.8, 1);

      const insPago = db.prepare(
        'INSERT INTO pagos_proveedor (pedido_id, metodo_pago_id, monto_cny, tipo_cambio, referencia, fecha_pago) VALUES (?, ?, ?, ?, ?, ?)'
      );
      insPago.run(1, 1, 707.5, 2.74, 'ALI-20261015-9981', '2026-10-15T10:35:00.000Z');
      insPago.run(2, 2, 407.0, 2.76, 'WXP-20261025-4412', '2026-10-25T14:20:00.000Z');
    });

    ejecutarSeedExtendida();
  }
}

sembrarDatosIniciales();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas de autenticación (register y login) y ruta protegida /api/auth/me
app.get('/api/auth/me', authMiddleware, authController.obtenerPerfil);
app.use('/api/auth', authRoutes);

// Rutas protegidas de las 16 tablas del sistema empresarial Ichigo Kitty
app.use('/api/proveedores', authMiddleware, proveedorRoutes);
app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/productos', authMiddleware, productoRoutes);
app.use('/api/pedidos', authMiddleware, pedidoRoutes);
app.use('/api/detalle_pedido', authMiddleware, detallePedidoRoutes);
app.use('/api/detalles_pedido', authMiddleware, detallePedidoRoutes);
app.use('/api/usuarios', authMiddleware, usuariosRoutes);
app.use('/api/roles', authMiddleware, rolesRoutes);
app.use('/api/almacenes', authMiddleware, almacenesRoutes);
app.use('/api/inventario_almacen', authMiddleware, inventarioAlmacenRoutes);
app.use('/api/agentes_envio', authMiddleware, agentesEnvioRoutes);
app.use('/api/aduana_despachos', authMiddleware, aduanaDespachosRoutes);
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api/ventas', authMiddleware, ventasRoutes);
app.use('/api/detalle_venta', authMiddleware, detalleVentaRoutes);
app.use('/api/metodos_pago', authMiddleware, metodosPagoRoutes);
app.use('/api/pagos_proveedor', authMiddleware, pagosProveedorRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'El formato del JSON enviado no es válido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
