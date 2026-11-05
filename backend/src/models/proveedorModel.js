const db = require('./db');

db.exec(`
  CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    plataforma TEXT NOT NULL CHECK (plataforma IN ('Taobao', '1688', 'AliExpress')),
    ciudad TEXT,
    contacto TEXT NOT NULL,
    calificacion INTEGER CHECK (calificacion IS NULL OR (calificacion >= 1 AND calificacion <= 5))
  )
`);

function obtenerTodos() {
  return db.prepare('SELECT * FROM proveedores ORDER BY id ASC').all();
}

function obtenerPorId(id) {
  return db.prepare('SELECT * FROM proveedores WHERE id = ?').get(id);
}

function crear({ nombre, plataforma, ciudad = null, contacto, calificacion = null }) {
  const resultado = db.prepare(`
    INSERT INTO proveedores (nombre, plataforma, ciudad, contacto, calificacion)
    VALUES (?, ?, ?, ?, ?)
  `).run(nombre, plataforma, ciudad, contacto, calificacion);

  return obtenerPorId(resultado.lastInsertRowid);
}

function actualizar(id, { nombre, plataforma, ciudad = null, contacto, calificacion = null }) {
  db.prepare(`
    UPDATE proveedores
    SET nombre = ?, plataforma = ?, ciudad = ?, contacto = ?, calificacion = ?
    WHERE id = ?
  `).run(nombre, plataforma, ciudad, contacto, calificacion, id);

  return obtenerPorId(id);
}

function tieneProductosAsociados(id) {
  const fila = db.prepare('SELECT COUNT(*) AS total FROM productos WHERE proveedor_id = ?').get(id);
  return fila.total > 0;
}

function tienePedidosAsociados(id) {
  const fila = db.prepare('SELECT COUNT(*) AS total FROM pedidos WHERE proveedor_id = ?').get(id);
  return fila.total > 0;
}

function eliminar(id) {
  const resultado = db.prepare('DELETE FROM proveedores WHERE id = ?').run(id);
  return resultado.changes > 0;
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  tieneProductosAsociados,
  tienePedidosAsociados,
  eliminar
};

