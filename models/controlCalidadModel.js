const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS control_calidad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    unidades_revisadas INTEGER NOT NULL CHECK (unidades_revisadas > 0),
    resultado TEXT NOT NULL CHECK (resultado IN ('Aprobado', 'Con detalles', 'Rechazado')),
    descripcion_inspeccion TEXT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
  )
`);

const consultaBase = `
  SELECT
    cc.id,
    cc.pedido_id,
    cc.producto_id,
    p.nombre AS producto_nombre,
    cc.unidades_revisadas,
    cc.resultado,
    cc.descripcion_inspeccion
  FROM control_calidad cc
  JOIN productos p ON p.id = cc.producto_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBase} ORDER BY cc.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBase} WHERE cc.id = ?`).get(id);
}

function crear({ pedido_id, producto_id, unidades_revisadas, resultado, descripcion_inspeccion }) {
  const res = db
    .prepare(
      'INSERT INTO control_calidad (pedido_id, producto_id, unidades_revisadas, resultado, descripcion_inspeccion) VALUES (?, ?, ?, ?, ?)'
    )
    .run(pedido_id, producto_id, unidades_revisadas, resultado, descripcion_inspeccion);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { pedido_id, producto_id, unidades_revisadas, resultado, descripcion_inspeccion }) {
  db.prepare(
    'UPDATE control_calidad SET pedido_id = ?, producto_id = ?, unidades_revisadas = ?, resultado = ?, descripcion_inspeccion = ? WHERE id = ?'
  ).run(pedido_id, producto_id, unidades_revisadas, resultado, descripcion_inspeccion, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM control_calidad WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

