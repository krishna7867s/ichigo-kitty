const path = require('path');
const Database = require('better-sqlite3');

const rutaBaseDatos = path.join(__dirname, '../../kitty_import.db');
const db = new Database(rutaBaseDatos);

// Activar restricción de llaves foráneas en SQLite
db.pragma('foreign_keys = ON');

module.exports = db;

