const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    usuario_id INTEGER,
    fecha TEXT NOT NULL,
    total REAL NOT NULL DEFAULT 0 CHECK (total >= 0),
    estado_venta TEXT NOT NULL DEFAULT 'pagada' CHECK (estado_venta IN ('pendiente', 'pagada', 'enviada', 'cancelada')),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
  )
`);

const consultaBase = `
  SELECT
    v.id,
    v.cliente_id,
    c.nombre AS cliente_nombre,
    v.usuario_id,
    v.fecha,
    v.total,
    v.estado_venta
  FROM ventas v
  JOIN clientes c ON c.id = v.cliente_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBase} ORDER BY v.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBase} WHERE v.id = ?`).get(id);
}

function crear({ cliente_id, usuario_id = null, fecha, total, estado_venta = 'pagada' }) {
  const fechaReg = fecha || new Date().toISOString();
  const res = db
    .prepare(
      'INSERT INTO ventas (cliente_id, usuario_id, fecha, total, estado_venta) VALUES (?, ?, ?, ?, ?)'
    )
    .run(cliente_id, usuario_id, fechaReg, total, estado_venta);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { cliente_id, total, estado_venta }) {
  db.prepare(
    'UPDATE ventas SET cliente_id = ?, total = ?, estado_venta = ? WHERE id = ?'
  ).run(cliente_id, total, estado_venta, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM ventas WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
