const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS agentes_envio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo_transporte TEXT NOT NULL CHECK (tipo_transporte IN ('Aéreo', 'Marítimo', 'Exprés')),
    tarifa_kg_usd REAL NOT NULL CHECK (tarifa_kg_usd > 0),
    contacto TEXT NOT NULL,
    pais_origen TEXT NOT NULL DEFAULT 'China'
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM agentes_envio ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM agentes_envio WHERE id = ?').get(id);
}

function crear({ nombre, tipo_transporte, tarifa_kg_usd, contacto, pais_origen = 'China' }) {
  const res = db
    .prepare(
      'INSERT INTO agentes_envio (nombre, tipo_transporte, tarifa_kg_usd, contacto, pais_origen) VALUES (?, ?, ?, ?, ?)'
    )
    .run(nombre, tipo_transporte, tarifa_kg_usd, contacto, pais_origen);
  return obtenerPorId(res.lastInsertRowid);
}

function actualizar(id, { nombre, tipo_transporte, tarifa_kg_usd, contacto, pais_origen = 'China' }) {
  db.prepare(
    'UPDATE agentes_envio SET nombre = ?, tipo_transporte = ?, tarifa_kg_usd = ?, contacto = ?, pais_origen = ? WHERE id = ?'
  ).run(nombre, tipo_transporte, tarifa_kg_usd, contacto, pais_origen, id);
  return obtenerPorId(id);
}

function eliminar(id) {
  return db.prepare('DELETE FROM agentes_envio WHERE id = ?').run(id).changes > 0;
}

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };

