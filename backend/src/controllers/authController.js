const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuario');

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function registrar(req, res) {
  const { nombre, correo } = req.body;
  const password = req.body.password !== undefined ? req.body.password : req.body.contrasena;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  if (typeof correo !== 'string' || correo.trim() === '') {
    return res.status(400).json({ error: 'El correo es obligatorio' });
  }

  const correoLimpio = correo.trim().toLowerCase();
  if (!REGEX_CORREO.test(correoLimpio)) {
    return res.status(400).json({ error: 'El correo no tiene un formato válido' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  const existente = usuarioModel.obtenerPorCorreo(correoLimpio);
  if (existente) {
    return res.status(400).json({ error: 'El correo ya está registrado' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const nuevoUsuario = usuarioModel.crear({
    nombre: nombre.trim(),
    correo: correoLimpio,
    password_hash: passwordHash,
    fecha_creacion: new Date().toISOString()
  });

  res.status(201).json(nuevoUsuario);
}

function iniciarSesion(req, res) {
  const { correo } = req.body;
  const password = req.body.password !== undefined ? req.body.password : req.body.contrasena;

  if (typeof correo !== 'string' || typeof password !== 'string' || !correo.trim() || !password) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  const registroUsuario = usuarioModel.obtenerCredencialesPorCorreo(correo.trim());
  if (!registroUsuario) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  const coincide = bcrypt.compareSync(password, registroUsuario.password_hash);
  if (!coincide) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  const token = jwt.sign(
    { id: registroUsuario.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRA }
  );

  const usuarioPublico = {
    id: registroUsuario.id,
    nombre: registroUsuario.nombre,
    correo: registroUsuario.correo,
    fecha_creacion: registroUsuario.fecha_creacion
  };

  res.status(200).json({
    token,
    usuario: usuarioPublico
  });
}

function obtenerPerfil(req, res) {
  const usuario = usuarioModel.obtenerPorId(req.usuarioId);
  if (!usuario) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  res.status(200).json(usuario);
}

module.exports = {
  registrar,
  iniciarSesion,
  obtenerPerfil
};

