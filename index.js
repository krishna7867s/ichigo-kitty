const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const express = require('express');
const cors = require('cors');

// Inicializar base de datos y las 20 tablas del proyecto
require('./models/db');
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
require('./models/marcaLicenciaModel');
require('./models/controlCalidadModel');
require('./models/promocionModel');
require('./models/incidenciaEnvioModel');

const authMiddleware = require('./middlewares/authMiddleware');
const authController = require('./controllers/authController');

// Importar las 21 rutas
const authRoutes = require('./routes/authRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const rolRoutes = require('./routes/rolRoutes');
const almacenRoutes = require('./routes/almacenRoutes');
const inventarioAlmacenRoutes = require('./routes/inventarioAlmacenRoutes');
const agenteEnvioRoutes = require('./routes/agenteEnvioRoutes');
const aduanaDespachoRoutes = require('./routes/aduanaDespachoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const detalleVentaRoutes = require('./routes/detalleVentaRoutes');
const metodoPagoRoutes = require('./routes/metodoPagoRoutes');
const pagoProveedorRoutes = require('./routes/pagoProveedorRoutes');
const marcaLicenciaRoutes = require('./routes/marcaLicenciaRoutes');
const controlCalidadRoutes = require('./routes/controlCalidadRoutes');
const promocionRoutes = require('./routes/promocionRoutes');
const incidenciaEnvioRoutes = require('./routes/incidenciaEnvioRoutes');
const herramientasRoutes = require('./routes/herramientasRoutes');

const app = express();

// Middlewares globales de Express.js
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz informativa de Express.js
app.get('/', (req, res) => {
  res.json({
    proyecto: 'Ichigo Kitty (Kitty Import - Costa Rica)',
    framework: 'Express.js',
    estado: 'activo',
    tablas: 20,
    controladores: 21
  });
});

// Rutas de autenticación (públicas y perfil protegido)
app.get('/api/auth/me', authMiddleware, authController.obtenerPerfil);
app.use('/api/auth', authRoutes);

// Rutas protegidas con JWT para las 20 entidades
app.use('/api/proveedores', authMiddleware, proveedorRoutes);
app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/productos', authMiddleware, productoRoutes);
app.use('/api/pedidos', authMiddleware, pedidoRoutes);
app.use('/api/detalle_pedido', authMiddleware, detallePedidoRoutes);
app.use('/api/detalles_pedido', authMiddleware, detallePedidoRoutes);
app.use('/api/usuarios', authMiddleware, usuarioRoutes);
app.use('/api/roles', authMiddleware, rolRoutes);
app.use('/api/almacenes', authMiddleware, almacenRoutes);
app.use('/api/inventario_almacen', authMiddleware, inventarioAlmacenRoutes);
app.use('/api/agentes_envio', authMiddleware, agenteEnvioRoutes);
app.use('/api/aduana_despachos', authMiddleware, aduanaDespachoRoutes);
app.use('/api/clientes', authMiddleware, clienteRoutes);
app.use('/api/ventas', authMiddleware, ventaRoutes);
app.use('/api/detalle_venta', authMiddleware, detalleVentaRoutes);
app.use('/api/metodos_pago', authMiddleware, metodoPagoRoutes);
app.use('/api/pagos_proveedor', authMiddleware, pagoProveedorRoutes);
app.use('/api/marcas_licencias', authMiddleware, marcaLicenciaRoutes);
app.use('/api/control_calidad', authMiddleware, controlCalidadRoutes);
app.use('/api/promociones_descuentos', authMiddleware, promocionRoutes);
app.use('/api/incidencias_envio', authMiddleware, incidenciaEnvioRoutes);
app.use('/api/herramientas', authMiddleware, herramientasRoutes);

// Manejo global de errores JSON en Express
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'El formato del JSON enviado no es válido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PUERTO = process.env.PUERTO || process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PUERTO, () => {
    console.log(`Servidor Express.js de Ichigo Kitty escuchando en http://localhost:${PUERTO}`);
  });
}

module.exports = app;

