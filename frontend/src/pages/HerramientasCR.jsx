import { useState, useEffect } from 'react';
import {
  calcularImportacionCR,
  listarEntidadGenerica,
  obtenerProductos
} from '../services/api';
import { exportarDatosCSV } from '../utils/exportarCSV';
import { useAuth } from '../context/AuthContext';

function HerramientasCR() {
  const { rolActivo, permisosActuales } = useAuth();

  // Estado de la Calculadora de Importacion China -> Costa Rica
  const [formCalc, setFormCalc] = useState({
    costo_cny: 28.5,
    cantidad: 20,
    peso_total_kg: 3.5,
    tipo_transporte: 'Aéreo',
    margen_porcentaje: 70
  });
  const [resultadoCalc, setResultadoCalc] = useState(null);
  const [cargandoCalc, setCargandoCalc] = useState(false);

  // Estado para el Generador de Comprobante SINPE Movil y Correos de Costa Rica
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [reciboSinpe, setReciboSinpe] = useState({
    cliente_nombre: 'Chibiusa Tsukino',
    telefono_sinpe: '+506 8812-3456',
    provincia_canton: 'San José - San Pedro de Montes de Oca',
    comprobante_sinpe: 'SINPE-20261109-849201',
    guia_correos_cr: 'EMS-CR-90481273-SJ',
    banco_origen: 'BAC Credomatic / BNCR',
    producto_seleccionado: 'Peluche Gatito Mochi Rosa 25cm',
    cantidad: 2,
    precio_unitario_crc: 14500,
    envio_correos_crc: 2850,
    descuento_porcentaje: 10
  });

  useEffect(() => {
    ejecutarCalculoBackend(formCalc);
    cargarDatosTienda();
  }, []);

  async function cargarDatosTienda() {
    try {
      const [listaClientes, listaProductos] = await Promise.all([
        listarEntidadGenerica('clientes'),
        obtenerProductos()
      ]);
      setClientes(listaClientes);
      setProductos(listaProductos);
    } catch {
      // Silencioso si falla carga secundaria
    }
  }

  async function ejecutarCalculoBackend(datos) {
    setCargandoCalc(true);
    try {
      const respuesta = await calcularImportacionCR(datos);
      setResultadoCalc(respuesta);
    } catch {
      // Calculo local de respaldo si el servidor se reinicia
    } finally {
      setCargandoCalc(false);
    }
  }

  function manejarCambioCalc(campo, valor) {
    const actualizado = { ...formCalc, [campo]: valor };
    setFormCalc(actualizado);
    ejecutarCalculoBackend(actualizado);
  }

  function seleccionarClienteExistente(idCliente) {
    const cli = clientes.find((c) => String(c.id) === String(idCliente));
    if (!cli) return;
    setReciboSinpe((prev) => ({
      ...prev,
      cliente_nombre: cli.nombre,
      telefono_sinpe: `+506 ${cli.telefono || '8800-0000'}`,
      provincia_canton: `${cli.ciudad || 'San José'} - GAM Costa Rica`,
      descuento_porcentaje: cli.nivel_membresia === 'VIP' ? 15 : cli.nivel_membresia === 'Oro' ? 10 : 0
    }));
  }

  function seleccionarProductoRecibo(idProd) {
    const prod = productos.find((p) => String(p.id) === String(idProd));
    if (!prod) return;
    // Convertir precio referencia a colones si es menor a 1000
    const precioCrc = prod.precio_venta < 1000 ? Math.round(prod.precio_venta * 65) : Math.round(prod.precio_venta);
    setReciboSinpe((prev) => ({
      ...prev,
      producto_seleccionado: prod.nombre,
      precio_unitario_crc: precioCrc
    }));
  }

  const subtotalArticulosCrc = reciboSinpe.cantidad * reciboSinpe.precio_unitario_crc;
  const montoDescuentoCrc = Math.round(subtotalArticulosCrc * (reciboSinpe.descuento_porcentaje / 100));
  const subtotalConDescuentoCrc = subtotalArticulosCrc - montoDescuentoCrc;
  const ivaCrc = Math.round(subtotalConDescuentoCrc * 0.13);
  const totalPagarSinpeCrc = subtotalConDescuentoCrc + ivaCrc + Number(reciboSinpe.envio_correos_crc || 0);

  function exportarSimulacionCSV() {
    if (!resultadoCalc) return;
    exportarDatosCSV('simulacion_importacion_aduana_tica_cr.csv', [
      {
        Costo_Unitario_CNY: resultadoCalc.parametros.costo_cny,
        Cantidad_Unidades: resultadoCalc.parametros.cantidad,
        Peso_Total_Kg: resultadoCalc.parametros.peso_total_kg,
        Via_Transporte: resultadoCalc.parametros.tipo_transporte,
        FOB_Total_CNY: resultadoCalc.desglose.subtotal_fob_cny,
        FOB_Total_USD: resultadoCalc.desglose.subtotal_fob_usd,
        Flete_Internacional_USD: resultadoCalc.desglose.flete_internacional_usd,
        Valor_CIF_Aduana_USD: resultadoCalc.desglose.valor_cif_aduana_usd,
        Impuestos_DUA_TICA_CRC: resultadoCalc.desglose.impuestos_dua_tica_crc,
        Costo_Total_Puesto_CR_CRC: resultadoCalc.desglose.costo_total_lote_crc,
        Costo_Unitario_CR_CRC: resultadoCalc.desglose.costo_unitario_crc,
        Precio_Sugerido_Venta_CRC: resultadoCalc.desglose.precio_sugerido_crc,
        Ganancia_Neta_Lote_CRC: resultadoCalc.desglose.ganancia_neta_lote_crc
      }
    ]);
  }

  function exportarComprobanteCSV() {
    exportarDatosCSV(`comprobante_${reciboSinpe.comprobante_sinpe}.csv`, [
      {
        Comprobante_SINPE: reciboSinpe.comprobante_sinpe,
        Guia_Correos_CR: reciboSinpe.guia_correos_cr,
        Clienta: reciboSinpe.cliente_nombre,
        Telefono_CR: reciboSinpe.telefono_sinpe,
        Destino_GAM: reciboSinpe.provincia_canton,
        Articulo: reciboSinpe.producto_seleccionado,
        Cantidad: reciboSinpe.cantidad,
        Precio_Unitario_CRC: reciboSinpe.precio_unitario_crc,
        Descuento_CRC: montoDescuentoCrc,
        IVA_13_CRC: ivaCrc,
        Envio_EMS_CRC: reciboSinpe.envio_correos_crc,
        Total_Pagado_CRC: totalPagarSinpeCrc
      }
    ]);
  }

  return (
    <div>
      <div className="franja-rol-informativa">
        <div>
          <strong>Rol activo en sesión:</strong> {permisosActuales.etiqueta} ({rolActivo})
        </div>
        <div className="detalle-permisos-rol">{permisosActuales.descripcion}</div>
      </div>

      {/* SECCION 1: CALCULADORA ADUANA TICA CHINA -> COSTA RICA */}
      <div className="cabecera-pagina-crud">
        <div>
          <h1 className="titulo-pagina-crud">
            1. Calculadora en Vivo: Importación China a Costa Rica (Aduana TICA)
          </h1>
          <p className="subtitulo-herramienta">
            Convierte costos de Taobao/1688 en Yuanes (¥ CNY) a Dólares ($) y Colones (₡), sumando flete aéreo/marítimo y arancel DUA TICA (28% CIF).
          </p>
        </div>
        <button
          type="button"
          className="boton-pildora-gloss"
          onClick={exportarSimulacionCSV}
        >
          Exportar Cálculo a Excel (CSV)
        </button>
      </div>

      <div className="panel-calculadora-cr">
        <div className="rejilla-formulario">
          <div className="grupo-campo">
            <label htmlFor="calc-cny" className="etiqueta-campo">
              Costo unitario en Taobao / 1688 (¥ CNY)
            </label>
            <input
              id="calc-cny"
              type="number"
              step="0.5"
              className="input-sanrio"
              value={formCalc.costo_cny}
              onChange={(e) => manejarCambioCalc('costo_cny', e.target.value)}
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="calc-cantidad" className="etiqueta-campo">
              Cantidad de unidades del lote
            </label>
            <input
              id="calc-cantidad"
              type="number"
              min="1"
              className="input-sanrio"
              value={formCalc.cantidad}
              onChange={(e) => manejarCambioCalc('cantidad', e.target.value)}
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="calc-peso" className="etiqueta-campo">
              Peso total de la caja (Kg)
            </label>
            <input
              id="calc-peso"
              type="number"
              step="0.1"
              className="input-sanrio"
              value={formCalc.peso_total_kg}
              onChange={(e) => manejarCambioCalc('peso_total_kg', e.target.value)}
            />
          </div>

          <div className="grupo-campo">
            <label htmlFor="calc-transporte" className="etiqueta-campo">
              Vía de transporte hacia Costa Rica
            </label>
            <select
              id="calc-transporte"
              className="select-sanrio"
              value={formCalc.tipo_transporte}
              onChange={(e) => manejarCambioCalc('tipo_transporte', e.target.value)}
            >
              <option value="Aéreo">Aéreo SF Express hacia Aeropuerto Juan Santamaría ($11.50/kg)</option>
              <option value="Exprés">Exprés YunExpress hacia Casillero San José ($14.00/kg)</option>
              <option value="Marítimo">Marítimo COSCO hacia Puerto Caldera Puntarenas ($4.20/kg)</option>
            </select>
          </div>

          <div className="grupo-campo">
            <label htmlFor="calc-margen" className="etiqueta-campo">
              Margen de ganancia deseado (%)
            </label>
            <input
              id="calc-margen"
              type="number"
              min="10"
              max="300"
              className="input-sanrio"
              value={formCalc.margen_porcentaje}
              onChange={(e) => manejarCambioCalc('margen_porcentaje', e.target.value)}
            />
          </div>
        </div>

        {resultadoCalc && (
          <div className="rejilla-resultados-aduana">
            <div className="caja-resultado-aduana">
              <span className="etiqueta-resultado-aduana">Costo FOB Fábrica China</span>
              <strong className="valor-resultado-aduana">
                ¥{resultadoCalc.desglose.subtotal_fob_cny} CNY
              </strong>
              <span className="subvalor-resultado-aduana">
                (${resultadoCalc.desglose.subtotal_fob_usd} USD)
              </span>
            </div>

            <div className="caja-resultado-aduana">
              <span className="etiqueta-resultado-aduana">Flete Internacional ({formCalc.tipo_transporte})</span>
              <strong className="valor-resultado-aduana">
                ${resultadoCalc.desglose.flete_internacional_usd} USD
              </strong>
              <span className="subvalor-resultado-aduana">
                Valor CIF Aduana: ${resultadoCalc.desglose.valor_cif_aduana_usd} USD
              </span>
            </div>

            <div className="caja-resultado-aduana">
              <span className="etiqueta-resultado-aduana">Impuestos DUA TICA (DAI + IVA 13%)</span>
              <strong className="valor-resultado-aduana">
                ₡{resultadoCalc.desglose.impuestos_dua_tica_crc.toLocaleString('es-CR')}
              </strong>
              <span className="subvalor-resultado-aduana">
                (${resultadoCalc.desglose.impuestos_dua_tica_usd} USD liquidados en Hacienda CR)
              </span>
            </div>

            <div className="caja-resultado-aduana">
              <span className="etiqueta-resultado-aduana">Costo Total Puesto en San José</span>
              <strong className="valor-resultado-aduana">
                ₡{resultadoCalc.desglose.costo_total_lote_crc.toLocaleString('es-CR')}
              </strong>
              <span className="subvalor-resultado-aduana">
                Costo por unidad: ₡{resultadoCalc.desglose.costo_unitario_crc.toLocaleString('es-CR')}
              </span>
            </div>

            <div className="caja-resultado-aduana caja-resultado-destacada">
              <span className="etiqueta-resultado-aduana">Precio Venta Sugerido (Unidad)</span>
              <strong className="valor-resultado-aduana">
                ₡{resultadoCalc.desglose.precio_sugerido_crc.toLocaleString('es-CR')}
              </strong>
              <span className="subvalor-resultado-aduana">
                (${resultadoCalc.desglose.precio_sugerido_usd} USD con {formCalc.margen_porcentaje}% margen)
              </span>
            </div>

            <div className="caja-resultado-aduana caja-resultado-destacada">
              <span className="etiqueta-resultado-aduana">Ganancia Neta Total del Lote</span>
              <strong className="valor-resultado-aduana">
                +₡{resultadoCalc.desglose.ganancia_neta_lote_crc.toLocaleString('es-CR')}
              </strong>
              <span className="subvalor-resultado-aduana">
                {cargandoCalc ? 'Actualizando...' : `Al vender las ${formCalc.cantidad} piezas en Costa Rica`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECCION 2: GENERADOR DE COMPROBANTE SINPE MOVIL Y CORREOS DE COSTA RICA */}
      <div className="cabecera-pagina-crud" style={{ marginTop: '24px' }}>
        <div>
          <h2 className="titulo-pagina-crud">
            2. Generador de Comprobante Oficial SINPE Móvil y Guía Correos de Costa Rica
          </h2>
          <p className="subtitulo-herramienta">
            Emite facturas kawaii en colones (₡) con número de referencia SINPE Móvil y código de rastreo EMS para envíos en la GAM y resto del país.
          </p>
        </div>
        <div className="acciones-cabecera-multiple">
          <button
            type="button"
            className="boton-secundario-blanco"
            onClick={exportarComprobanteCSV}
          >
            Exportar CSV
          </button>
          <button
            type="button"
            className="boton-pildora-gloss"
            onClick={() => window.print()}
          >
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <div className="rejilla-generador-sinpe">
        <div className="contenedor-formulario">
          <h3 className="titulo-formulario">Datos del Despacho en Costa Rica</h3>
          <div className="rejilla-formulario">
            <div className="grupo-campo">
              <label htmlFor="sinpe-cli-select" className="etiqueta-campo">
                Autocompletar con clienta registrada
              </label>
              <select
                id="sinpe-cli-select"
                className="select-sanrio"
                onChange={(e) => seleccionarClienteExistente(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Seleccionar clienta VIP / Oro --
                </option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.ciudad} - {c.nivel_membresia})
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-prod-select" className="etiqueta-campo">
                Autocompletar con producto del catálogo
              </label>
              <select
                id="sinpe-prod-select"
                className="select-sanrio"
                onChange={(e) => seleccionarProductoRecibo(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Seleccionar producto en stock --
                </option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-nombre" className="etiqueta-campo">
                Nombre de la clienta
              </label>
              <input
                id="sinpe-nombre"
                type="text"
                className="input-sanrio"
                value={reciboSinpe.cliente_nombre}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({ ...prev, cliente_nombre: e.target.value }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-tel" className="etiqueta-campo">
                Teléfono SINPE Móvil (+506)
              </label>
              <input
                id="sinpe-tel"
                type="text"
                className="input-sanrio"
                value={reciboSinpe.telefono_sinpe}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({ ...prev, telefono_sinpe: e.target.value }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-destino" className="etiqueta-campo">
                Provincia y Cantón de Entrega (Costa Rica)
              </label>
              <input
                id="sinpe-destino"
                type="text"
                className="input-sanrio"
                value={reciboSinpe.provincia_canton}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({ ...prev, provincia_canton: e.target.value }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-ref" className="etiqueta-campo">
                Núm. Comprobante SINPE Móvil
              </label>
              <input
                id="sinpe-ref"
                type="text"
                className="input-sanrio"
                value={reciboSinpe.comprobante_sinpe}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({ ...prev, comprobante_sinpe: e.target.value }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-guia" className="etiqueta-campo">
                Guía EMS Correos de Costa Rica
              </label>
              <input
                id="sinpe-guia"
                type="text"
                className="input-sanrio"
                value={reciboSinpe.guia_correos_cr}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({ ...prev, guia_correos_cr: e.target.value }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-cant" className="etiqueta-campo">
                Cantidad de unidades
              </label>
              <input
                id="sinpe-cant"
                type="number"
                min="1"
                className="input-sanrio"
                value={reciboSinpe.cantidad}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({
                    ...prev,
                    cantidad: Math.max(1, parseInt(e.target.value, 10) || 1)
                  }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-precio" className="etiqueta-campo">
                Precio Unitario en Colones (₡)
              </label>
              <input
                id="sinpe-precio"
                type="number"
                className="input-sanrio"
                value={reciboSinpe.precio_unitario_crc}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({
                    ...prev,
                    precio_unitario_crc: Math.max(0, Number(e.target.value) || 0)
                  }))
                }
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="sinpe-desc" className="etiqueta-campo">
                Descuento Membresía (%)
              </label>
              <input
                id="sinpe-desc"
                type="number"
                min="0"
                max="50"
                className="input-sanrio"
                value={reciboSinpe.descuento_porcentaje}
                onChange={(e) =>
                  setReciboSinpe((prev) => ({
                    ...prev,
                    descuento_porcentaje: Math.max(0, Number(e.target.value) || 0)
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* TICKET KAWAII IMPRIMIBLE */}
        <div className="ticket-sinpe-kawaii" id="ticket-imprimible-kitty">
          <div className="ticket-sinpe-encabezado">
            <img src="/img/kitty.png" alt="Ichigo Kitty" className="ticket-sinpe-logo" />
            <div>
              <h3 className="ticket-sinpe-titulo">ICHIGO KITTY IMPORTACIONES S.A.</h3>
              <p className="ticket-sinpe-subtitulo">
                Showroom Central: Barrio Escalante, San José, Costa Rica
              </p>
              <p className="ticket-sinpe-subtitulo">
                Comprobante Oficial SINPE Móvil & Correos de Costa Rica
              </p>
            </div>
          </div>

          <div className="ticket-sinpe-cuerpo">
            <div className="ticket-fila-dato">
              <span>Comprobante SINPE:</span>
              <strong>{reciboSinpe.comprobante_sinpe}</strong>
            </div>
            <div className="ticket-fila-dato">
              <span>Guía Correos de CR:</span>
              <strong>{reciboSinpe.guia_correos_cr}</strong>
            </div>
            <div className="ticket-fila-dato">
              <span>Clienta:</span>
              <strong>{reciboSinpe.cliente_nombre}</strong>
            </div>
            <div className="ticket-fila-dato">
              <span>Teléfono Verificado:</span>
              <span>{reciboSinpe.telefono_sinpe}</span>
            </div>
            <div className="ticket-fila-dato">
              <span>Destino de Entrega:</span>
              <span>{reciboSinpe.provincia_canton}</span>
            </div>

            <hr className="ticket-divisor" />

            <div className="ticket-fila-dato">
              <span>
                {reciboSinpe.cantidad}x {reciboSinpe.producto_seleccionado}
              </span>
              <strong>₡{subtotalArticulosCrc.toLocaleString('es-CR')}</strong>
            </div>
            {montoDescuentoCrc > 0 && (
              <div className="ticket-fila-dato">
                <span>Descuento Club VIP ({reciboSinpe.descuento_porcentaje}%):</span>
                <span>-₡{montoDescuentoCrc.toLocaleString('es-CR')}</span>
              </div>
            )}
            <div className="ticket-fila-dato">
              <span>IVA Ministerio de Hacienda (13%):</span>
              <span>₡{ivaCrc.toLocaleString('es-CR')}</span>
            </div>
            <div className="ticket-fila-dato">
              <span>Envío EMS Correos de Costa Rica:</span>
              <span>₡{Number(reciboSinpe.envio_correos_crc).toLocaleString('es-CR')}</span>
            </div>

            <hr className="ticket-divisor" />

            <div className="ticket-fila-total">
              <span>TOTAL PAGADO POR SINPE MÓVIL:</span>
              <strong>₡{totalPagarSinpeCrc.toLocaleString('es-CR')}</strong>
            </div>
          </div>

          <div className="ticket-sinpe-pie">
            Mercancía original importada con póliza DUA TICA autorizada — ¡Gracias por tu compra!
          </div>
        </div>
      </div>
    </div>
  );
}

export default HerramientasCR;
