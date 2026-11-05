const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS pagos_proveedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    metodo_pago_id INTEGER NOT NULL,
    monto_cny REAL NOT NULL CHECK (monto_cny > 0),
    tipo_cambio REAL NOT NULL DEFAULT 2.75 CHECK (tipo_cambio > 0),
    referencia TEXT NOT NULL,
    fecha_pago TEXT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago(id) ON DELETE RESTRICT
  )
`);

const consultaBase = `
  SELECT
    pp.id,
    pp.pedido_id,
    pp.metodo_pago_id,
    mp.nombre AS metodo_pago_nombre,
    pp.monto_cny,
    pp.tipo_cambio,
    pp.referencia,
    pp.fecha_pago
  FROM pagos_proveedor pp
  JOIN metodos_pago mp ON mp.id = pp.metodo_pago_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBase} ORDER BY pp.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBase} WHERE pp.id = ?`).get(id);
}

function crear({ pedido_id, metodo_pago_id, monto_cny, tipo_cambio = 2.75, referencia, fecha_pago }) {
  const fecha = fecha_pago || new Date().toISOString();
  const res = db
    .prepare(
      'INSERT INTO pagos_proveedor (pedido_id, metodo_pago_id, monto_cny, tipo_cambio, referencia, fecha_pago) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(pedido_id, metodo_pago_id, monto_cny, tipo_cambio, referencia, fecha);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { pedido_id, metodo_pago_id, monto_cny, tipo_cambio = 2.75, referencia }) {
  db.prepare(
    'UPDATE pagos_proveedor SET pedido_id = ?, metodo_pago_id = ?, monto_cny = ?, tipo_cambio = ?, referencia = ? WHERE id = ?'
  ).run(pedido_id, metodo_pago_id, monto_cny, tipo_cambio, referencia, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM pagos_proveedor WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

