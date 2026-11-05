const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS aduana_despachos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    agente_id INTEGER NOT NULL,
    numero_pedimento TEXT NOT NULL UNIQUE,
    arancel_mxn REAL NOT NULL DEFAULT 0 CHECK (arancel_mxn >= 0),
    estado_aduana TEXT NOT NULL CHECK (estado_aduana IN ('en_revision', 'liberado', 'retenido')),
    fecha_despacho TEXT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (agente_id) REFERENCES agentes_envio(id) ON DELETE RESTRICT
  )
`);

const consultaBase = `
  SELECT
    ad.id,
    ad.pedido_id,
    ad.agente_id,
    ae.nombre AS agente_nombre,
    ad.numero_pedimento,
    ad.arancel_mxn,
    ad.estado_aduana,
    ad.fecha_despacho
  FROM aduana_despachos ad
  JOIN agentes_envio ae ON ae.id = ad.agente_id
`;

function obtenerTodos() {
  return db.prepare(`${consultaBase} ORDER BY ad.id ASC`).all();
}

function obtenerPorId(id) {
  return db.prepare(`${consultaBase} WHERE ad.id = ?`).get(id);
}

function crear({ pedido_id, agente_id, numero_pedimento, arancel_mxn, estado_aduana, fecha_despacho }) {
  const fecha = fecha_despacho || new Date().toISOString();
  const res = db
    .prepare(
      'INSERT INTO aduana_despachos (pedido_id, agente_id, numero_pedimento, arancel_mxn, estado_aduana, fecha_despacho) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(pedido_id, agente_id, numero_pedimento, arancel_mxn, estado_aduana, fecha);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { pedido_id, agente_id, numero_pedimento, arancel_mxn, estado_aduana }) {
  db.prepare(
    'UPDATE aduana_despachos SET pedido_id = ?, agente_id = ?, numero_pedimento = ?, arancel_mxn = ?, estado_aduana = ? WHERE id = ?'
  ).run(pedido_id, agente_id, numero_pedimento, arancel_mxn, estado_aduana, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM aduana_despachos WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
