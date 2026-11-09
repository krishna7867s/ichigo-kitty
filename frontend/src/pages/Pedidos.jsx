import { useState, useEffect } from 'react';
import TablaPedidos from '../components/TablaPedidos';
import FormularioPedido from '../components/FormularioPedido';
import ModalConfirmar from '../components/ModalConfirmar';
import {
  obtenerPedidos,
  obtenerProveedores,
  obtenerProductos,
  obtenerDetallesPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
  crearDetallePedido,
  actualizarDetallePedido,
  eliminarDetallePedido
} from '../services/api';
import { exportarDatosCSV } from '../utils/exportarCSV';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detallesPorPedido, setDetallesPorPedido] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pedidoEnEdicion, setPedidoEnEdicion] = useState(null);
  const [pedidoParaEliminar, setPedidoParaEliminar] = useState(null);
  const [errorBackend, setErrorBackend] = useState('');

  async function cargarDatos() {
    try {
      const [listaPedidos, listaProveedores, listaProductos, listaDetalles] =
        await Promise.all([
          obtenerPedidos(),
          obtenerProveedores(),
          obtenerProductos(),
          obtenerDetallesPedido()
        ]);

      const agrupados = {};
      listaDetalles.forEach((det) => {
        if (!agrupados[det.pedido_id]) {
          agrupados[det.pedido_id] = [];
        }
        agrupados[det.pedido_id].push(det);
      });

      setPedidos(listaPedidos);
      setProveedores(listaProveedores);
      setProductos(listaProductos);
      setDetallesPorPedido(agrupados);
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'Error al cargar los pedidos'
      );
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function abrirCrear() {
    setErrorBackend('');
    setPedidoEnEdicion(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(pedido) {
    setErrorBackend('');
    setPedidoEnEdicion(pedido);
    setMostrarFormulario(true);
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);
    setPedidoEnEdicion(null);
  }

  async function guardarPedido(datosPedido, lineasFormulario) {
    setErrorBackend('');
    try {
      if (pedidoEnEdicion) {
        const pedidoId = pedidoEnEdicion.id;
        const detallesExistentes = detallesPorPedido[pedidoId] || [];

        if (pedidoEnEdicion.estado !== 'recibido') {
          const idsEnFormulario = lineasFormulario
            .filter((l) => l.id)
            .map((l) => l.id);

          for (const detAntiguo of detallesExistentes) {
            if (!idsEnFormulario.includes(detAntiguo.id)) {
              await eliminarDetallePedido(detAntiguo.id);
            }
          }

          for (const linea of lineasFormulario) {
            if (linea.id) {
              await actualizarDetallePedido(linea.id, {
                pedido_id: pedidoId,
                producto_id: linea.producto_id,
                cantidad: linea.cantidad,
                precio_unitario_cny: linea.precio_unitario_cny
              });
            } else {
              await crearDetallePedido({
                pedido_id: pedidoId,
                producto_id: linea.producto_id,
                cantidad: linea.cantidad,
                precio_unitario_cny: linea.precio_unitario_cny
              });
            }
          }
        }

        await actualizarPedido(pedidoId, datosPedido);
      } else {
        const estadoInicial = datosPedido.estado === 'recibido' ? 'pedido' : datosPedido.estado;
        const nuevo = await crearPedido({
          ...datosPedido,
          estado: estadoInicial
        });

        try {
          for (const linea of lineasFormulario) {
            await crearDetallePedido({
              pedido_id: nuevo.id,
              producto_id: linea.producto_id,
              cantidad: linea.cantidad,
              precio_unitario_cny: linea.precio_unitario_cny
            });
          }

          if (datosPedido.estado === 'recibido') {
            await actualizarPedido(nuevo.id, {
              ...datosPedido,
              estado: 'recibido'
            });
          }
        } catch (errorDetalle) {
          await eliminarPedido(nuevo.id);
          throw errorDetalle;
        }
      }

      await cargarDatos();
      cerrarFormulario();
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'No se pudo guardar el pedido'
      );
    }
  }

  async function confirmarEliminacion() {
    if (!pedidoParaEliminar) return;
    setErrorBackend('');
    try {
      await eliminarPedido(pedidoParaEliminar.id);
      setPedidoParaEliminar(null);
      await cargarDatos();
    } catch (err) {
      setPedidoParaEliminar(null);
      setErrorBackend(
        err.response?.data?.error || 'No se pudo eliminar el pedido'
      );
    }
  }

  function exportarPedidosCSV() {
    exportarDatosCSV(
      'pedidos_importacion_china_costa_rica.csv',
      pedidos.map((p) => ({
        ID_Pedido: p.id,
        Proveedor_China: p.proveedor_nombre,
        Fecha_Orden: p.fecha,
        Estado_Logistico: p.estado,
        Guia_Rastreo: p.rastreo || 'Sin guia',
        Flete_USD: p.costo_envio,
        Total_FOB_CNY: p.total_cny
      }))
    );
  }

  return (
    <div>
      <div className="cabecera-pagina-crud">
        <h1 className="titulo-pagina-crud">Pedidos de Importación y Rastreador China -&gt; Costa Rica</h1>
        <div className="acciones-cabecera-multiple">
          <button
            type="button"
            className="boton-secundario-blanco"
            onClick={exportarPedidosCSV}
          >
            Exportar Pedidos a Excel (CSV)
          </button>
          <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
            Agregar pedido
          </button>
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

      {mostrarFormulario && (
        <FormularioPedido
          pedidoActual={pedidoEnEdicion}
          lineasIniciales={pedidoEnEdicion ? detallesPorPedido[pedidoEnEdicion.id] || [] : []}
          proveedores={proveedores}
          productos={productos}
          alGuardar={guardarPedido}
          alCancelar={cerrarFormulario}
        />
      )}

      <TablaPedidos
        pedidos={pedidos}
        detallesPorPedido={detallesPorPedido}
        alEditar={abrirEditar}
        alEliminar={(ped) => {
          setErrorBackend('');
          setPedidoParaEliminar(ped);
        }}
      />

      <ModalConfirmar
        visible={Boolean(pedidoParaEliminar)}
        nombreElemento={pedidoParaEliminar ? `Pedido #${pedidoParaEliminar.id}` : ''}
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setPedidoParaEliminar(null)}
      />
    </div>
  );
}

export default Pedidos;
