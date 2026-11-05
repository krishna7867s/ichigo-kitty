const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proveedor_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    estado TEXT NOT NULL CHECK (estado IN ('pedido', 'en_transito', 'recibido', 'cancelado')),
    rastreo TEXT,
    costo_envio REAL NOT NULL DEFAULT 0 CHECK (costo_envio >= 0),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT
  )
`);

const consultaBasePedidos = `
  SELECT
    p.id,
    p.proveedor_id,
    pr.nombre AS proveedor_nombre,
    p.fecha,
    p.estado,
    p.rastreo,
    p.costo_envio,
    COALESCE(ROUND(SUM(dp.cantidad * dp.precio_unitario_cny), 2), 0) AS total_cny
  FROM pedidos p
  JOIN proveedores pr ON pr.id = p.proveedor_id
  LEFT JOIN detalle_pedido dp ON dp.pedido_id = p.id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBasePedidos} GROUP BY p.id ORDER BY p.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBasePedidos} WHERE p.id = ? GROUP BY p.id`).get(id);
}

function crear({ proveedor_id, fecha, estado, rastreo = null, costo_envio }) {
  const fechaRegistro = fecha || new Date().toISOString();
  const resultado = db.prepare(`
    INSERT INTO pedidos (proveedor_id, fecha, estado, rastreo, costo_envio)
    VALUES (?, ?, ?, ?, ?)
  `).run(proveedor_id, fechaRegistro, estado, rastreo, costo_envio);

  return obtenerPorId(resultado.lastInsertRowid);
}

// Si el pedido pasa a 'recibido', sumamos las cantidades al inventario en una sola transacción
const actualizarYRecibirTransaccion = db.transaction((id, datosPedido, recibirAhora) => {
  db.prepare(`
    UPDATE pedidos
    SET proveedor_id = ?, estado = ?, rastreo = ?, costo_envio = ?
    WHERE id = ?
  `).run(
    datosPedido.proveedor_id,
    datosPedido.estado,
    datosPedido.rastreo,
    datosPedido.costo_envio,
    id
  );

  if (recibirAhora) {
    const detalles = db.prepare('SELECT producto_id, cantidad FROM detalle_pedido WHERE pedido_id = ?').all(id);
    const sumarStock = db.prepare('UPDATE productos SET stock = stock + ? WHERE id = ?');

    for (const detalle of detalles) {
      sumarStock.run(detalle.cantidad, detalle.producto_id);
    }
  }

  return obtenerPorId(id);
});

function actualizar(id, datosPedido, recibirAhora = false) {
  return actualizarYRecibirTransaccion(id, datosPedido, recibirAhora);
}

function eliminar(id) {
  const eliminarTransaccion = db.transaction((pedidoId) => {
    db.prepare('DELETE FROM detalle_pedido WHERE pedido_id = ?').run(pedidoId);
    const resultado = db.prepare('DELETE FROM pedidos WHERE id = ?').run(pedidoId);
    return resultado.changes > 0;
  });

  return eliminarTransaccion(id);
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};

