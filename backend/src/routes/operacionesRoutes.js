const express = require('express');
const controladores = require('../controllers/operacionesController');

function crearRouterEntidad(ctrl) {
  const router = express.Router();
  router.get('/', ctrl.listar);
  if (ctrl.obtener) router.get('/:id', ctrl.obtener);
  if (ctrl.crear) router.post('/', ctrl.crear);
  if (ctrl.actualizar) router.put('/:id', ctrl.actualizar);
  if (ctrl.eliminar) router.delete('/:id', ctrl.eliminar);
  return router;
}

module.exports = {
  usuariosRoutes: crearRouterEntidad(controladores.usuarios),
  rolesRoutes: crearRouterEntidad(controladores.roles),
  almacenesRoutes: crearRouterEntidad(controladores.almacenes),
  inventarioAlmacenRoutes: crearRouterEntidad(controladores.inventario_almacen),
  agentesEnvioRoutes: crearRouterEntidad(controladores.agentes_envio),
  aduanaDespachosRoutes: crearRouterEntidad(controladores.aduana_despachos),
  clientesRoutes: crearRouterEntidad(controladores.clientes),
  ventasRoutes: crearRouterEntidad(controladores.ventas),
  detalleVentaRoutes: crearRouterEntidad(controladores.detalle_venta),
  metodosPagoRoutes: crearRouterEntidad(controladores.metodos_pago),
  pagosProveedorRoutes: crearRouterEntidad(controladores.pagos_proveedor),
  marcasLicenciasRoutes: crearRouterEntidad(controladores.marcas_licencias),
  controlCalidadRoutes: crearRouterEntidad(controladores.control_calidad),
  promocionesDescuentosRoutes: crearRouterEntidad(controladores.promociones_descuentos),
  incidenciasEnvioRoutes: crearRouterEntidad(controladores.incidencias_envio)
};
