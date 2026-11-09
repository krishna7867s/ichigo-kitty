import { useState, useEffect } from 'react';
import ModalConfirmar from '../components/ModalConfirmar';
import {
  listarEntidadGenerica,
  crearEntidadGenerica,
  actualizarEntidadGenerica,
  eliminarEntidadGenerica
} from '../services/api';
import { exportarDatosCSV } from '../utils/exportarCSV';

const ETIQUETAS_COLUMNAS = {
  id: 'ID',
  nombre: 'Nombre',
  descripcion: 'Descripción detallada',
  ubicacion: 'Ubicación física',
  capacidad_maxima: 'Capacidad máx.',
  responsable: 'Responsable',
  almacen_id: 'ID Almacén',
  almacen_nombre: 'Almacén',
  producto_id: 'ID Producto',
  producto_nombre: 'Producto',
  cantidad: 'Cantidad',
  pasillo: 'Pasillo / Estante',
  tipo_transporte: 'Transporte',
  tarifa_kg_usd: 'Tarifa Kg (USD)',
  contacto: 'Contacto',
  pais_origen: 'País origen',
  pedido_id: 'ID Pedido',
  agente_id: 'ID Agente',
  agente_nombre: 'Agente naviero',
  numero_pedimento: 'Núm. DUA / Pedimento',
  arancel_mxn: 'Impuesto Aduanal (CRC ₡)',
  estado_aduana: 'Estado Aduana',
  fecha_despacho: 'Fecha Despacho',
  correo: 'Correo electrónico',
  telefono: 'Teléfono',
  ciudad: 'Ciudad',
  nivel_membresia: 'Membresía',
  cliente_id: 'ID Cliente',
  cliente_nombre: 'Clienta',
  usuario_id: 'ID Usuario',
  fecha: 'Fecha',
  total: 'Total ($)',
  estado_venta: 'Estado Venta',
  venta_id: 'ID Venta',
  precio_unitario: 'Precio Unitario ($)',
  comision_porcentaje: 'Comisión (%)',
  activo: 'Activo',
  metodo_pago_id: 'ID Método',
  metodo_pago_nombre: 'Método de Pago',
  monto_cny: 'Monto (CNY ¥)',
  tipo_cambio: 'Tipo Cambio',
  referencia: 'Referencia',
  fecha_pago: 'Fecha Pago',
  precio_unitario_cny: 'Precio Unit. (CNY ¥)',
  personaje_principal: 'Personaje Principal',
  origen: 'País Origen',
  unidades_revisadas: 'Piezas Revisadas',
  resultado: 'Dictamen',
  descripcion_inspeccion: 'Observaciones de Inspección',
  codigo: 'Código Cupón',
  nombre_campana: 'Campaña',
  porcentaje_descuento: 'Descuento (%)',
  activa: 'Activa',
  tipo_incidencia: 'Tipo de Incidencia',
  descripcion_problema: 'Descripción del Problema',
  solucion_aplicada: 'Solución Aplicada',
  estado_incidencia: 'Estado',
  fecha_creacion: 'Fecha Registro'
};

const CATALOGO_TABLAS = [
  {
    recurso: 'marcas_licencias',
    area: 'Catálogo',
    titulo: 'Marcas y Licencias Oficiales',
    descripcion: 'Registro de colecciones y personajes oficiales (Sanrio Tokyo, Kuromi, Cinnamoroll) con su origen y descripción de autenticidad.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre de colección / licencia', tipo: 'text' },
      { nombre: 'personaje_principal', etiqueta: 'Personaje principal', tipo: 'text' },
      { nombre: 'origen', etiqueta: 'País de origen', tipo: 'text' },
      { nombre: 'descripcion', etiqueta: 'Descripción de la licencia y productos', tipo: 'text' }
    ]
  },
  {
    recurso: 'control_calidad',
    area: 'Bodega',
    titulo: 'Inspección y Control de Calidad',
    descripcion: 'Revisión física de las cajas que llegan desde China: verifica costuras, etiquetas, estado del empaque y piezas aprobadas.',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido revisado', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'unidades_revisadas', etiqueta: 'Unidades inspeccionadas', tipo: 'number' },
      {
        nombre: 'resultado',
        etiqueta: 'Dictamen de calidad',
        tipo: 'select',
        opciones: ['Aprobado', 'Con detalles', 'Rechazado']
      },
      { nombre: 'descripcion_inspeccion', etiqueta: 'Descripción detallada de la revisión', tipo: 'text' }
    ]
  },
  {
    recurso: 'almacenes',
    area: 'Bodega',
    titulo: 'Almacenes y Bodegas',
    descripcion: 'Control de sucursales, bodegas de almacenamiento y showrooms donde se resguarda la mercancía importada.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre del almacén', tipo: 'text' },
      { nombre: 'ubicacion', etiqueta: 'Dirección / Ubicación', tipo: 'text' },
      { nombre: 'capacidad_maxima', etiqueta: 'Capacidad máxima (unidades)', tipo: 'number' },
      { nombre: 'responsable', etiqueta: 'Encargada de bodega', tipo: 'text' }
    ]
  },
  {
    recurso: 'inventario_almacen',
    area: 'Bodega',
    titulo: 'Ubicación de Inventario por Pasillo',
    descripcion: 'Distribución exacta de cada producto dentro de los pasillos, vitrinas y estantes de cada bodega.',
    campos: [
      { nombre: 'almacen_id', etiqueta: 'ID Almacén', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'cantidad', etiqueta: 'Cantidad en pasillo', tipo: 'number' },
      { nombre: 'pasillo', etiqueta: 'Pasillo / Estante / Vitrina', tipo: 'text' }
    ]
  },
  {
    recurso: 'agentes_envio',
    area: 'Logística',
    titulo: 'Agentes Navieros y Carga Internacional',
    descripcion: 'Empresas transportistas (aéreo, marítimo y exprés) que traen las cajas desde Guangzhou, Yiwu y Shenzhen.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre de la agencia', tipo: 'text' },
      {
        nombre: 'tipo_transporte',
        etiqueta: 'Modalidad de transporte',
        tipo: 'select',
        opciones: ['Aéreo', 'Marítimo', 'Exprés']
      },
      { nombre: 'tarifa_kg_usd', etiqueta: 'Tarifa por Kg (USD)', tipo: 'number' },
      { nombre: 'contacto', etiqueta: 'Correo o WeChat del agente', tipo: 'text' },
      { nombre: 'pais_origen', etiqueta: 'País de salida', tipo: 'text' }
    ]
  },
  {
    recurso: 'aduana_despachos',
    area: 'Logística',
    titulo: 'DUA y Despachos de Aduana (Santamaría / Caldera)',
    descripcion: 'Seguimiento de trámites aduanales de importación en Costa Rica, cálculo de impuestos y liberación de lotes.',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido de importación', tipo: 'number' },
      { nombre: 'agente_id', etiqueta: 'ID Agente naviero', tipo: 'number' },
      { nombre: 'numero_pedimento', etiqueta: 'Número de DUA / Pedimento', tipo: 'text' },
      { nombre: 'arancel_mxn', etiqueta: 'Impuestos aduanales (CRC ₡)', tipo: 'number' },
      {
        nombre: 'estado_aduana',
        etiqueta: 'Estado en aduana',
        tipo: 'select',
        opciones: ['en_revision', 'liberado', 'retenido']
      }
    ]
  },
  {
    recurso: 'incidencias_envio',
    area: 'Logística',
    titulo: 'Bitácora de Incidencias de Envío',
    descripcion: 'Registro de demoras en vuelos, revisiones aduanales o ajustes logísticos con la descripción del problema y su solución.',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido afectado', tipo: 'number' },
      { nombre: 'tipo_incidencia', etiqueta: 'Tipo de incidencia', tipo: 'text' },
      { nombre: 'descripcion_problema', etiqueta: 'Descripción detallada del problema', tipo: 'text' },
      { nombre: 'solucion_aplicada', etiqueta: 'Solución aplicada', tipo: 'text' },
      {
        nombre: 'estado_incidencia',
        etiqueta: 'Estado actual',
        tipo: 'select',
        opciones: ['Abierta', 'En seguimiento', 'Resuelta']
      }
    ]
  },
  {
    recurso: 'clientes',
    area: 'Comercial',
    titulo: 'Directorio de Clientas y Club VIP',
    descripcion: 'Base de datos de compradoras frecuentes de la tienda con su ciudad, contacto y nivel de membresía.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre completo', tipo: 'text' },
      { nombre: 'correo', etiqueta: 'Correo electrónico', tipo: 'text' },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'text' },
      { nombre: 'ciudad', etiqueta: 'Ciudad', tipo: 'text' },
      {
        nombre: 'nivel_membresia',
        etiqueta: 'Nivel en el Club Ichigo',
        tipo: 'select',
        opciones: ['Bronce', 'Plata', 'Oro', 'VIP']
      }
    ]
  },
  {
    recurso: 'ventas',
    area: 'Comercial',
    titulo: 'Pedidos de Venta a Clientas',
    descripcion: 'Órdenes de compra realizadas por las clientas en Costa Rica (San José, Heredia, Alajuela, Cartago) sobre los artículos en inventario.',
    campos: [
      { nombre: 'cliente_id', etiqueta: 'ID Clienta', tipo: 'number' },
      { nombre: 'total', etiqueta: 'Monto total de venta ($)', tipo: 'number' },
      {
        nombre: 'estado_venta',
        etiqueta: 'Estado de la venta',
        tipo: 'select',
        opciones: ['pendiente', 'pagada', 'enviada', 'cancelada']
      }
    ]
  },
  {
    recurso: 'detalle_venta',
    area: 'Comercial',
    titulo: 'Desglose de Artículos Vendidos',
    descripcion: 'Renglones individuales de cada venta nacional con el producto, unidades vendidas y precio unitario.',
    campos: [
      { nombre: 'venta_id', etiqueta: 'ID Venta', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'cantidad', etiqueta: 'Cantidad vendida', tipo: 'number' },
      { nombre: 'precio_unitario', etiqueta: 'Precio unitario ($)', tipo: 'number' }
    ]
  },
  {
    recurso: 'promociones_descuentos',
    area: 'Comercial',
    titulo: 'Promociones y Campañas de Temporada',
    descripcion: 'Cupones y campañas de descuento por temporada con su descripción comercial y porcentaje aplicable.',
    campos: [
      { nombre: 'codigo', etiqueta: 'Código del cupón', tipo: 'text' },
      { nombre: 'nombre_campana', etiqueta: 'Nombre de la campaña', tipo: 'text' },
      { nombre: 'porcentaje_descuento', etiqueta: 'Descuento (%)', tipo: 'number' },
      { nombre: 'descripcion', etiqueta: 'Descripción y condiciones de la promoción', tipo: 'text' },
      { nombre: 'activa', etiqueta: 'Activa (1 = Sí, 0 = No)', tipo: 'number' }
    ]
  },
  {
    recurso: 'metodos_pago',
    area: 'Finanzas',
    titulo: 'Pasarelas y Métodos de Pago Internacional',
    descripcion: 'Medios utilizados para liquidar compras en yuanes (Alipay, WeChat Pay, Wise) y su porcentaje de comisión.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre de la pasarela', tipo: 'text' },
      { nombre: 'comision_porcentaje', etiqueta: 'Comisión por transacción (%)', tipo: 'number' },
      { nombre: 'activo', etiqueta: 'Activo (1 = Sí, 0 = No)', tipo: 'number' }
    ]
  },
  {
    recurso: 'pagos_proveedor',
    area: 'Finanzas',
    titulo: 'Transferencias y Pagos a Proveedores Chinos',
    descripcion: 'Historial de pagos enviados a tiendas de Taobao y 1688 en yuanes (CNY), tipo de cambio aplicado y referencia.',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido liquidado', tipo: 'number' },
      { nombre: 'metodo_pago_id', etiqueta: 'ID Método de pago', tipo: 'number' },
      { nombre: 'monto_cny', etiqueta: 'Monto pagado (CNY ¥)', tipo: 'number' },
      { nombre: 'tipo_cambio', etiqueta: 'Tipo de cambio (MXN/CNY)', tipo: 'number' },
      { nombre: 'referencia', etiqueta: 'Folio / Referencia de pago', tipo: 'text' }
    ]
  },
  {
    recurso: 'detalle_pedido',
    area: 'Logística',
    titulo: 'Líneas de Detalle de Pedidos de Importación',
    descripcion: 'Renglones de cada pedido a China indicando qué producto se pidió, cuántas piezas y su costo unitario en yuanes.',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'cantidad', etiqueta: 'Cantidad importada', tipo: 'number' },
      { nombre: 'precio_unitario_cny', etiqueta: 'Costo unitario (CNY ¥)', tipo: 'number' }
    ]
  },
  {
    recurso: 'roles',
    area: 'Personal',
    titulo: 'Roles y Puestos del Equipo',
    descripcion: 'Perfiles operativos dentro de la empresa (Dirección, Importaciones, Almacén y Ventas) con sus responsabilidades.',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre del puesto / rol', tipo: 'text' },
      { nombre: 'descripcion', etiqueta: 'Descripción de funciones', tipo: 'text' }
    ]
  },
  {
    recurso: 'usuarios',
    area: 'Personal',
    titulo: 'Cuentas de Usuario con Acceso JWT',
    descripcion: 'Personal registrado en el sistema con contraseña cifrada mediante bcryptjs y acceso protegido por token.',
    soloLectura: true,
    campos: []
  }
];

function Operaciones() {
  const [indiceTabla, setIndiceTabla] = useState(0);
  const [registros, setRegistros] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [registroEnEdicion, setRegistroEnEdicion] = useState(null);
  const [valoresFormulario, setValoresFormulario] = useState({});
  const [registroParaEliminar, setRegistroParaEliminar] = useState(null);
  const [errorBackend, setErrorBackend] = useState('');

  const tablaActual = CATALOGO_TABLAS[indiceTabla];

  async function cargarRegistros() {
    setErrorBackend('');
    try {
      const datos = await listarEntidadGenerica(tablaActual.recurso);
      setRegistros(datos);
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'No se pudieron cargar los registros de la tabla'
      );
    }
  }

  useEffect(() => {
    setMostrarFormulario(false);
    setRegistroEnEdicion(null);
    cargarRegistros();
  }, [indiceTabla]);

  function abrirCrear() {
    const iniciales = {};
    tablaActual.campos.forEach((c) => {
      iniciales[c.nombre] = c.opciones ? c.opciones[0] : '';
    });
    setValoresFormulario(iniciales);
    setRegistroEnEdicion(null);
    setErrorBackend('');
    setMostrarFormulario(true);
  }

  function abrirEditar(fila) {
    const iniciales = {};
    tablaActual.campos.forEach((c) => {
      iniciales[c.nombre] =
        fila[c.nombre] !== null && fila[c.nombre] !== undefined
          ? String(fila[c.nombre])
          : '';
    });
    setValoresFormulario(iniciales);
    setRegistroEnEdicion(fila);
    setErrorBackend('');
    setMostrarFormulario(true);
  }

  async function guardarRegistro(evento) {
    evento.preventDefault();
    setErrorBackend('');
    const payload = {};
    tablaActual.campos.forEach((c) => {
      const val = valoresFormulario[c.nombre];
      payload[c.nombre] = c.tipo === 'number' && val !== '' ? Number(val) : val;
    });

    try {
      if (registroEnEdicion) {
        await actualizarEntidadGenerica(tablaActual.recurso, registroEnEdicion.id, payload);
      } else {
        await crearEntidadGenerica(tablaActual.recurso, payload);
      }
      setMostrarFormulario(false);
      setRegistroEnEdicion(null);
      await cargarRegistros();
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'No se pudo guardar el registro'
      );
    }
  }

  async function confirmarEliminacion() {
    if (!registroParaEliminar) return;
    setErrorBackend('');
    try {
      await eliminarEntidadGenerica(tablaActual.recurso, registroParaEliminar.id);
      setRegistroParaEliminar(null);
      await cargarRegistros();
    } catch (err) {
      setRegistroParaEliminar(null);
      setErrorBackend(
        err.response?.data?.error || 'No se pudo eliminar el registro'
      );
    }
  }

  const columnas = registros.length > 0 ? Object.keys(registros[0]) : ['id'];

  return (
    <div>
      <div className="panel-selector-modulos">
        <div className="titulo-selector-modulos">
          Selecciona un módulo del sistema empresarial ({CATALOGO_TABLAS.length} módulos adicionales + 4 principales = 20 tablas):
        </div>
        <div className="rejilla-botones-modulos">
          {CATALOGO_TABLAS.map((tab, idx) => (
            <button
              key={tab.recurso}
              type="button"
              className={
                idx === indiceTabla
                  ? 'boton-modulo-tab boton-modulo-tab-activo'
                  : 'boton-modulo-tab'
              }
              onClick={() => setIndiceTabla(idx)}
            >
              <span className="etiqueta-area-modulo">{tab.area}</span>
              <span>{tab.titulo}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cabecera-pagina-crud">
        <div>
          <h1 className="titulo-pagina-crud">{tablaActual.titulo}</h1>
          <p className="descripcion-modulo-activa">{tablaActual.descripcion}</p>
        </div>

        <div className="acciones-cabecera-multiple">
          <button
            type="button"
            className="boton-secundario-blanco"
            onClick={() =>
              exportarDatosCSV(`reporte_${tablaActual.recurso}_cr.csv`, registros)
            }
          >
            Exportar Tabla a Excel (CSV)
          </button>
          {!tablaActual.soloLectura && (
            <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
              Agregar en {tablaActual.recurso}
            </button>
          )}
        </div>
      </div>

      {errorBackend && (
        <div className="caja-error-api" role="alert">
          <span>{errorBackend}</span>
          <button
            type="button"
            className="boton-cerrar-error"
            onClick={() => setErrorBackend('')}
          >
            Cerrar
          </button>
        </div>
      )}

      {mostrarFormulario && !tablaActual.soloLectura && (
        <form className="panel-formulario" onSubmit={guardarRegistro}>
          <h2 className="titulo-formulario">
            {registroEnEdicion
              ? `Editar registro #${registroEnEdicion.id} en ${tablaActual.titulo}`
              : `Nuevo registro en ${tablaActual.titulo}`}
          </h2>

          <div className="rejilla-formulario">
            {tablaActual.campos.map((campo) => (
              <div key={campo.nombre} className="grupo-campo">
                <label htmlFor={`op-${campo.nombre}`}>{campo.etiqueta}</label>
                {campo.tipo === 'select' ? (
                  <select
                    id={`op-${campo.nombre}`}
                    className="select-sanrio"
                    value={valoresFormulario[campo.nombre] || ''}
                    onChange={(e) =>
                      setValoresFormulario((prev) => ({
                        ...prev,
                        [campo.nombre]: e.target.value
                      }))
                    }
                  >
                    {campo.opciones.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`op-${campo.nombre}`}
                    type={campo.tipo}
                    step={campo.tipo === 'number' ? 'any' : undefined}
                    className="input-sanrio"
                    value={valoresFormulario[campo.nombre] ?? ''}
                    onChange={(e) =>
                      setValoresFormulario((prev) => ({
                        ...prev,
                        [campo.nombre]: e.target.value
                      }))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div className="acciones-formulario">
            <button type="submit" className="boton-pildora-gloss">
              Guardar cambios
            </button>
            <button
              type="button"
              className="boton-secundario-blanco"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="contenedor-tabla">
        <table className="tabla-sanrio">
          <thead>
            <tr>
              {columnas.map((col) => (
                <th key={col}>{ETIQUETAS_COLUMNAS[col] || col}</th>
              ))}
              {!tablaActual.soloLectura && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan={columnas.length + 1}>No hay registros en esta tabla.</td>
              </tr>
            ) : (
              registros.map((fila) => (
                <tr key={fila.id}>
                  {columnas.map((col) => (
                    <td key={col}>
                      {fila[col] !== null && fila[col] !== undefined
                        ? String(fila[col])
                        : '—'}
                    </td>
                  ))}
                  {!tablaActual.soloLectura && (
                    <td>
                      <div className="celda-acciones">
                        <button
                          type="button"
                          className="enlace-azul-corazon"
                          onClick={() => abrirEditar(fila)}
                        >
                          <svg
                            width="11"
                            height="10"
                            viewBox="0 0 12 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M6 10.2C5.7 9.95 1 6.3 1 3.4C1 1.85 2.2 0.7 3.7 0.7C4.65 0.7 5.5 1.18 6 1.95C6.5 1.18 7.35 0.7 8.3 0.7C9.8 0.7 11 1.85 11 3.4C11 6.3 6.3 9.95 6 10.2Z"
                              fill="#1f6bcc"
                            />
                          </svg>
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          className="enlace-eliminar-rosa"
                          onClick={() => setRegistroParaEliminar(fila)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalConfirmar
        visible={Boolean(registroParaEliminar)}
        nombreElemento={
          registroParaEliminar
            ? registroParaEliminar.nombre ||
              registroParaEliminar.nombre_campana ||
              registroParaEliminar.numero_pedimento ||
              registroParaEliminar.referencia ||
              `Registro #${registroParaEliminar.id}`
            : ''
        }
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setRegistroParaEliminar(null)}
      />
    </div>
  );
}

export default Operaciones;
