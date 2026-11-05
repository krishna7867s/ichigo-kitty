import { useState, useEffect } from 'react';
import ModalConfirmar from '../components/ModalConfirmar';
import {
  listarEntidadGenerica,
  crearEntidadGenerica,
  actualizarEntidadGenerica,
  eliminarEntidadGenerica
} from '../services/api';

const CATALOGO_TABLAS = [
  {
    recurso: 'roles',
    titulo: 'Roles de Personal',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre del rol', tipo: 'text' },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text' }
    ]
  },
  {
    recurso: 'almacenes',
    titulo: 'Almacenes y Bodegas',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre del almacén', tipo: 'text' },
      { nombre: 'ubicacion', etiqueta: 'Ubicación', tipo: 'text' },
      { nombre: 'capacidad_maxima', etiqueta: 'Capacidad máxima', tipo: 'number' },
      { nombre: 'responsable', etiqueta: 'Responsable', tipo: 'text' }
    ]
  },
  {
    recurso: 'inventario_almacen',
    titulo: 'Inventario por Almacén',
    campos: [
      { nombre: 'almacen_id', etiqueta: 'ID Almacén', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number' },
      { nombre: 'pasillo', etiqueta: 'Pasillo / Ubicación', tipo: 'text' }
    ]
  },
  {
    recurso: 'agentes_envio',
    titulo: 'Agentes Navieros y Carga',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre de agencia', tipo: 'text' },
      {
        nombre: 'tipo_transporte',
        etiqueta: 'Transporte (Aéreo / Marítimo / Exprés)',
        tipo: 'select',
        opciones: ['Aéreo', 'Marítimo', 'Exprés']
      },
      { nombre: 'tarifa_kg_usd', etiqueta: 'Tarifa por Kg (USD)', tipo: 'number' },
      { nombre: 'contacto', etiqueta: 'Contacto', tipo: 'text' },
      { nombre: 'pais_origen', etiqueta: 'País de origen', tipo: 'text' }
    ]
  },
  {
    recurso: 'aduana_despachos',
    titulo: 'Despachos de Aduana',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido', tipo: 'number' },
      { nombre: 'agente_id', etiqueta: 'ID Agente de envío', tipo: 'number' },
      { nombre: 'numero_pedimento', etiqueta: 'Número de pedimento', tipo: 'text' },
      { nombre: 'arancel_mxn', etiqueta: 'Arancel (MXN)', tipo: 'number' },
      {
        nombre: 'estado_aduana',
        etiqueta: 'Estado aduanal',
        tipo: 'select',
        opciones: ['en_revision', 'liberado', 'retenido']
      }
    ]
  },
  {
    recurso: 'clientes',
    titulo: 'Clientas y Membresías',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre completo', tipo: 'text' },
      { nombre: 'correo', etiqueta: 'Correo electrónico', tipo: 'text' },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'text' },
      { nombre: 'ciudad', etiqueta: 'Ciudad', tipo: 'text' },
      {
        nombre: 'nivel_membresia',
        etiqueta: 'Membresía',
        tipo: 'select',
        opciones: ['Bronce', 'Plata', 'Oro', 'VIP']
      }
    ]
  },
  {
    recurso: 'ventas',
    titulo: 'Ventas Nacionales',
    campos: [
      { nombre: 'cliente_id', etiqueta: 'ID Cliente', tipo: 'number' },
      { nombre: 'total', etiqueta: 'Total de venta', tipo: 'number' },
      {
        nombre: 'estado_venta',
        etiqueta: 'Estado de venta',
        tipo: 'select',
        opciones: ['pendiente', 'pagada', 'enviada', 'cancelada']
      }
    ]
  },
  {
    recurso: 'detalle_venta',
    titulo: 'Detalles de Venta',
    campos: [
      { nombre: 'venta_id', etiqueta: 'ID Venta', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number' },
      { nombre: 'precio_unitario', etiqueta: 'Precio unitario', tipo: 'number' }
    ]
  },
  {
    recurso: 'metodos_pago',
    titulo: 'Métodos de Pago Internacional',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre del método', tipo: 'text' },
      { nombre: 'comision_porcentaje', etiqueta: 'Comisión (%)', tipo: 'number' },
      { nombre: 'activo', etiqueta: 'Activo (1 = Sí, 0 = No)', tipo: 'number' }
    ]
  },
  {
    recurso: 'pagos_proveedor',
    titulo: 'Pagos a Proveedores (CNY)',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido', tipo: 'number' },
      { nombre: 'metodo_pago_id', etiqueta: 'ID Método de pago', tipo: 'number' },
      { nombre: 'monto_cny', etiqueta: 'Monto (CNY)', tipo: 'number' },
      { nombre: 'tipo_cambio', etiqueta: 'Tipo de cambio', tipo: 'number' },
      { nombre: 'referencia', etiqueta: 'Referencia bancaria', tipo: 'text' }
    ]
  },
  {
    recurso: 'detalle_pedido',
    titulo: 'Líneas de Detalle de Pedido',
    campos: [
      { nombre: 'pedido_id', etiqueta: 'ID Pedido', tipo: 'number' },
      { nombre: 'producto_id', etiqueta: 'ID Producto', tipo: 'number' },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number' },
      { nombre: 'precio_unitario_cny', etiqueta: 'Precio unitario (CNY)', tipo: 'number' }
    ]
  },
  {
    recurso: 'usuarios',
    titulo: 'Usuarios Registrados (Solo lectura)',
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
      iniciales[c.nombre] = fila[c.nombre] !== null && fila[c.nombre] !== undefined ? String(fila[c.nombre]) : '';
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
      <div className="cabecera-pagina-crud">
        <h1 className="titulo-pagina-crud">{tablaActual.titulo}</h1>
        <div className="acciones-formulario">
          <label htmlFor="selector-tabla-operaciones" className="etiqueta-busqueda">
            Tabla:
          </label>
          <select
            id="selector-tabla-operaciones"
            className="select-sanrio"
            value={indiceTabla}
            onChange={(e) => setIndiceTabla(Number(e.target.value))}
          >
            {CATALOGO_TABLAS.map((t, idx) => (
              <option key={t.recurso} value={idx}>
                {t.titulo} ({t.recurso})
              </option>
            ))}
          </select>

          {!tablaActual.soloLectura && (
            <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
              Agregar registro
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
              ? `Editar registro #${registroEnEdicion.id}`
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
                      setValoresFormulario((prev) => ({ ...prev, [campo.nombre]: e.target.value }))
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
                      setValoresFormulario((prev) => ({ ...prev, [campo.nombre]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div className="acciones-formulario">
            <button type="submit" className="boton-pildora-gloss">
              Guardar
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
                <th key={col}>{col}</th>
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
                    <td key={col}>{fila[col] !== null && fila[col] !== undefined ? String(fila[col]) : '—'}</td>
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
