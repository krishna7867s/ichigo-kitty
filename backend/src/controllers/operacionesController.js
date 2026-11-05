const rolModel = require('../models/rolModel');
const almacenModel = require('../models/almacenModel');
const inventarioAlmacenModel = require('../models/inventarioAlmacenModel');
const agenteEnvioModel = require('../models/agenteEnvioModel');
const aduanaDespachoModel = require('../models/aduanaDespachoModel');
const clienteModel = require('../models/clienteModel');
const ventaModel = require('../models/ventaModel');
const detalleVentaModel = require('../models/detalleVentaModel');
const metodoPagoModel = require('../models/metodoPagoModel');
const pagoProveedorModel = require('../models/pagoProveedorModel');
const usuarioModel = require('../models/usuario');
const db = require('../models/db');

function crearControladorGenerico(modelo, nombreEntidad, validarFn) {
  return {
    listar(req, res) {
      res.status(200).json(modelo.obtenerTodos());
    },
    obtener(req, res) {
      const registro = modelo.obtenerPorId(Number(req.params.id));
      if (!registro) {
        return res.status(404).json({ error: `${nombreEntidad} no encontrado` });
      }
      res.status(200).json(registro);
    },
    crear(req, res) {
      const error = validarFn ? validarFn(req.body) : null;
      if (error) {
        return res.status(400).json({ error });
      }
      try {
        const creado = modelo.crear(req.body);
        res.status(201).json(creado);
      } catch (err) {
        res.status(400).json({ error: `Error al guardar ${nombreEntidad.toLowerCase()}: datos inválidos o duplicados` });
      }
    },
    actualizar(req, res) {
      const id = Number(req.params.id);
      if (!modelo.obtenerPorId(id)) {
        return res.status(404).json({ error: `${nombreEntidad} no encontrado` });
      }
      const error = validarFn ? validarFn(req.body) : null;
      if (error) {
        return res.status(400).json({ error });
      }
      try {
        const actualizado = modelo.actualizar(id, req.body);
        res.status(200).json(actualizado);
      } catch (err) {
        res.status(400).json({ error: `Error al actualizar ${nombreEntidad.toLowerCase()}` });
      }
    },
    eliminar(req, res) {
      const id = Number(req.params.id);
      if (!modelo.obtenerPorId(id)) {
        return res.status(404).json({ error: `${nombreEntidad} no encontrado` });
      }
      try {
        modelo.eliminar(id);
        res.status(204).send();
      } catch (err) {
        res.status(409).json({
          error: `No se puede eliminar ${nombreEntidad.toLowerCase()} porque tiene registros asociados`
        });
      }
    }
  };
}

function listarUsuarios(req, res) {
  const usuarios = db
    .prepare('SELECT id, nombre, correo, fecha_creacion FROM usuarios ORDER BY id ASC')
    .all();
  res.status(200).json(usuarios);
}

const controladores = {
  usuarios: { listar: listarUsuarios },
  roles: crearControladorGenerico(rolModel, 'Rol', (b) =>
    !b.nombre || !String(b.nombre).trim() ? 'El nombre del rol es obligatorio' : null
  ),
  almacenes: crearControladorGenerico(almacenModel, 'Almacén', (b) => {
    if (!b.nombre || !String(b.nombre).trim()) return 'El nombre del almacén es obligatorio';
    if (!b.ubicacion || !String(b.ubicacion).trim()) return 'La ubicación es obligatoria';
    if (!Number(b.capacidad_maxima) || Number(b.capacidad_maxima) <= 0)
      return 'La capacidad máxima debe ser mayor a 0';
    if (!b.responsable || !String(b.responsable).trim()) return 'El responsable es obligatorio';
    return null;
  }),
  inventario_almacen: crearControladorGenerico(inventarioAlmacenModel, 'Inventario de almacén', (b) => {
    if (!Number(b.almacen_id)) return 'El almacén es obligatorio';
    if (!Number(b.producto_id)) return 'El producto es obligatorio';
    if (b.cantidad === undefined || Number(b.cantidad) < 0) return 'La cantidad debe ser mayor o igual a 0';
    return null;
  }),
  agentes_envio: crearControladorGenerico(agenteEnvioModel, 'Agente de envío', (b) => {
    if (!b.nombre || !String(b.nombre).trim()) return 'El nombre del agente es obligatorio';
    if (!['Aéreo', 'Marítimo', 'Exprés'].includes(b.tipo_transporte))
      return 'El tipo de transporte debe ser Aéreo, Marítimo o Exprés';
    if (!Number(b.tarifa_kg_usd) || Number(b.tarifa_kg_usd) <= 0)
      return 'La tarifa por kg debe ser mayor a 0';
    if (!b.contacto || !String(b.contacto).trim()) return 'El contacto es obligatorio';
    return null;
  }),
  aduana_despachos: crearControladorGenerico(aduanaDespachoModel, 'Despacho aduanal', (b) => {
    if (!Number(b.pedido_id)) return 'El pedido es obligatorio';
    if (!Number(b.agente_id)) return 'El agente de envío es obligatorio';
    if (!b.numero_pedimento || !String(b.numero_pedimento).trim())
      return 'El número de pedimento es obligatorio';
    if (!['en_revision', 'liberado', 'retenido'].includes(b.estado_aduana))
      return 'El estado de aduana debe ser en_revision, liberado o retenido';
    return null;
  }),
  clientes: crearControladorGenerico(clienteModel, 'Cliente', (b) => {
    if (!b.nombre || !String(b.nombre).trim()) return 'El nombre del cliente es obligatorio';
    if (!b.correo || !String(b.correo).trim()) return 'El correo del cliente es obligatorio';
    return null;
  }),
  ventas: crearControladorGenerico(ventaModel, 'Venta', (b) => {
    if (!Number(b.cliente_id)) return 'El cliente es obligatorio';
    if (b.total === undefined || Number(b.total) < 0) return 'El total debe ser mayor o igual a 0';
    return null;
  }),
  detalle_venta: crearControladorGenerico(detalleVentaModel, 'Detalle de venta', (b) => {
    if (!Number(b.venta_id)) return 'La venta es obligatoria';
    if (!Number(b.producto_id)) return 'El producto es obligatorio';
    if (!Number(b.cantidad) || Number(b.cantidad) <= 0) return 'La cantidad debe ser mayor a 0';
    if (!Number(b.precio_unitario) || Number(b.precio_unitario) <= 0)
      return 'El precio unitario debe ser mayor a 0';
    return null;
  }),
  metodos_pago: crearControladorGenerico(metodoPagoModel, 'Método de pago', (b) => {
    if (!b.nombre || !String(b.nombre).trim()) return 'El nombre del método de pago es obligatorio';
    return null;
  }),
  pagos_proveedor: crearControladorGenerico(pagoProveedorModel, 'Pago a proveedor', (b) => {
    if (!Number(b.pedido_id)) return 'El pedido es obligatorio';
    if (!Number(b.metodo_pago_id)) return 'El método de pago es obligatorio';
    if (!Number(b.monto_cny) || Number(b.monto_cny) <= 0) return 'El monto en CNY debe ser mayor a 0';
    if (!b.referencia || !String(b.referencia).trim()) return 'La referencia de pago es obligatoria';
    return null;
  })
};

module.exports = controladores;
