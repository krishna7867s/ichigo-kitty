const db = require('../models/db');

function calcularImportacion(req, res) {
  const costoCny = Number(req.body.costo_cny) || 25;
  const cantidad = Math.max(1, parseInt(req.body.cantidad, 10) || 10);
  const pesoTotalKg = Math.max(0.1, Number(req.body.peso_total_kg) || 2.5);
  const tipoTransporte = req.body.tipo_transporte || 'Aéreo';
  const margenPorcentaje = Math.max(5, Number(req.body.margen_porcentaje) || 65);

  const TASA_CNY_POR_USD = 7.20;
  const TASA_CRC_POR_USD = 515;

  const tarifasKg = {
    'Aéreo': 11.50,
    'Exprés': 14.00,
    'Marítimo': 4.20
  };
  const tarifaKgUsd = tarifasKg[tipoTransporte] || 11.50;

  const subtotalFobCny = costoCny * cantidad;
  const subtotalFobUsd = subtotalFobCny / TASA_CNY_POR_USD;
  const fleteUsd = pesoTotalKg * tarifaKgUsd;
  const valorCifUsd = subtotalFobUsd + fleteUsd;

  const impuestosDuaUsd = valorCifUsd * 0.28;
  const impuestosDuaCrc = impuestosDuaUsd * TASA_CRC_POR_USD;

  const costoTotalUsd = valorCifUsd + impuestosDuaUsd;
  const costoTotalCrc = costoTotalUsd * TASA_CRC_POR_USD;

  const costoUnitarioUsd = costoTotalUsd / cantidad;
  const costoUnitarioCrc = costoTotalCrc / cantidad;

  const precioSugeridoUnitarioUsd = costoUnitarioUsd * (1 + margenPorcentaje / 100);
  const precioSugeridoUnitarioCrc = costoUnitarioCrc * (1 + margenPorcentaje / 100);
  const gananciaNetaLoteCrc = (precioSugeridoUnitarioCrc * cantidad) - costoTotalCrc;

  res.json({
    parametros: {
      costo_cny: costoCny,
      cantidad,
      peso_total_kg: pesoTotalKg,
      tipo_transporte: tipoTransporte,
      tarifa_kg_usd: tarifaKgUsd,
      margen_porcentaje: margenPorcentaje,
      tasa_cny_usd: TASA_CNY_POR_USD,
      tasa_usd_crc: TASA_CRC_POR_USD
    },
    desglose: {
      subtotal_fob_cny: Number(subtotalFobCny.toFixed(2)),
      subtotal_fob_usd: Number(subtotalFobUsd.toFixed(2)),
      flete_internacional_usd: Number(fleteUsd.toFixed(2)),
      valor_cif_aduana_usd: Number(valorCifUsd.toFixed(2)),
      impuestos_dua_tica_usd: Number(impuestosDuaUsd.toFixed(2)),
      impuestos_dua_tica_crc: Math.round(impuestosDuaCrc),
      costo_total_lote_usd: Number(costoTotalUsd.toFixed(2)),
      costo_total_lote_crc: Math.round(costoTotalCrc),
      costo_unitario_usd: Number(costoUnitarioUsd.toFixed(2)),
      costo_unitario_crc: Math.round(costoUnitarioCrc),
      precio_sugerido_usd: Number(precioSugeridoUnitarioUsd.toFixed(2)),
      precio_sugerido_crc: Math.round(precioSugeridoUnitarioCrc),
      ganancia_neta_lote_crc: Math.round(gananciaNetaLoteCrc)
    }
  });
}

function obtenerAlertasStock(req, res) {
  const limite = Math.max(1, parseInt(req.query.limite, 10) || 15);
  const productosBajos = db.prepare(`
    SELECT
      p.id,
      p.nombre,
      p.stock,
      p.precio_compra_cny,
      p.precio_venta,
      c.nombre AS categoria_nombre,
      pr.nombre AS proveedor_nombre,
      pr.plataforma AS proveedor_plataforma
    FROM productos p
    LEFT JOIN categorias c ON c.id = p.categoria_id
    LEFT JOIN proveedores pr ON pr.id = p.proveedor_id
    WHERE p.stock <= ?
    ORDER BY p.stock ASC
  `).all(limite);

  res.json(productosBajos);
}

module.exports = {
  calcularImportacion,
  obtenerAlertasStock
};
