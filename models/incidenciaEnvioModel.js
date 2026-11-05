const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS incidencias_envio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    tipo_incidencia TEXT NOT NULL,
    descripcion_problema TEXT NOT NULL,
    solucion_aplicada TEXT NOT NULL,
    estado_incidencia TEXT NOT NULL DEFAULT 'Resuelta' CHECK (estado_incidencia IN ('Abierta', 'En seguimiento', 'Resuelta')),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM incidencias_envio ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM incidencias_envio WHERE id = ?').get(id);
}

function crear({ pedido_id, tipo_incidencia, descripcion_problema, solucion_aplicada, estado_incidencia = 'Resuelta' }) {
  const res = db
    .prepare(
      'INSERT INTO incidencias_envio (pedido_id, tipo_incidencia, descripcion_problema, solucion_aplicada, estado_incidencia) VALUES (?, ?, ?, ?, ?)'
    )
    .run(pedido_id, tipo_incidencia, descripcion_problema, solucion_aplicada, estado_incidencia);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { pedido_id, tipo_incidencia, descripcion_problema, solucion_aplicada, estado_incidencia = 'Resuelta' }) {
  db.prepare(
    'UPDATE incidencias_envio SET pedido_id = ?, tipo_incidencia = ?, descripcion_problema = ?, solucion_aplicada = ?, estado_incidencia = ? WHERE id = ?'
  ).run(pedido_id, tipo_incidencia, descripcion_problema, solucion_aplicada, estado_incidencia, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM incidencias_envio WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

