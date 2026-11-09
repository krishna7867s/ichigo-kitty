const express = require('express');
const router = express.Router();
const herramientasController = require('../controllers/herramientasController');

router.post('/calcular-importacion', herramientasController.calcularImportacion);
router.get('/alertas-stock', herramientasController.obtenerAlertasStock);

module.exports = router;
