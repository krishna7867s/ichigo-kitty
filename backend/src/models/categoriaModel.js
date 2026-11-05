const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
  )
`);

function obtenerTodas() {
  return db.prepare('SELECT * FROM categorias ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM categorias WHERE id = ?').get(id);
}

function obtenerPorNombre(nombre) {
  return db.prepare('SELECT * FROM categorias WHERE LOWER(nombre) = LOWER(?)').get(nombre);
}

function crear({ nombre, descripcion = null }) {
  const resultado = db.prepare(`
    INSERT INTO categorias (nombre, descripcion)
    VALUES (?, ?)
  `).run(nombre, descripcion);

  return obtenerPorId(resultado.lastInsertRowid);
}

function actualizar(id, { nombre, descripcion = null }) {
  db.prepare(`
    UPDATE categorias
    SET nombre = ?, descripcion = ?
    WHERE id = ?
  `).run(nombre, descripcion, id);

  return obtenerPorId(id);
}

function tieneProductosAsociados(id) {
  const fila = db.prepare('SELECT COUNT(*) AS total FROM productos WHERE categoria_id = ?').get(id);
  return fila.total > 0;
}

function eliminar(id) {
  const resultado = db.prepare('DELETE FROM categorias WHERE id = ?').run(id);
  return resultado.changes > 0;
}

module.exports = {
  obtenerTodas,
  obtenerPorId,
  obtenerPorNombre,
  crear,
  actualizar,
  tieneProductosAsociados,
  eliminar
};

